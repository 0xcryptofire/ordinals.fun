/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectedBlock, cancelBlock } from "@/store/slices/inscribe";
import { useBlocks } from "../../store/hooks";

export default function Block(props) {
  const dispatch = useDispatch();
  const inscribe = useSelector(
    (state) => state?.persistedReducer?.inscribeReducer?.value
  );
  const [isSelected, setIsSelected] = useState(false);
  const { mintedBlocks } = useBlocks();
  const [minted, setMinted] = useState(false);

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

  const handleClick = () => {
    if (!isSelected) {
      const newBlock = {
        blockNumber: props.blockNumber,
        id: "",
        date: Date.now(),
        orderCreated: false,
        paid: false,
        orderId: "",
        owner: "",
      };
      setIsSelected(true);
      dispatch(selectedBlock(newBlock));
    } else {
      setIsSelected(false);
      dispatch(cancelBlock(props.blockNumber));
    }
  };

  const checkIsSelected = () => {
    const data = inscribe.selectedBlock.filter(
      (item) => item.blockNumber == props.blockNumber
    );

    if (data.length > 0) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  };

  useEffect(() => {
    if (inscribe?.selectedBlock.length > 0) {
      checkIsSelected();
    } else {
      setIsSelected(false);
    }
  }, [inscribe, props]);

  useEffect(() => {
    if (props.blockNumber) {
      const minted = binarySearch(props.blockNumber);
      setMinted(!minted);
    }
  }, [props.blockNumber, mintedBlocks]);

  if (minted) {
    return (
      <div className="bg-[#00bbff0f]  border  w-[93%] h-[30px]  drop-shadow-lg border-[#58829e2d!important] w-100 my-auto shadow-black rounded text-sm flex justify-center items-center font-extralight hover:drop-shadow-2xl transition-all ease-out">
        {props.blockNumber}
      </div>
    );
  } else {
    return (
      <div
        onClick={(e) => handleClick(props.blockNumber)}
        className={` shadow-black rounded text-[12px] flex justify-center items-center font-extralight  cursor-pointer hover:drop-shadow-2xl hover:bg-[#00c7ffcf]  duration-200 mx-auto my-auto ${
          isSelected
            ? "bg-[#00c7ffcf] drop-shadow-2xl border border-[#5ab1ccb0!important] w-[93%] h-[30px]"
            : "bg-[#19659fd1]  drop-shadow-lg w-100 h-[35px]"
        }`}
      >
        {props.blockNumber}
      </div>
    );
  }
}
