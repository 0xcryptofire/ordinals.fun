import React from "react";
import { useState, useEffect } from "react";
import BuyModal from "../trade/BuyModal";
import { ref, query, orderByChild, equalTo, onValue } from "firebase/database";
import { db } from "@/services/firebase";
import { AiOutlineLoading } from "react-icons/ai";
import { useRouter } from "next/router";
import Image from "next/image";

export default function BuyCardForNFTs({
  inscription,
  price,
  utxos,
  sortedUtxos,
  dummyUTXOs,
  refreshUTXOs,
  selectUtxos,
  slug,
  isListed,
}) {
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [listed, setListed] = useState(false);
  const [list, setList] = useState();
  const [checkingListed, setCheckingListed] = useState(true);

  const goToDetails = (id) => {
    if (id) {
      router.push(`/inscription/${id}`);
    }
  };

  const empyImage = (e) => {
    e.target.src = "/empty.png";
  };

  const getList = async (id) => {
    setCheckingListed(true);
    const dbQueryForList = query(
      ref(db, `market/${slug}`),
      orderByChild("data/inscriptionId"),
      equalTo(id)
    );

    onValue(dbQueryForList, async (snapshot) => {
      const exist = snapshot.val();
      if (exist) {
        const key = Object.keys(exist)[0];
        setList(exist[key]);
        setListed(true);
      }
      setCheckingListed(false);
    });
  };

  useEffect(() => {
    if (inscription?.id && !isListed) {
      getList(inscription?.id);
    }
  }, [inscription]);

  if (isListed) {
    return (
      <>
        <div
          className="in-card"
          onClick={() => goToDetails(inscription?.data?.inscriptionId)}
        >
          <div className="in-content p-0">
            <Image
              width={160}
              height={160}
              key={inscription?.data?.inscriptionId}
              src={`https://ordinalslite.com/content/${inscription?.data?.inscriptionId}`}
              className="object-contain"
              alt=""
              onError={(e) => empyImage(e)}
            />
          </div>

          <hr className="mb-2" />

          <div className="flex justify-between gap-1 text-[12px]">
            <p>name:</p>
            <p>{inscription.content}</p>
          </div>
          <div className="flex justify-between gap-1 mb-2 text-[12px]">
            <p>Price:</p>
            <p>
              {inscription?.price}{" "}
              <span className="text-gray-300">
                ~$ {(inscription?.price * price).toFixed(3)}
              </span>
            </p>
          </div>

          <button
            className="main_btn py-1 mt-1 rounded-md disabled:bg-primary-dark/10  w-full"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              setIsOpen(true);
            }}
          >
            Buy
          </button>
        </div>

        <BuyModal
          modalIsOpen={modalIsOpen}
          setIsOpen={setIsOpen}
          list={inscription}
          utxos={utxos}
          sortedUtxos={sortedUtxos}
          dummyUTXOs={dummyUTXOs}
          refreshUTXOs={refreshUTXOs}
          selectUtxos={selectUtxos}
          tag={slug}
        />
      </>
    );
  } else {
    return (
      <>
        <div className="in-card" onClick={() => goToDetails(inscription.id)}>
          <div className="in-content p-0">
            <Image
              width={160}
              height={160}
              key={inscription.id}
              src={`https://ordinalslite.com/content/${inscription.id}`}
              className="object-contain"
              alt=""
            />
          </div>

          <hr className="mb-2" />

          <div className="flex justify-between gap-1 text-[12px]">
            <p>name:</p>
            <p>{inscription.meta.name}</p>
          </div>
          <div className="flex justify-between gap-1 mb-2 text-[12px]">
            <p>Price:</p>
            <p>
              {list?.price}{" "}
              <span className="text-gray-300">
                ~$ {(list?.price * price).toFixed(3)}
              </span>
            </p>
          </div>

          <>
            {checkingListed ? (
              <button className="main_btn py-1 mt-1 rounded-md disabled:bg-primary-dark/10  w-full">
                <AiOutlineLoading className="animate-spin m-auto my-1" />
              </button>
            ) : (
              <button
                disabled={!listed}
                className="main_btn py-1 mt-1 rounded-md disabled:bg-primary-dark/10  w-full"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  setIsOpen(true);
                }}
              >
                {!listed ? "Not Listed" : "Buy"}
              </button>
            )}
          </>
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
          tag={slug}
        />
      </>
    );
  }
}
