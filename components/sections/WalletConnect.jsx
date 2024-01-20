/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useContext, useEffect, useState } from "react";
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { FaWallet } from "react-icons/fa";
import WalletWelcome from "./WalletWelcome";
import WalletCreate from "./WalletCreate";
import WalletOpend from "./WalletOpend";
import WalletUnlock from "./WalletUnlock";
import WalletImport from "./WalletImport";
import { useDispatch, useSelector } from "react-redux";
import { isUnlocked } from "@/store/slices/wallet";
import { addressFormat } from "@/utils";

const walletStats = {
  wellcome: 0,
  createPasword: 1,
  importWallet: 2,
  unlockWallet: 3,
  opendWallet: 4,
};

export default function WalletConnect() {
  const account = useSelector(
    (state) => state?.persistedReducer?.walletReducer?.value
  );
  const [type, setType] = useState(0);
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();

  function walletState(type) {
    if (type === 0) {
      return <WalletWelcome setType={setType} />;
    }

    if (type === 1) {
      return <WalletCreate setType={setType} />;
    }

    if (type === 2) {
      return <WalletImport setType={setType} />;
    }

    if (type === 3) {
      return <WalletUnlock setType={setType} />;
    }

    if (type === 4) {
      return <WalletOpend setType={setType} />;
    }

    if (type === 5) {
      return <WalletCreate setType={setType} isImport={true} />;
    }
  }

  useEffect(() => {
    function init() {
      if (
        account.booted == {} ||
        account.booted == undefined ||
        !account.booted
      ) {
        setType(walletStats.wellcome);
        return;
      }

      if (!account.isUnlocked) {
        setType(walletStats.unlockWallet);
        return;
      }

      if (!account.vault || account.vault == undefined) {
        setType(walletStats.wellcome);
        return;
      }

      if (account.isUnlocked) {
        setType(walletStats.opendWallet);
        return;
      }
    }
    init();
  }, [account]);

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex justify-center items-center">
          <Menu.Button className="px-3 py-1  border text-lg border-[#ffffff!important] rounded-lg my-3 flex items-center gap-3">
            <FaWallet
              className="-mr-1 h-5 w-5 text-white"
              aria-hidden="true"
            />
            {account?.isUnlocked && account?.account?.addressType === 1
              ? addressFormat(account?.account?.accounts[0]?.address, 6)
              : " Connect Wallet"}
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-20 mt-2 sm:w-[400px] w-[335px]  origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {walletState(type)}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
