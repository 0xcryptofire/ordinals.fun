import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { FaCopy } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { copyToClipboard } from "@/utils";
import { useState } from "react";
import { ImCheckmark } from "react-icons/im";
import WalletUnlockSecret from "./WalletUnlockSecret";

export default function WalletSecret({ setContentType }) {
  const accountInfo = useSelector(
    (state) => state?.persistedReducer?.walletReducer?.value
  );
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const copiedf = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="p-4 rounded-lg  bg-[#031a2b]">
        <button
          className=" focus:outline-none"
          onClick={() => setContentType("main")}
        >
          <BsArrowLeft className="text-xl" />
        </button>
        <label htmlFor="" className="w-full mt-2">
          Your mnemonic phrase:
        </label>
        <div
          className="p-3 rounded-lg bg-primary-dark/20  mt-1 relative cursor-pointer hover:bg-primary-dark/30  duration-300"
          onClick={() => {
            copyToClipboard(accountInfo?.keyrings?.mnemonic);
            copiedf();
          }}
        >
          <p>{accountInfo?.keyrings?.mnemonic} </p>
          {copied ? (
            <ImCheckmark className=" text-green-400 absolute bottom-3 right-3 cursor-pointer" />
          ) : (
            <FaCopy className="absolute bottom-3 right-3" />
          )}
        </div>
        <div className="p-2 rounded-lg bg-red-500/20 mt-3">
          Anyone who knows these words can access your funds. Before importing
          to other wallet make sure it supports doginals protocol
        </div>
        <button
          className="main_btn rounded-lg py-2.5 w-full mt-3"
          onClick={() => setContentType("main")}
        >
          Go back
        </button>
      </div>
    );
  } else {
    return <WalletUnlockSecret isSuccess={setIsSuccess} />;
  }
}
