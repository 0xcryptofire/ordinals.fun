import React from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowRight, FaCopy } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import { WalletContext } from "../../context/wallet";
import { useSelector } from "react-redux";
import { copyToClipboard } from "@/utils";
import { toast } from "react-hot-toast";
import { Fragment, useContext, useState } from "react";
import { addressFormat } from "@/utils";
import Image from "next/image";
import { useEffect } from "react";
import Link from "next/link";
import { LuAlertOctagon } from "react-icons/lu";
import Modal from "react-modal";

export default function WalletMain({ setContentType }) {
  const account = useSelector(
    (state) => state?.persistedReducer?.walletReducer?.value
  );
  const wallet = useContext(WalletContext);
  const [listType, setListType] = useState(true);
  const [pending, setPending] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const copied = () => {
    toast.success("copied!");
  };

  const confirm = () => {
    wallet.removeWallet();
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const fetchData = () => {
    setPending(true);
    wallet.fetchbalance();
    setTimeout(() => {
      setPending(false);
    }, [500]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="p-4 rounded-lg bg-[#031a2b]">
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer rounded-lg"
            onClick={() => {
              copyToClipboard(account?.account?.accounts[0]?.address);
              copied();
            }}
          >
            {account?.account?.accounts &&
              addressFormat(account?.account?.accounts[0]?.address, 5)}
            <FaCopy />
          </div>
          <div className="flex gap-3">
            {!pending ? (
              <FaArrowsRotate
                className="text-3xl cursor-pointer p-1.5"
                onClick={() => fetchData()}
              />
            ) : (
              <AiOutlineLoading3Quarters className="text-3xl cursor-pointer p-1.5 animate-spin" />
            )}

            <Menu as="div" className="relative inline-block text-left">
              <div className="flex justify-center items-center">
                <Menu.Button className="text-lg  my-auto cursor-pointer focus:outline-none hover:text-white/90 hover:bg-primary-dark/50 rounded-lg p-1 transition ease-in-out">
                  <BsThreeDotsVertical className="text-xl cursor-pointer" />
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
                <Menu.Items className="absolute right-0 z-20 mt-2 w-[200px!important] p-3 bg-[#102c43]  shadow shadow-black  origin-top-right rounded-md focus:outline-none">
                  <button
                    onClick={() => wallet.unlockWallet()}
                    className="hover:bg-primary-dark/30 transition ease-in-out rounded-md focus:outline-none text-left w-full p-1"
                  >
                    Unlock wallet
                  </button>
                  <button
                    onClick={() => setContentType("send")}
                    className="hover:bg-primary-dark/30 transition ease-in-out rounded-md focus:outline-none text-left w-full p-1"
                  >
                    Send LTC
                  </button>
                  <button
                    onClick={() => setContentType("secrets")}
                    className="hover:bg-primary-dark/30 transition ease-in-out rounded-md focus:outline-none text-left w-full p-1"
                  >
                    Show secrets
                  </button>
                  <button
                    onClick={() => setModalIsOpen(true)}
                    className="hover:bg-primary-dark/30 transition ease-in-out rounded-md focus:outline-none text-left w-full text-red-600 p-1"
                  >
                    Delete Wallet
                  </button>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className="mt-3">
          {Number(account?.balance?.amount).toFixed(5)} ( $
          {(account?.balance?.amount * account.price).toFixed(2)} )
        </div>

        <div className="flex gap-3 mt-3">
          <button
            className="py-1 rounded-lg cursoer-pointer focus:outline-none"
            onClick={() => setListType(false)}
          >
            Assets
          </button>
          <button
            className="py-1 rounded-lg cursoer-pointer focus:outline-none"
            onClick={() => setListType(true)}
          >
            Lists
          </button>
        </div>
        {listType ? (
          <>
            {account?.inscriptions?.total > 0 ? (
              <Link href={"/wallet"} className="hover:text-white">
                <div className="mt-3">LiteMaps</div>
                <div className="rounded-lg bg-primary-dark/20  py-2 px-3 flex justify-between items-center hover:bg-primary-dark/30  transition ease-in-out cursor-pointer mt-2 mb-3">
                  <div className="flex gap-2 items-center">
                    <Image
                      src="/logo.png"
                      width={40}
                      height={40}
                      className="rounded-md"
                      alt=""
                    />
                    <p>All inscriptions</p>
                  </div>
                  <div className="flex gap-3">
                    <p>{account?.inscriptions?.total}</p>
                    <FaArrowRight className="text-xl" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="py-8 w-full flex justify-center">
                No inscription.
              </div>
            )}
          </>
        ) : (
          <>
            {account?.balance?.confirm_inscription_amount > 0 ? (
              <div className="rounded-lg bg-primary-dark/20  py-2 px-3 flex justify-between items-center hover:bg-primary-dark/30  transition ease-in-out cursor-pointer mt-2 mb-3">
                <div className="flex gap-2 items-center">
                  <Image
                    src="/loading.png"
                    width={40}
                    height={60}
                    className="rounded-md"
                    alt=""
                  />
                  <p>LiteMaps</p>
                </div>
                <div className="flex gap-3">
                  <p>2</p>
                  <FaArrowRight className="text-xl" />
                </div>
              </div>
            ) : (
              <div className="py-8 w-full flex justify-center">No Lists.</div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="cs-modal relative"
      >
        <div className="text-center text-2xl font-semibold">
          Are you sure to delete this wallet?
        </div>

        <div className="flex justify-center items-center p-3 my-8">
          <LuAlertOctagon className="text-9xl text-yellow-500" />
        </div>

        <div className="flex gap-2">
          <button
            className="main_btn h-8 w-full bg-red-500"
            onClick={closeModal}
          >
            No
          </button>
          <button className="main_btn h-8 w-full " onClick={confirm}>
            Yes
          </button>
        </div>
      </Modal>
    </>
  );
}
