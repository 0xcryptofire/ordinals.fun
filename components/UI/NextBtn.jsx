import React from "react";
import { FaArrowRight } from "react-icons/fa";

export default function NextBtn({
  calculatePrice,
  receiveAddress,
  isValidAddress,
  loading,
}) {
  return (
    <button
      className="w-full flex items-center mt-8 text-center px-4 py-2.5 rounded-lg justify-center bg-[#00bbff0f] text-lg"
      onClick={calculatePrice}
      disabled={!receiveAddress && !isValidAddress}
    >
      {loading.calculating ? (
        <span className="flex items-center h-full">
          {/* <Spinner className="my-auto mr-2" size="sm" color="white" /> */}
          Pleae wait...
        </span>
      ) : (
        <>
          Next <FaArrowRight className="ml-2 mt-0.5" />
        </>
      )}
    </button>
  );
}
