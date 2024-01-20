import React from "react";

export default function WalletImport({ setType }) {
  return (
    <div className="p-4 rounded-lg  bg-[#031a2b]">
      <p className="my-8 font-semibold text-center text-2xl">Import wallet</p>

      <textarea
        className="p-3 rounded-md w-full border border-white/20"
        placeholder="Enter your secret phrase here (mnomonic or private key)"
        id=""
        cols="30"
        rows="10"
      ></textarea>

      <div className="flex justify-between gap-3 mt-6">
        <button
          className="py-2.5 px-4 rounded-lg main_btn mx-auto w-full mt-6"
          onClick={() => setType(0)}
        >
          Go Back
        </button>
        <button
          className="py-2.5 px-4 rounded-lg main_btn mx-auto w-full mt-6"
          onClick={() => setType(4)}
        >
          Import wallet
        </button>
      </div>
    </div>
  );
}
