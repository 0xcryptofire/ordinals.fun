import React from "react";
import {
  equalTo,
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref,
  startAt,
} from "firebase/database";
import { db } from "@/services/firebase";
import { useEffect } from "react";
import { useState } from "react";
import { useLastBlock, useMintedBlocksFromAPI } from "../../store/hooks";
import NumberFormat from "../UI/NumberFormatter";
import Link from "next/link";

export default function Banner({ title, tag }) {
  const { mintedBlockNumber } = useMintedBlocksFromAPI();
  const { lastBlock } = useLastBlock();
  const [status, setStatus] = useState(0);
  const [volume24, setVolume24] = useState(0);
  const [volumeh, setVolumeh] = useState(0);
  const [trade24, setTrades24] = useState(0);

  useEffect(() => {
    async function fetchStatus() {
      const dbQuery = query(ref(db, "status/" + tag));
      onValue(dbQuery, async (snapshot) => {
        const exist = snapshot.val();
        if (exist) {
          const data = exist[Object.keys(exist)[0]];
          setStatus(data);
        }
      });

      const dbTradesQuery = query(
        ref(db, "activities"),
        orderByChild("tag"),
        equalTo(tag),
        limitToLast(100)
      );

      onValue(dbTradesQuery, async (snapshot) => {
        const exist = snapshot.val();
        if (exist) {
          let TVL = 0;
          let trades = 0;
          Object.keys(exist).map((index) => {
            if (exist[index].date > Date.now() - 86400000)
              TVL += Number(exist[index].price);
            trades += 1;
          });

          setTrades24(trades);
          setVolume24(TVL);
        }
      });

      const dbTradesh = query(ref(db, "market/" + tag), orderByChild("date"));

      // startAt(Date.now() - 3600000)

      onValue(dbTradesh, async (snapshot) => {
        const exist = snapshot.val();
        if (exist) {
          let TVLh = 0;
          Object.keys(exist).map((index) => {
            if (exist.paid) {
              TVLh += Number(exist[index].price);
            }
          });
          setVolumeh(TVLh);
        }
      });
    }
    fetchStatus();
  }, []);

  return (
    <>
      <div className="text-4xl font-bold my-16 text-center sm:text-left">
        {title}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div>
          <p className="font-semibold">
            {status ? (
              <NumberFormat number={status?.floor?.toFixed(2)} />
            ) : (
              "0.00"
            )}{" "}
            LTC
          </p>
          <p className="text-sm text-gray-300 ">Averge price</p>
        </div>
        <div>
          <p className="font-semibold">
            {status ? <NumberFormat number={status?.TVL?.toFixed(2)} /> : 0.0}{" "}
            LTC
          </p>
          <p className="text-sm text-gray-300 ">Total volume</p>
        </div>
        <div>
          <p className="font-semibold">
            {volume24 ? <NumberFormat number={volume24?.toFixed(2)} /> : "0.00"}{" "}
            LTC
          </p>
          <p className="text-sm text-gray-300 ">Volume (24h)</p>
        </div>
        <div>
          <p className="font-semibold">
            {trade24 ? <NumberFormat number={trade24} /> : 0}
          </p>
          <p className="text-sm text-gray-300 ">Trades (24h)</p>
        </div>
        <div>
          <p className="font-semibold">
            {mintedBlockNumber ? mintedBlockNumber : 0}
          </p>
          <p className="text-sm text-gray-300 ">Owners</p>
        </div>
        <div>
          <p className="font-semibold">{lastBlock ? lastBlock : 0}</p>
          <p className="text-sm text-gray-300 ">Latest Block</p>
        </div>
        <div>
          <p className="font-semibold">
            {status?.listed ? <NumberFormat number={status?.listed} /> : 0}
          </p>
          <p className="text-sm text-gray-300 ">Listed</p>
        </div>
      </div>

      <div className="w-full my-8 flex justify-between">
        {/* <div className="main_btn px-3 py-2 rounded-md w-fit">
          🔥 {volumeh} buys in last hour
        </div> */}
        <Link href={"/wallet"} className="main_btn px-3 py-2 rounded-md w-fit">
          Create Listing
        </Link>
      </div>
    </>
  );
}
