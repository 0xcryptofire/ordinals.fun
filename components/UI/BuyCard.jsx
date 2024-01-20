import React from "react";
import { useState } from "react";
import { addressFormat } from "@/utils";
import BuyModal from "../trade/BuyModal";
import { useContext } from "react";
import { WalletContext } from "../../context/wallet";
import { TbArticleOff } from "react-icons/tb";
import Link from "next/link";
import { useRouter } from "next/router";

export default function BuyCard({
  list,
  price,
  utxos,
  sortedUtxos,
  dummyUTXOs,
  refreshUTXOs,
  selectUtxos,
}) {
  const router = useRouter();
  const wallet = useContext(WalletContext);
  const address = wallet.getAddress();
  const [modalIsOpen, setIsOpen] = useState(false);

  const goToDetails = (id) => {
    router.push(`/inscription/${id}`);
  };

  const empyImage = (e) => {
    e.target.src = "/empty.png";
  };

  return (
    <>
      <div
        className="in-card"
        onClick={() => goToDetails(list?.data?.inscriptionId)}
      >
        <div className="in-content">
          {list?.data?.contentType.indexOf("image") > -1 && (
            <>
              <img
                key={list?.data?.inscriptionNumber}
                src={`https://ordinalslite.com/content/${list?.data?.inscriptionId}`}
                className="w-full h-full object-contain"
                alt=""
                onError={(e) => empyImage(e)}
              />
            </>
          )}

          {list?.data?.contentType.indexOf("text") > -1 && (
            <>
              {list?.content.indexOf("tick") > -1 ? (
                <div className="text-lg font-bold px-3">
                  {JSON.parse(list?.content).tick}
                </div>
              ) : (
                <div className="text-lg font-bold px-3">{list?.content}</div>
              )}
            </>
          )}

          <div className="in-transfer">#{list?.data?.inscriptionNumber}</div>
        </div>

        <hr className="mb-2" />

        <div className="flex justify-between gap-1 text-sm">
          <p>Seller:</p>
          <p>{addressFormat(list?.seller, 4)}</p>
        </div>
        <div className="flex justify-between gap-1 mb-2 text-sm">
          <p>Price:</p>
          <p>
            {list?.price}{" "}
            <span className="text-[11px] text-gray-300">
              ~$ {(list?.price * price).toFixed(3)}
            </span>
          </p>
        </div>
        {list.seller === address ? (
          <Link
            href="/wallet"
            className="main_btn py-1 rounded-md bg-transparent disabled:bg-primary-light/10 w-full flex gap-1 justify-center items-center"
          >
            <TbArticleOff /> Listed By You
          </Link>
        ) : (
          <button
            className="main_btn py-1 rounded-md disabled:bg-primary-dark/10  w-full"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              setIsOpen(true);
            }}
          >
            Buy
          </button>
        )}
      </div>

      <BuyModal
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        list={list}
        utxos={utxos}
        sortedUtxos={sortedUtxos}
        dummyUTXOs={dummyUTXOs}
        refreshUTXOs={refreshUTXOs}
        selectUtxos={selectUtxos}
        tag={list?.tag}
      />
    </>
  );
}
