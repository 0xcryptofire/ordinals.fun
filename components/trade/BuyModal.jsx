import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import * as bitcoin from "bitcoinjs-lib";
import usePSBT from "../../hooks/usePSBT";
import {
  getTxHexById,
  calculateFee,
  addressFormat,
  satoshisToBTC,
} from "@/utils";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { WalletContext } from "../../context/wallet";
import {
  ref,
  orderByChild,
  equalTo,
  query,
  onValue,
  update,
  get,
} from "firebase/database";
import { db } from "@/services/firebase";
import { AiFillCheckCircle, AiOutlineLoading } from "react-icons/ai";
import BuyBills from "./BuyBills";
import { feeAddress, service_fee_rate } from "../../configs/constants";
import { Psbt } from "bitcoinjs-lib";
import useActivities from "../../hooks/useActivities";
import useUTXOs from "../../hooks/useUTXOs";
import { MdOutlineCancel } from "react-icons/md";

export default function BuyModal({
  modalIsOpen,
  setIsOpen,
  list,
  utxos,
  sortedUtxos,
  dummyUTXOs,
  refreshUTXOs,
  selectUtxos,
  tag,
}) {
  const dummyUtxoValue = 3000;
  const wallet = useContext(WalletContext);
  const address = wallet.getAddress();
  const { psbt, networks } = usePSBT({ network: "litecoin" });
  const { addActiviyForBuy, updateListForSold } = useActivities();
  const [pendingTx, setPendingTx] = useState(false);
  const [dummyTx, setDummyTx] = useState("");
  const [succeed, setSucceed] = useState(false);
  const [buyTx, setBuyTx] = useState("");

  function closeModal() {
    setIsOpen(false);
    setSucceed(false);
    setBuyTx("");
    setDummyTx("");
  }

  const recommendedFeeRate = async () => {
    const res = await fetch(
      `https://litecoinspace.org/api/v1/fees/recommended`
    );
    const fee = await res.json();
    return fee["hourFee"];
  };

  function validateSellerPSBTAndExtractPrice(
    sellerSignedPsbtBase64,
    utxo = list?.data?.output
  ) {
    try {
      const sellerSignedPsbt = bitcoin.Psbt.fromBase64(sellerSignedPsbtBase64, {
        network: networks["litecoin"],
      });
      const sellerInput = sellerSignedPsbt.txInputs[0];
      const sellerSignedPsbtInput = `${sellerInput.hash
        .reverse()
        .toString("hex")}:${sellerInput.index}`;

      if (sellerSignedPsbtInput != utxo) {
        toast.error(
          `Seller signed PSBT does not match this inscription\n\n${sellerSignedPsbtInput}\n!=\n${utxo}`
        );
      }

      if (
        sellerSignedPsbt.txInputs.length != 1 ||
        sellerSignedPsbt.txOutputs.length != 1
      ) {
        return {
          price: 0,
          seller: "",
          sellerSignedPsbt: {},
        };
      }

      const sellerOutput = sellerSignedPsbt.txOutputs[0];

      return {
        price: Number(sellerOutput.value),
        seller: sellerOutput?.address,
        sellerSignedPsbt: sellerSignedPsbt,
      };
    } catch (e) {
      return {
        price: 0,
        seller: "",
        sellerSignedPsbt: {},
      };
    }
  }

  async function generatePSBTGeneratingDummyUtxos() {
    if (!psbt) {
      toast.error("PSBT is not generated yet.");
      return;
    }

    if (!address) {
      toast.error("Please connect wallet");
      return;
    }

    try {
      setPendingTx(true);
      let totalValue = 0;
      for (const utxo of utxos) {
        if (utxo.txId) {
          const txHEX = await getTxHexById(utxo.txId);
          const tx = bitcoin.Transaction.fromHex(txHEX);
          for (const output in tx.outs) {
            try {
              tx.setWitness(parseInt(output), []);
            } catch {}
          }

          psbt.addInput({
            hash: utxo.txId,
            index: utxo.outputIndex,
            nonWitnessUtxo: tx.toBuffer(),
            // witnessUtxo: tx.outs[utxo.vout],
          });

          totalValue += utxo.satoshis;
        }
      }

      for (let i = 0; i < 2; i++) {
        psbt.addOutput({
          address: address,
          value: 3000,
        });
      }

      const fee = calculateFee(psbt.txInputs.length, psbt.txOutputs.length, 1);

      // Change utxo
      psbt.addOutput({
        address: address,
        value: totalValue - 2 * 3000 - fee,
      });

      const singedPSBT = await wallet.signPsbt(psbt, {});
      const rawtx = singedPSBT.extractTransaction().toHex();

      const txId = await wallet.pushTx(rawtx);
      setDummyTx(txId);
      setPendingTx(false);
      refreshUTXOs();
      toast.success("Successfully create 2 dummy UTXOs.");
    } catch (error) {
      //  console.log(error);
      setPendingTx(false);
      toast.error(error?.message);
    }
  }

  async function generatePSBTBuyingInscription() {
    const psbt = new Psbt({
      network: networks["litecoin"],
    });
    const payerAddress = address;
    const dummyUtxos = dummyUTXOs;

    if (!payerAddress) {
      toast.error("Please connect wallet");
      return;
    }

    if (dummyUtxos?.length < 2) {
      toast.error("Please create dummy UTXOs");
      return;
    }

    const { price, seller, sellerSignedPsbt } =
      await validateSellerPSBTAndExtractPrice(list?.psbt);

    if (!price) {
      toast.error("Unkown Price");
      return;
    }

    if (!seller) {
      toast.error("Unkown Price");
      return;
    }

    let totalValue = 0;
    let totalPaymentValue = 0;

    try {
      setPendingTx(true);

      let minimumValueRequired;
      let vins;
      let vouts;

      minimumValueRequired = price + price * 0.02 + 2 * dummyUtxoValue;
      vins = 1;
      vouts = 2 + 2;

      const feeRate = await recommendedFeeRate();

      const paymentUtxos = await selectUtxos(
        sortedUtxos,
        minimumValueRequired,
        vins,
        vouts,
        feeRate
      );

      if (paymentUtxos?.length <= 0) {
        toast.error("You don't have enought balance");
        return;
      }

      // Add two dummy utxos inputs
      for (var i = 0; i < 2; i++) {
        const tx = bitcoin.Transaction.fromHex(
          await getTxHexById(dummyUtxos[i].txid)
        );
        for (const output in tx.outs) {
          try {
            tx.setWitness(parseInt(output), []);
          } catch {}
        }

        psbt.addInput({
          hash: dummyUtxos[i].txid,
          index: dummyUtxos[i].vout,
          nonWitnessUtxo: tx.toBuffer(),
          // witnessUtxo: tx.outs[dummyUtxo.vout],
        });
      }

      // Add dummy output
      psbt.addOutput({
        address: payerAddress,
        value: dummyUtxos[0].value + dummyUtxos[1].value,
      });

      // Add inscription output
      psbt.addOutput({
        address: payerAddress,
        value: sellerSignedPsbt.data.inputs[0].witnessUtxo.value,
      });

      // Add payer signed input
      psbt.addInput({
        ...sellerSignedPsbt.data.globalMap.unsignedTx.tx.ins[0],
        ...sellerSignedPsbt.data.inputs[0],
      });
      // Add payer output
      psbt.addOutput({
        ...sellerSignedPsbt.data.globalMap.unsignedTx.tx.outs[0],
      });
      // console.log('market_fee')

      //  console.log(paymentUtxos);
      // Add payment utxo inputs
      for (const utxo of paymentUtxos) {
        const tx = bitcoin.Transaction.fromHex(await getTxHexById(utxo.txId));
        for (const output in tx.outs) {
          try {
            tx.setWitness(parseInt(output), []);
          } catch {}
        }

        psbt.addInput({
          hash: utxo.txId,
          index: utxo.outputIndex,
          nonWitnessUtxo: tx.toBuffer(),
          // witnessUtxo: tx.outs[utxo.vout],
        });

        totalValue += utxo.satoshis;
        totalPaymentValue += utxo.satoshis;
      }
      // Service fee
      var market_fee = 0;
      if (feeAddress != undefined && service_fee_rate != undefined) {
        market_fee = price * service_fee_rate;

        if (market_fee > 0) {
          psbt.addOutput({
            address: feeAddress,
            value: market_fee,
          });
        }
      }
      // console.log(market_fee)

      // Create two new dummy utxos outputs for the next purchase
      psbt.addOutput({
        address: payerAddress,
        value: dummyUtxoValue,
      });

      psbt.addOutput({
        address: payerAddress,
        value: dummyUtxoValue,
      });

      const fee = calculateFee(psbt.txInputs.length, psbt.txOutputs.length, 1);

      const changeValue =
        totalValue - dummyUtxoValue * 2 - price - market_fee - fee - 10000;
      // console.log(changeValue)

      if (changeValue < 0) {
        toast.error(`Your wallet address doesn't have enough funds to buy this inscription.
              Price:          ${satoshisToBTC(price)}
              Fees:       ${satoshisToBTC(
                fee + market_fee + dummyUtxoValue * 2
              )}
              You have:   ${satoshisToBTC(totalPaymentValue)}
              Required:   ${satoshisToBTC(totalValue - changeValue)}
              Missing:     ${satoshisToBTC(-changeValue)}`);
      }

      // Change utxo
      psbt.addOutput({
        address: payerAddress,
        value: changeValue,
      });

      const singedPSBT = await wallet.signPsbt(psbt, {});
      // console.log(singedPSBT)

      const psbtHEX = singedPSBT.toHex();

      // console.log(psbtHEX)

      const decodedPsbt = await wallet.decodePsbt(psbtHEX);
      // console.log(decodedPsbt)

      if (decodedPsbt.warning) {
        toast.error("RawTx decoding is failed");
        return;
      }
      // console.log(decodedPsbt)

      const newPSBT = Psbt.fromHex(psbtHEX);
      const rawtx = newPSBT.extractTransaction().toHex();

      // console.log(rawtx)
      if (rawtx) {
        const txId = await wallet.pushTx(rawtx);
        if (txId.indexOf("Broadcast") >= 0) {
          toast.error(`Broadcast failed: ${txId}`);
          setPendingTx(false);
          return;
        }

        setPendingTx(false);
        refreshUTXOs(payerAddress);
        if (txId) {
          setSucceed(true);
          toast.success(
            "You have bought successfully. The inscription will be delivered in a short time."
          );
          setBuyTx(txId);

          const dbQuery = query(
            ref(db, `market/${tag}`),
            orderByChild("data/inscriptionId"),
            equalTo(list?.data?.inscriptionId)
          );

          const inscriptionSnapshot = await get(dbQuery);
          const existedInscription = inscriptionSnapshot.val();

          if (existedInscription) {
            const key = Object.keys(existedInscription)[0];
            const dbRefForUpdate = ref(db, `/market/${tag}/${key}`);

            await update(dbRefForUpdate, {
              ...list,
              date: Date.now(),
              payer: payerAddress,
              txId: txId,
              paid: true,
            });

            await addActiviyForBuy(
              tag,
              list?.data?.inscriptionId,
              list?.content,
              list?.price,
              txId
            );

            await updateListForSold(
              tag,
              list?.data?.inscriptionId,
              list?.content,
              list?.price,
              list?.seller,
              txId
            );
          }
        }
      }
    } catch (error) {
      toast.error(`${error}`);
      setPendingTx(false);
      //  console.log(error);
    }
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      className="cs-modal relative"
    >
      <div className="text-center text-2xl font-semibold">Buy Listing</div>

      <div
        className="mx-auto w-40 h-32  rounded-md bg-primary-contentDark text-xl flex justify-center items-center my-3 relative px-2"
        style={{ overflowWrap: "anywhere" }}
      >
        {list?.data?.contentType.indexOf("image") > -1 && (
          <>
            <img
              src={`https://ordinalslite.com/content/${list?.data?.inscriptionId}`}
              className="w-full h-full object-contain mx-auto max-w-[300px]"
              alt=""
            />
          </>
        )}

        {list?.data?.contentType.indexOf("text") > -1 && (
          <>
            {" "}
            {list?.content.indexOf("tick") > -1 ? (
              <div className="text-sm font-bold px-3">
                {JSON.parse(list?.content).tick}
              </div>
            ) : (
              <div className="text-sm font-bold px-3">{list?.content}</div>
            )}
          </>
        )}

        <div className="in-transfer">#{list?.data?.inscriptionNumber}</div>
      </div>

      <BuyBills listingPrice={list?.price} />

      {dummyUTXOs.length < 2 && (
        <button
          className="w-full mt-2 bg-primary-contentDark"
          onClick={generatePSBTGeneratingDummyUtxos}
        >
          Click Here to Generate Dummy UTXOs
        </button>
      )}

      {dummyTx && (
        <a
          href={"https://litecoinspace.org/tx/" + dummyTx}
          target="_blank"
          className="underline mx-auto flex justify-center"
        >
          {" "}
          {addressFormat(dummyTx, 8)}
        </a>
      )}

      <div className="flex gap-2">
        <button
          className="main_btn w-full py-2 px-3 rounded-md mt-3"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
        <button
          disabled={!address}
          className="main_btn w-full py-2 px-3 rounded-md mt-3 bg-sky-600"
          onClick={generatePSBTBuyingInscription}
        >
          Buy Listing
        </button>
      </div>

      {pendingTx && (
        <div className="absolute top-0 left-0 w-full h-full bg-primary-dark/60 flex justify-center items-center">
          <AiOutlineLoading className="text-3xl font-semibold animate-spin" />
        </div>
      )}

      {succeed && (
        <>
          <div className="absolute top-0 left-0 w-full h-full bg-primary-dark  flex justify-center items-center">
            <div>
              <AiFillCheckCircle className="text-6xl font-semibold mx-auto text-green-600" />
              <a
                href={"https://litecoinspace.org/tx/" + buyTx}
                className="underline"
                target="_blank"
              >
                View Transaction
              </a>
            </div>
          </div>
          <MdOutlineCancel
            className="absolute top-2 right-2 text-3xl cursor-pointer"
            onClick={closeModal}
          />
        </>
      )}
    </Modal>
  );
}
