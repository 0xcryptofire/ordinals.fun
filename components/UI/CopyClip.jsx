import React from "react";
import { FaCopy } from "react-icons/fa";

export default function CopyClip() {
  const copyToClipboard = (value, type) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="flex gap-2  items-center mt-3 p-2 bg-primary-dark/30  w-full rounded overflow-x-hidden">
      <FaCopy
        className="ml-1 cursor-pointer"
        onClick={() => copyToClipboard("ltc1qrn6eqzxdhaaq8t9jl58skcjkrcrfpwsch548c5")}
      />
     <p className="break-words">ltc1qrn6eqzxdhaaq8t9jl58 skcjkrcrfpwsch548c5</p> 
    </div>
  );
}
