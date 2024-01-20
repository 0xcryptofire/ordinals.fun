import Link from "next/link";
import React from "react";

export default function Tabs({ type, loading }) {
  return (
    <div className="flex items-center cs-border rounded-t-md divide-x divide-gray-500/80">
      <Link
        href={"/wallet/litemaps"}
        className={`py-2 lg:w-24 h-full w-[70px] text-center  text-sm rounded-none rounded-tl-md ${
          type == "litemap" ? "main_btn" : ""
        }`}
      >
        LiteMaps
      </Link>
      <Link
        href={"/wallet/ltc20"}
        className={`py-2 lg:w-24 h-full w-[70px] text-center  text-sm  rounded-none ${
          type == "ltc20" ? "main_btn" : ""
        }`}
      >
        LTC-20
      </Link>
      <Link
        href={"/wallet/NFTs"}
        className={`py-2 lg:w-24 h-full w-[70px] text-center  text-sm rounded-none ${
          type == "nfts" ? "main_btn" : ""
        }`}
      >
        NFTs
      </Link>
      <Link
        href={"/wallet/others"}
        className={`py-2 lg:w-24 h-full w-[70px] text-center  text-sm rounded-none ${
          type == "others" ? "main_btn" : ""
        }`}
      >
        Others
      </Link>
      <Link
        href={"/wallet/history"}
        className={`py-2 lg:w-24 h-full w-[70px] text-center  text-sm rounded-none  rounded-tr-md ${
          type == "history" ? "main_btn" : ""
        }`}
      >
        History
      </Link>
    </div>
  );
}
