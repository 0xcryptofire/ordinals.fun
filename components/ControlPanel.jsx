import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { initialize, setBulkMintBlocks } from "@/store/slices/inscribe";
import { TfiPanel } from "react-icons/tfi";
import Modal from "react-modal";
import { useBlocks } from "../store/hooks";
import LastMints from "./UI/LastMints";

export default function ControlPanel({ from, to }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { mintedBlocks } = useBlocks();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [fromNumber, setFromNumber] = useState(0);
  const [toNumber, setToNumber] = useState(0);
  const [amount, setAmount] = useState(0);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [blocks, setBlocks] = useState([]);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const goToCreatOrder = () => {
    if (blocks.length > 0) {
      router.push("/createOrder");
    } else {
      toast.error("Please select blocks to inscribe.");
    }
  };

  function binarySearch(target) {
    let left = 0;
    let right = mintedBlocks.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (mintedBlocks[mid].blockNumber === target) {
        return false; // Block number found
      }

      if (mintedBlocks[mid].blockNumber < target) {
        left = mid + 1; // Continue searching in the right half
      } else {
        right = mid - 1; // Continue searching in the left half
      }
    }

    return true; // Block number not found
  }

  function getAvailableBlocks() {
    let blocks = [];
    for (let index = from; index >= to; index--) {
      if (binarySearch(index)) {
        blocks.push({
          blockNumber: index,
          id: "",
          date: Date.now(),
          orderCreated: false,
          paid: false,
          orderId: "",
          owner: "",
        });
      }
    }
    setAvailableBlocks(blocks);
  }

  const getBlocksForAmount = (val) => {
    const sliceAmount = val ? val : amount;

    if (availableBlocks.length < 0) {
      toast.error("There are no available blocks on this page.");
      return;
    }

    const blocks = availableBlocks.slice(0, sliceAmount);
    if (blocks.length > 0) {
      dispatch(setBulkMintBlocks(blocks));
      setBlocks(blocks);
    } else {
      toast.error("There are no enough blocks on this page.");
    }
  };

  const getBlocksForRange = () => {
    if (!fromNumber) {
      toast.error('Please input block Number in "from" input.');
      return;
    }

    if (!to) {
      toast.error('Please input block Number in "to" input.');
      return;
    }

    if (Number(fromNumber) < from) {
      toast.error(`From block number should be lower than ${from}`);
      return;
    }

    if (Number(toNumber) > to) {
      toast.error(`To block number should be greater than ${to}`);
      return;
    }

    let blocks = [];

    for (
      let index = Number(fromNumber);
      index >= Number(toNumber) + 1;
      index--
    ) {
      if (binarySearch(index)) {
        blocks.push({
          blockNumber: index,
          id: "",
          date: Date.now(),
          orderCreated: false,
          paid: false,
          orderId: "",
          owner: "",
        });
      }
    }

    if (blocks.length > 0) {
      dispatch(setBulkMintBlocks([]));
      setBlocks(blocks);
    } else {
      toast.error("There are no enough blocks on this page.");
    }
  };

  const clearBlocks = () => {
    dispatch(initialize());
    setBlocks([]);
  };

  useEffect(() => {
    getAvailableBlocks();
  }, [from]);

  return (
    <>
      <div className="flex justify-between w-full gap-3">
        <LastMints />
        <div className="flex gap-2 sm:justify-end justify-center">
          <button className=" focus:outline-none" onClick={openModal}>
            <TfiPanel className="text-3xl cursor-pointer" />
          </button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="bg-primary-dark text-white border-[#dee2e654!important] rounded-lg sm:w-full sm:max-w-[500px] w-[] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-lg shadow-black drop-shadow-xl drop-sahdow-black"
      >
        <h2 className="text-2xl text-center my-6 font-semibold mx-auto">
          Select the amount of blocks to inscribe.
        </h2>

        <p className="text-sm text-center w-80 mx-auto">
          You can select from 1 block number to 300 block number on this page.
        </p>

        <div className="flex gap-2 justify-between mt-3">
          <button
            className="main_btn py-2 px-3 rounded-md w-full"
            onClick={() => getBlocksForAmount(25)}
          >
            25
          </button>
          <button
            className="main_btn py-2 px-3 rounded-md w-full"
            onClick={() => getBlocksForAmount(50)}
          >
            50
          </button>
          <button
            className="main_btn py-2 px-3 rounded-md w-full"
            onClick={() => getBlocksForAmount(100)}
          >
            100
          </button>
          <button
            className="main_btn py-2 px-3 rounded-md w-full"
            onClick={() => clearBlocks()}
          >
            clear
          </button>
        </div>

        <div className="flex gap-2 justify-between mt-3">
          <input
            type="Number"
            min={to}
            max={from}
            className="py-2 px-3 w-full bg-[#0b314f66] rounded-lg focus:outline-none focus:border-white/50 border border-white/40 duration-300"
            placeholder="Amount of blocks"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className="main_btn py-2 px-3 rounded-md"
            onClick={() => getBlocksForAmount(0)}
          >
            <FaCheck className="text-lg" />
          </button>
        </div>

        <div className="flex gap-2 justify-between mt-3">
          <input
            type="Number"
            min={to}
            max={from - 1}
            className="py-2 px-3 bg-[#0b314f66] w-full  rounded-lg focus:outline-none focus:border-white/50 border border-white/40 duration-300"
            placeholder="From (block number)"
            onChange={(e) => setFromNumber(e.target.value)}
          />
          <input
            type="Number"
            min={to + 1}
            max={from}
            className="py-2 px-3 :bg-[#0b314f66] w-full  rounded-lg focus:outline-none focus:border-white/50 border border-white/40 duration-300"
            placeholder="To (block number)"
            onChange={(e) => setToNumber(e.target.value)}
          />
          <button
            className="main_btn py-2 px-3 rounded-md"
            onClick={getBlocksForRange}
          >
            <FaCheck className="text-lg" />
          </button>
        </div>

        <div className="mt-3 :bg-[#0b314f66] rounded-lg p-3 text-sm">
          <div className="flex gap-2 justify-between w-full">
            <p> Available Blocks:</p> <p>{availableBlocks.length}</p>
          </div>
          <div className="flex gap-2 justify-between w-full">
            <p> Selected Blocks:</p> <p>{blocks.length}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="main_btn w-full py-2 px-3 rounded-md mt-3"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
          <button
            className="main_btn w-full py-2 px-3 rounded-md mt-3 bg-sky-600"
            onClick={goToCreatOrder}
          >
            Next
          </button>
        </div>
      </Modal>
    </>
  );
}
