import React from "react";
import { FaTimes } from "react-icons/fa";
import { cancelBlock } from "@/store/slices/inscribe";
import { useDispatch, useSelector } from "react-redux";

const InscriptionList = () => {
  const dispatch = useDispatch();
  const inscribe = useSelector(
    (state) => state?.persistedReducer?.inscribeReducer?.value
  );
  const removeBlock = (val) => {
    dispatch(cancelBlock(val));
  };

  return (
    <>
      <p className="text-sm text-center">
        Please double check your block numbers below before continuing:
      </p>
      <p className="text-[11px] text-gray-300  text-center">
        You are about to inscribe
        <span className="text-white font-semibol"> {inscribe?.selectedBlock?.length} </span>
        litemap(s)
      </p>
      <div className="flex flex-col mt-2 items-center rounded w-full max-h-[200px] bg-primary-dark/20  px-3 py-2 cursor-pointer  overflow-y-auto overflow-x-hidden scroll-smooth	transition ease-in-out duration-150">
        {inscribe.selectedBlock.map((item, index) => {
          return (
            <div
              key={index}
              className="flex relative justify-between w-full rounded px-4 py-2 m-1 items-center bg-[#1a537798] drop-shadow hover:bg-[#246da1cb] transition ease-in-out"
            >
              <div className="font-extralight">{item.blockNumber}.LiteMap</div>
              <div className="flex items-center justify-center">
                <FaTimes
                  onClick={(e) => removeBlock(item.blockNumber)}
                  className="absolute top-2.5 right-1.5 z-20 cursor-pointer p-1 rounded-full text-lg"
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default InscriptionList;
