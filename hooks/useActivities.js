import {
  ref,
  push,
  query,
  orderByChild,
  equalTo,
  onValue,
  update,
  get,
  remove,
} from "firebase/database";
import { db } from "@/services/firebase";
import { useCallback, useContext } from "react";
import { WalletContext } from "../context/wallet";
import { toast } from "react-hot-toast";

export default function useActivities() {
  const wallet = useContext(WalletContext);
  const address = wallet.getAddress();

  const addListForSale = async (tag, inscriptionId, content, price) => {
    if (!address) {
      toast.error("Please connect your wallet.");
      return;
    }
    const dbRef = ref(db, `wallet/${address}/activities`);
    const newActivity = {
      date: Date.now(),
      tag: tag,
      content: content,
      id: inscriptionId,
      price: price,
      type: "Listed",
      tx: "",
    };
    await push(dbRef, newActivity);
  };

  const updateListForSold = async (
    tag,
    inscriptionId,
    content,
    price,
    address,
    tx
  ) => {
    if (!address) {
      toast.error("Please connect your wallet.");
      return;
    }
    const dbQueryForActivityUpdate = query(
      ref(db, `wallet/${address}/activities`),
      orderByChild("id"),
      equalTo(inscriptionId)
    );

    const activitySnapShot = await get(dbQueryForActivityUpdate);
    const existedActivity = activitySnapShot.val();

    if (existedActivity) {
      const key = Object.keys(existedActivity)[0];
      const dbRefForUpdate = ref(db, `wallet/${address}/activities/${key}`);

      await update(dbRefForUpdate, {
        ...existedActivity[key],
        date: Date.now(),
        tag: tag,
        price: price,
        type: "Sold",
        content: content,
        tx: tx,
      });
    }
  };

  const addActiviyForBuy = async (tag, inscriptionId, content, price, tx) => {
    if (!address) {
      toast.error("Please connect your wallet.");
      return;
    }
    const dbRef = ref(db, `wallet/${address}/activities`);
    const newActivity = {
      date: Date.now(),
      tag: tag,
      content: content,
      id: inscriptionId,
      price: price,
      type: "Buy",
      tx: tx,
    };
    await push(dbRef, newActivity);

    const dbRefForActivities = ref(db, `activities`);
    const activity = {
      date: Date.now(),
      tag: tag,
      content: content,
      id: inscriptionId,
      price: price,
      type: "Buy",
      tx: tx,
    };
    await push(dbRefForActivities, activity);

    await handleUpdateStatus(tag, price);
  };

  const handleUpdateStatus = async (tag, price) => {
    const dbQuery = query(ref(db, `status/${tag}`));

    const snapshot = await get(dbQuery);
    const exist = snapshot.val();

    if (!exist) {
      const dbRefStatus = ref(db, `/status/${tag}`);
      await push(dbRefStatus, {
        TVL: Number(price),
        floor: Number(price),
        listed: 1,
      });
    } else {
      const key = Object.keys(exist)[0];
      const url = `/status/${tag}/${key}`;
      const dbRefStatus = ref(db, url);

      const updates = {};

      updates[`TVL`] = Number(exist[key]?.TVL) - Number(price);
      updates[`floor`] =
        (Number(exist[key]?.TVL) - Number(price)) /
        (Number(exist[key]?.listed) - 1);
      updates[`listed`] = Number(exist[key]?.listed) - 1;

      await update(dbRefStatus, updates);
    }
  };

  const removeListFromMarket = async (inscriptionId) => {
    if (!address) {
      toast.error("Please connect your wallet.");
      return;
    }
    const dbQueryForActivityUpdate = query(
      ref(db, `wallet/${address}/activities`),
      orderByChild("id"),
      equalTo(inscriptionId)
    );

    const activitySnapShot = await get(dbQueryForActivityUpdate);
    const existedActivity = activitySnapShot.val();

    if (existedActivity) {
      const key = Object.keys(existedActivity)[0];
      if (existedActivity[key]?.type === "Listed") {
        const dbRefForUpdate = ref(db, `wallet/${address}/activities/${key}`);
        await remove(dbRefForUpdate);
      }
    }
  };

  return {
    addlistForSale: addListForSale,
    updateListForSold: updateListForSold,
    addActiviyForBuy: addActiviyForBuy,
    removeListFromMarket: removeListFromMarket,
  };
}
