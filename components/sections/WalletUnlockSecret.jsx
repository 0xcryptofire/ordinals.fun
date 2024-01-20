import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import keyring from "@/services/keyring";
import { toast } from "react-hot-toast";

export default function WalletUnlockSecret({ isSuccess }) {
  const account = useSelector(
    (state) => state?.persistedReducer?.walletReducer?.value
  );
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);

  const btnClick = async () => {
    try {
      await keyring.submitPassword(password, account.booted, account.preVault);
      if (account.vault) {
        isSuccess(true);
        return;
      } else {
        isSuccess(false);
        return;
      }
    } catch (e) {
      isSuccess(false);
      toast.error("Incorrect password");
    }
  };

  const handleOnKeyUp = (e) => {
    if (!disabled && "Enter" == e.key) {
      btnClick();
    }
  };

  useEffect(() => {
    if (password) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [password]);

  return (
    <div className="p-4 rounded-lg  bg-[#031a2b]">
      <p className="my-8 font-semibold text-center text-2xl">
        Enter your wallet password
      </p>
      <input
        type="password"
        placeholder="Enter password."
        className="mt-3 bg-transparent border border-white/20 rounded-lg w-full py-2 px-3"
        onChange={(e) => setPassword(e.target.value)}
        onKeyUp={(e) => handleOnKeyUp(e)}
        autoFocus={true}
      />

      <div className="flex justify-between gap-3 mt-6">
        <button
          className="py-2.5 px-4 rounded-lg main_btn mx-auto w-full mt-6"
          onClick={() => btnClick()}
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
