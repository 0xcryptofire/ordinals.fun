import Link from "next/link";
import React from "react";

export default function InscriptionCardSkelenton() {
  return (
    <div className="in-card">
      <div className="in-content  animate-pulse">
        <button disabled className="in-transfer">
          Transfer
        </button>
      </div>
      <Link href={"/"} className="in-link">
        ...
      </Link>
      <hr className="mb-2" />
      <button className="main_btn py-1 rounded-md w-full">List</button>
    </div>
  );
}
