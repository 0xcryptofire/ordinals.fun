import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function BillsOnPayment({ length, setFee }) {
  const account = useSelector(
    (state) => state?.persistedReducer?.walletReducer?.value
  );
  const inscribeFee = length * 12000;
  const serviceFee = Number(
    (length * (510000 + 10 ** 8 / account.price)).toFixed(0)
  );
  const sizeFee = length * 19;
  const totalFee = Number((inscribeFee + serviceFee + sizeFee).toFixed(0));

  useEffect(() => {
    if (account.price && totalFee) {
      setFee((totalFee - (totalFee % 1000)) / 100000000);
    }
  }, [account, totalFee]);

  return (
    <>
      <div className="mt-2">
        <div className="grid grid-cols-2 font-light py-1 text-sm">
          <p className="text-right pr-2 ">Sats In Inscription:</p>
          <p className="text-left pl-2 ">
            {length} * 10000 sats
            <span className="text-[11px] text-gray-300 ">
              &nbsp; ~$&nbsp;
              {((inscribeFee / 10 ** 8) * account.price).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1  text-sm">
          <p className="text-right pr-2">Service Fee:</p>
          <p className="text-left pl-2">
            {serviceFee} sats
            <span className=" text-[11px] text-gray-300 ">
              {" "}
              &nbsp;~$ {((serviceFee / 10 ** 8) * account.price).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1  text-sm">
          <p className="text-right pr-2">Size Fee:</p>
          <p className="text-left pl-2">
            {sizeFee} sats
            <span className=" text-[11px] text-gray-300 ">
              {" "}
              &nbsp;~$ {((sizeFee / 10 ** 8) * account.price).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1  text-sm">
          <p className="text-right pr-2">=</p>
          <p className="text-left pl-2">
            <span className="line-through"> {totalFee}</span> sats
            <span className=" text-[11px] text-gray-300 ">
              {" "}
              &nbsp;~$ {((totalFee / 10 ** 8) * account.price).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1 mt-3  text-sm">
          <p className="text-right pr-2">Total Sats To Pay:</p>
          <p className="text-left pl-2">
            {totalFee - (totalFee % 1000)} sats
            <span className=" text-[11px] text-gray-300 ">
              {" "}
              &nbsp;~${" "}
              {(
                ((totalFee - (totalFee % 1000)) / 10 ** 8) *
                account.price
              ).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1  text-sm">
          <p className="text-right pr-2">Total LTC To Pay:</p>
          <p className="text-left pl-2 flex gap-1">
            {(totalFee - (totalFee % 1000)) / 100000000} LTC
            <span className=" text-[11px] text-gray-300 ">
              {" "}
              &nbsp;~${" "}
              {(
                ((totalFee - (totalFee % 1000)) / 10 ** 8) *
                account.price
              ).toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
