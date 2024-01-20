import React, { useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { WalletContext } from "../../context/wallet";
import { useState } from "react";
import { amountToSatoshis } from "@/utils";
import BillsOnPayment from "./BillsOnPayment";
import { sleep } from "@/utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { feeAddress } from "../../configs/constants";
import { onValue, ref, query, push } from "firebase/database";
import { db } from "@/services/firebase";
import { updateConfirmed1 } from "@/store/slices/inscribe";
import { useInscribe } from "../../store/hooks";

export default function PaymentData({ data }) {
  const dispatch = useDispatch();
  const account = useSelector(
    (state) => state?.persistedReducer?.walletReducer?.value
  );
  const { selectedBlock, confirmed1 } = useInscribe();
  const wallet = useContext(WalletContext);
  const [fee, setFee] = useState();
  const [rawTx1, setRawTxInfo1] = useState("");
  const [pendingTx, setPendingTx] = useState(false);
  const [creatingTx, setCreatingTx] = useState(true);

  const toSatoshis1 = useMemo(() => {
    if (!data) return 0;
    return amountToSatoshis(data.ltcAmount);
  }, [data]);

  const toSatoshis2 = useMemo(() => {
    const padding = 0.0002;
    if (!data) return 0;
    const d = fee - Number(data.ltcAmount) - padding;
    const satoshis = amountToSatoshis(d);
    return Number(satoshis.toFixed(0));
  }, [data, fee]);


  const splite = (feeAddress, toSatoshis2) => {
    wallet
      .createBitcoinTx(
        {
          address: feeAddress,
          domain: feeAddress,
        },
        toSatoshis2,
        4,
        false
      )
      .then((data) => {
        wallet.pushTx(data);
      })
      .catch((e) => {
        splite(feeAddress, toSatoshis2);
      //  console.log(e);
      });
  };

  const handlePayWithLTC = async () => {
    if (!account?.account?.accounts) {
      toast.error("Please create an account");
      return;
    }

    if (!account?.isUnlocked) {
      toast.error("Please connect Wallet");
      return;
    }

    setPendingTx(true);

    if (!rawTx1) {
      return;
    }

    try {
      await wallet.pushTx(rawTx1);

      const dbRef = ref(db, "/mintedBlocks");
      selectedBlock.map((block) => {
        push(dbRef, block);
      });

      await sleep(3);

      dispatch(updateConfirmed1(true));

      // Wait for transaction synchronization
      toast.success("Your transaction has been sent successfully.");
      setPendingTx(false);
    } catch (e) {
      setPendingTx(false);
    //  console.log(e);
    }
  };

  useEffect(() => {
    if (
      data &&
      toSatoshis1 !== 0 &&
      toSatoshis2 !== 0 &&
      feeAddress &&
      !confirmed1
    ) {
      setCreatingTx(true);
      dispatch(updateConfirmed1(false));
      wallet
        .createMultiBitcoinTx(
          [
            {
              address: data?.newAddress,
              amount: toSatoshis1,
            },
            {
              address: feeAddress,
              amount: toSatoshis2,
            },
          ],
          toSatoshis1 + toSatoshis2,
          4,
          false
        )
        .then((data) => {
          setCreatingTx(false);
          setRawTxInfo1(data);
        })
        .catch((e) => {
        //  console.log(e);
        });
    }
  }, [toSatoshis2,  toSatoshis1, data, feeAddress, confirmed1]);


  return (
    <>
      <div className="w-full  bg-[#0a243933] rounded-lg p-3">
        <div className="flex flex-col items-center justify-center">
          {data && (
            <BillsOnPayment
              length={data?.files?.length ? data?.files?.length : 0}
              setFee={setFee}
            />
          )}

          <p className="text-center text-gray-300  text-sm mt-4">
            After payment is made, you will receive the inscription within at
            least 20 minutes.
          </p>

          <a
            href="https://bitpay.com/buy-litecoin/"
            target="_blank"
            className="underline hover:text-sky-400 transition ease-linear"
          >
            Need LTC? Click here to buy some LTC!
          </a>
        </div>
      </div>

      <button
        className="w-full rounded-md py-2 px-3 main_btn my-3 flex items-center justify-center h-[41px]"
        disabled={!rawTx1 || confirmed1}
        onClick={handlePayWithLTC}
      >
        {confirmed1 ? (
          <>Paid</>
        ) : (
          <>
            {" "}
            {pendingTx ? (
              <AiOutlineLoading3Quarters className="text-xl animate-spin text-center" />
            ) : (
              <>{creatingTx ? "Creating Transaction..." : "Sign & Pay"}</>
            )}
          </>
        )}
      </button>
    </>
  );
}
