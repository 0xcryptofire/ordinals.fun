import React from "react";
import { AiFillWarning } from "react-icons/ai";
import { useWallet } from "../../store/hooks";

export default function BuyBills({ listingPrice }) {
  const { price } = useWallet();

  return (
    <>
      <hr className="w-[80%] mt-3 mx-auto" />
      <div className="pt-2">
        <div className="grid grid-cols-2 font-light py-1 text-sm">
          <p className="text-right pr-2 ">Price:</p>
          <p className="text-left pl-2 ">
            {listingPrice} LTC
            <span className="text-[11px] text-gray-300 ">
              &nbsp; ~$&nbsp;
              {(listingPrice * price).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1  text-sm">
          <p className="text-right pr-2">Service Fee (2%):</p>
          <p className="text-left pl-2">
            {listingPrice * 0.02} LTC
            <span className=" text-[11px] text-gray-300 ">
              &nbsp;~$ {(listingPrice * 0.02 * price).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1 text-sm">
          <p className="text-right pr-2">=</p>
          <p className="text-left pl-2">
            <span className="line-through">
              {" "}
              {Number(listingPrice) + Number(listingPrice) * 0.02}
            </span>{" "}
            LTC
            <span className=" text-[11px] text-gray-300 ">
              &nbsp;~${" "}
              {((Number(listingPrice) + Number(listingPrice) * 0.02) * price).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1 mt-3  text-sm">
          <p className="text-right pr-2">Total Fee:</p>
          <p className="text-left pl-2">
            {Number(Number(listingPrice) + Number(listingPrice) * 0.02).toFixed(4)} LTC
            <span className=" text-[11px] text-gray-300 ">
              &nbsp;~$
              {(
                Number(
                  Number(
                    Number(listingPrice) + Number(listingPrice) * 0.02
                  ).toFixed(4)
                ) * price
              ).toFixed(2)}
            </span>
          </p>
        </div>
      </div>
      <div className="text-sm font-extralight flex justify-center w-full mt-3">
        <p className="flex gap-1">
          <AiFillWarning className="text-lg ml-auto" />
          Please make sure if you are buying the right inscription.
        </p>
      </div>
    </>
  );
}
