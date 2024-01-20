import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AiFillCheckCircle, AiOutlineLoading } from "react-icons/ai";
import Modal from "react-modal";
import { WalletContext } from "../../context/wallet";
import FeeRecommend from "../UI/FeeRecommend";
import SendAddress from "../UI/SendAddress";
import OutPutValue from "./OutPutValue";
import { sleep } from "@/utils";
import { toast } from "react-hot-toast";
import { FaScissors } from "react-icons/fa6";

export default function TransferModal({
  modalIsOpen,
  setIsOpen,
  content,
  id,
  inscription,
  isNeedToSplit,
  isMultiStuck,
  setIsOpenSplit,
  checking,
}) {
  const wallet = useContext(WalletContext);
  const defaultOutputValue = 10000;
  const [feeRate, setFeeRate] = useState("economy");
  const [outputValue, setOutputValue] = useState(defaultOutputValue);
  const [toInfo, setToInfo] = useState();
  const [rawTxInfo, setRawTxInfo] = useState();
  const [creatingTx, setCreatingTx] = useState(false);
  const [pending, setPendingTx] = useState(false);
  const [succeed, setSucceed] = useState(false);
  const [tx, setTx] = useState("");

  const handleSignAndPay = async () => {
    setPendingTx(true);
    if (!rawTxInfo) {
      return;
    }

    try {
      const txid = await wallet.pushTx(rawTxInfo);
      await sleep(1); // Wait for transaction synchronization

      if (txid) {
        setSucceed(true);
        setTx(txid);
        toast.success("Your transaction has been sent successfully.");
      }
      setPendingTx(false);
    } catch (e) {
      setPendingTx(false);
      setSucceed(false);
      //  console.log(e);
    }
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    setTx("");
    setSucceed(false);
  }

  useEffect(() => {
    if (toInfo && feeRate && outputValue && id) {
      setCreatingTx(true);
      try {
        wallet
          .createOrdinalsTx(toInfo, id, feeRate, outputValue)
          .then((data) => {
            setRawTxInfo(data);
            setCreatingTx(false);
          });
      } catch (error) {
        //  console.log(error);
        setCreatingTx(false);
      }
    }
  }, [toInfo, feeRate, outputValue, id]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      className="cs-modal relative"
    >
      <div className="text-center text-2xl font-semibold">Send Litemap</div>

      {isNeedToSplit && isMultiStuck && (
        <p className="my-2 text-center text-red-500">
          Multiple inscriptions are mixed mixed together. Please split them
          first.
        </p>
      )}

      {isNeedToSplit && !isMultiStuck && (
        <p className="my-2 text-center text-red-500">
          This inscription carries a high balance {`>`} 10000 sats
        </p>
      )}

      <div
        className="mx-auto w-full h-32 rounded-md bg-primary-contentDark text-xl flex justify-center items-center my-3 p-2"
        style={{ overflowWrap: "anywhere" }}
      >
        {inscription?.contentType.indexOf("image") > -1 && (
          <>
            <img
              src={`https://ordinalslite.com/content/${inscription?.inscriptionId}`}
              className="w-full h-full object-contain mx-auto max-w-[300px]"
              alt=""
            />
          </>
        )}

        {inscription?.contentType.indexOf("text") > -1 && (
          <>
            {content.indexOf("tick") > -1 ? (
              <div className="text-3xl font-bold px-3">
                {JSON.parse(content).tick}
              </div>
            ) : (
              <div className="text-3xl font-bold px-3">{content}</div>
            )}
          </>
        )}
      </div>

      <SendAddress
        onChange={(val) => {
          setToInfo(val);
        }}
      />

      <OutPutValue
        defaultValue={defaultOutputValue}
        onChange={(val) => {
          setOutputValue(val);
        }}
      />

      <FeeRecommend feeOption={feeRate} setFeeOption={setFeeRate} />
      <div className="flex gap-2">
        <button
          className="main_btn w-full py-2 px-3 rounded-md mt-3"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
        {checking ? (
          <button className="main_btn w-full py-2 px-3 rounded-md mt-3 bg-sky-600">
            <AiOutlineLoading className="text-lg font-semibold animate-spin mx-auto" />
          </button>
        ) : (
          <>
            {isNeedToSplit || isMultiStuck ? (
              <button
                className="main_btn w-full py-2 px-3 rounded-md mt-3 bg-sky-600 flex justify-center gap-2 items-center"
                onClick={() => {
                  closeModal();
                  setIsOpenSplit(true);
                }}
              >
                <FaScissors className="text-lg" /> Split
              </button>
            ) : (
              <button
                disabled={!rawTxInfo}
                className="main_btn w-full py-2 px-3 rounded-md mt-3 bg-sky-600"
                onClick={handleSignAndPay}
              >
                {creatingTx ? (
                  <>
                    <AiOutlineLoading className="text-lg font-semibold animate-spin mx-auto" />
                  </>
                ) : (
                  "Sign & Pay"
                )}
              </button>
            )}
          </>
        )}
      </div>

      {pending && (
        <div className="absolute top-0 left-0 w-full h-full bg-primary-dark/60 flex justify-center items-center">
          <AiOutlineLoading className="text-3xl font-semibold animate-spin" />
        </div>
      )}

      {succeed && (
        <div className="absolute top-0 left-0 w-full h-full bg-primary-dark  flex justify-center items-center">
          <div>
            <AiFillCheckCircle className="text-6xl font-semibold mx-auto text-green-600" />
            <a
              href={"https://litecoinspace.org/tx/" + tx}
              className="underline"
              target="_blank"
            >
              View Transaction
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
