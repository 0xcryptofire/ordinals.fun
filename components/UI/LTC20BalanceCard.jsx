import { useRouter } from "next/router";
import React from "react";
import { MdGeneratingTokens } from "react-icons/md";

export default function LTC20BalanceCard({ data }) {
  const router = useRouter();

  const goToTokenPage = (ticker) => {
    router.push("/wallet/ltc20Token/" + ticker);
  };

  return (
    <div
      className="in-card text-[13px]"
      onClick={() => goToTokenPage(data?.ticker)}
    >
      <div className="flex justify-between my-1">
        <p className="font-semibold text-sky-400 text-[16px]">{data?.ticker}</p>
        <p>
          <MdGeneratingTokens />
        </p>
      </div>
      <div className="flex justify-between my-1">
        <p className="text-gray-300">Transferable:</p>
        <p>{data?.transferableBalance}</p>
      </div>
      <div className="flex justify-between my-1">
        <p className="text-gray-300">Available:</p>
        <p>{data?.availableBalance}</p>
      </div>
      <hr className="cs-border border-t-none border-b-none" />
      <div className="flex justify-between my-1">
        <p className="text-gray-300">Balance:</p>
        <p>{data?.overallBalance}</p>
      </div>
    </div>
  );
}
