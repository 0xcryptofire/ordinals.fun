import React from "react";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function AddressCheck({
  loading,
  receiveAddress,
  isValidAddress,
}) {
  if (loading.address)
    return (
      <AiOutlineLoading3Quarters
        className="text-white my-auto mr-2 animate-spin"
        aria-hidden="true"
      />
    );
  else
    return (
      <>
        {receiveAddress && isValidAddress && (
          <FaCheckCircle
            className="text-green-400 my-auto mr-2"
            aria-hidden="true"
          />
        )}
        {receiveAddress && !isValidAddress && (
          <FaExclamationCircle
            className="text-red-400 my-auto mr-2"
            aria-hidden="true"
          />
        )}
      </>
    );
}
