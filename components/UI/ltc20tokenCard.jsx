import React from "react";

export default function Ltc20tokenCard({ data }) {
  console.log(data);
  return (
    <div className="in-card">
      <div className="in-content flex-col h-[130px] w-full">
        {data?.amount} <br />
        <p className="mt-1 text-sm text-gray-300 text-center">{data?.ticker}</p>
        <button className="in-transfer">Transfer</button>
      </div>
      <hr className="cs-border" />
      <div className="text-center text-sm text-gray-300">
        #{data?.inscriptionNumber}
      </div>
      <button className="main_btn h-8 w-full rounded-md mt-1">List</button>
    </div>
  );
}
