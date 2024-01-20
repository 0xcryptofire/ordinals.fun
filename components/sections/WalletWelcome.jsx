import React from "react";

export default function WalletWelcome({ setType }) {
  return (
    <div className="p-4 rounded-lg  bg-[#031a2b]">
      <p className="my-8 font-semibold text-center text-2xl">LiteMap Wallet</p>

      <p className="text-center">
        LiteMarket comes with built-in wallet, there is no need to download any
        browser extension. Your private keys are stored in the browser and are
        never sent to the server
      </p>

      <button
        className="py-2.5 px-4 rounded-lg main_btn mx-auto w-full mt-6"
        onClick={() => setType(1)}
      >
        Create new wallet
      </button>
      <button
        className="py-2.5 px-4 rounded-lg main_btn mx-auto w-full mt-3"
        onClick={() => setType(5)}
      >
        Import wallet
      </button>
    </div>
  );
}
