import React, { useContext, useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { WalletContext } from "../../context/wallet";
import {
  booted,
  isUnlocked,
  vault,
  preVault,
} from "./../../store/slices/wallet";

export default function WalletCreate({ setType, isImport }) {
  const dispatch = useDispatch();
  const walletContext = useContext(WalletContext);

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [wanning, setWanning] = useState("");
  const [created, setCreated] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState("");
  const confirmRef = useRef(null);

  const [contextData, setConntextData] = useState({
    mnemonics: "",
    entropy: 128,
    hdPath: "",
    passphrase: "",
    addressType: 1,
    step1Completed: true,
    tabType: "STEP1",
    restoreWalletType: 0,
    isRestore: false,
    isCustom: false,
    customHdPath: "",
    addressTypeIndex: 0,
    wordsType: 0,
    hdPath: "m/84'/2'/0'/0",
  });

  //  console.log(isImport, '----------isIMport--')

  const importWallet = async () => {
    try {
      const encryptBooted = await walletContext.Boot(password);
      const mnemonic = seedPhrase;
      const preMnemonics = await walletContext.encrypt(password, mnemonic);

      walletContext.importWallet(
        mnemonic,
        contextData.hdPath,
        contextData.passphrase,
        contextData.addressType,
        1
      );
      dispatch(vault(mnemonic));
      dispatch(booted(encryptBooted));
      dispatch(isUnlocked(true));
      dispatch(preVault(preMnemonics));
    } catch (error) {
      //  console.log(error);
    }
  };

  const btnClick = async () => {
    try {
      if (isImport) {
        setCreated(true);
      } else {
        const encryptBooted = await walletContext.Boot(password);
        const mnemonic = await walletContext.generateMnemonic(
          contextData.entropy
        );
        const preMnemonics = await walletContext.encrypt(password, mnemonic);
        setConntextData((data) => ({ ...data, mnemonics: mnemonic }));
        walletContext.createAccount(
          mnemonic,
          contextData.hdPath,
          contextData.passphrase,
          contextData.addressType,
          1
        );
        dispatch(vault(mnemonic));
        dispatch(booted(encryptBooted));
        dispatch(isUnlocked(true));
        dispatch(preVault(preMnemonics));
      }
    } catch (error) {
      //  console.log("create wallet:", error);
    }
  };

  const verify = (pwd2) => {
    if (pwd2 && pwd2 !== password) {
      setWanning("Entered passwords differ");
    } else {
      setWanning("");
    }
  };

  useEffect(() => {
    setDisabled(true);

    if (password) {
      if (password.length < 5) {
        setWanning("Password must contain at least 5 characters");
        return;
      }

      if (password2) {
        if (password === password2) {
          setDisabled(false);
          return;
        }
      }

      setWanning("");
    }
  }, [password, password2]);

  const handleOnKeyUp = (e) => {
    if (!disabled && "Enter" == e.key) {
      btnClick();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent default behavior of losing focus
      // Move focus to the next input or element
      // You can use the `ref` attribute to reference the next input element
      // and call its `focus` method to move the focus
      confirmRef.current.focus();
    }
  };

  if (isImport) {
    return (
      <>
        {created ? (
          <div className="p-4 rounded-lg bg-[white]  backdrop-blur-xl">
            <p className="my-8 font-semibold text-center text-2xl">
              Secret Recovery Phrase
            </p>
            <p className="text-sm text-gray-400 text-center mb-2">
              Import an existing wallet with your secret recovery phrase.
            </p>
            <textarea
              rows="3"
              className="p-3 rounded-md bg-primary-dark/20  w-full mt-2"
              onChange={(e) => setSeedPhrase(e.target.value)}
            ></textarea>

            <div className="flex justify-between gap-3 mt-6">
              <button
                className="py-2.5 px-4 rounded-lg main_btn mx-auto w-full mt-6"
                onClick={() => importWallet()}
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg  bg-[#031a2b]">
            <p className="my-8 font-semibold text-center text-2xl">
              Set Your wallet password
            </p>
            <input
              type="password"
              placeholder="Enter password."
              className="mt-3 bg-transparent border border-white/20 rounded-lg w-full py-2 px-3"
              onBlur={(e) => {
                setPassword(e.target.value);
              }}
              autoFocus={true}
              onKeyDown={handleKeyDown}
            />
            <input
              type="password2"
              placeholder="Confirm password."
              className="mt-3 bg-transparent border border-white/20 rounded-lg w-full py-2 px-3"
              onChange={(e) => {
                setPassword2(e.target.value);
              }}
              onBlur={(e) => {
                verify(e.target.value);
              }}
              onKeyUp={(e) => handleOnKeyUp(e)}
              onKeyDown={handleKeyDown}
              ref={confirmRef}
            />

            {wanning && <p className="text-red-500 mt-2 text-sm">{wanning}</p>}

            <div className="flex justify-between gap-3 mt-6">
              <button
                className="py-2.5 px-4 rounded-lg main_btn mx-auto w-full mt-6"
                onClick={() => setType(0)}
              >
                Go Back
              </button>
              <button
                disabled={disabled}
                className="py-2.5 px-4 rounded-lg main_btn mx-auto w-full mt-6"
                onClick={btnClick}
              >
                Set password
              </button>
            </div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <div className="p-4 rounded-lg  bg-[#031a2b]">
        <p className="my-8 font-semibold text-center text-2xl">
          Set Your wallet password
        </p>
        <input
          type="password"
          placeholder="Enter password."
          className="mt-3 bg-transparent border border-white/20 rounded-lg w-full py-2 px-3"
          onBlur={(e) => {
            setPassword(e.target.value);
          }}
          autoFocus={true}
          onKeyDown={handleKeyDown}
        />
        <input
          type="password2"
          placeholder="Confirm password."
          className="mt-3 bg-transparent border border-white/20 rounded-lg w-full py-2 px-3"
          onChange={(e) => {
            setPassword2(e.target.value);
          }}
          onBlur={(e) => {
            verify(e.target.value);
          }}
          onKeyUp={(e) => handleOnKeyUp(e)}
          onKeyDown={handleKeyDown}
          ref={confirmRef}
        />

        {wanning && <p className="text-red-500 mt-2 text-sm">{wanning}</p>}

        <div className="flex justify-between gap-3 mt-6">
          <button
            className="py-2.5 px-4 rounded-lg main_btn mx-auto w-full mt-6"
            onClick={() => setType(0)}
          >
            Go Back
          </button>
          <button
            disabled={disabled}
            className="py-2.5 px-4 rounded-lg main_btn mx-auto w-full mt-6"
            onClick={btnClick}
          >
            Set password
          </button>
        </div>
      </div>
    );
  }
}
