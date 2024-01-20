import React, { useEffect } from "react";
import { useState } from "react";
import { onValue, ref, query, orderByChild, equalTo } from "firebase/database";
import { db } from "@/services/firebase";
import { addressFormat } from "@/utils";
import { useRouter } from "next/router";
import { useContext } from "react";
import { WalletContext } from "@/context/wallet";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function History() {
  const router = useRouter();
  const wallet = useContext(WalletContext);
  const address = wallet.getAddress();
  const [orders, setOrders] = useState();
  const [fetchingData, setFetchingData] = useState(true);
  const [trades, setTrades] = useState();
  const [activities, setActivities] = useState();

  const goToPayment = (id) => {
    router.push("/order/" + id);
  };

  useEffect(() => {
    if (address) {
      setFetchingData(true);
      const dbQuery = query(
        ref(db, "orders"),
        orderByChild("receiveAddress"),
        equalTo(address)
      );

      onValue(dbQuery, async (snapshot) => {
        const exist = snapshot.val();
        if (exist) {
          setOrders(exist);
        }
      });

      const dbQueryForTags = query(ref(db, "tags"));

      onValue(dbQueryForTags, async (snapshot) => {
        const exist = snapshot.val();
        if (exist) {
          Object.keys(exist).map((index) => {
            const tag = exist[index];
            const dbQuery = query(
              ref(db, "market/" + tag),
              orderByChild("seller"),
              equalTo(address)
            );
            onValue(dbQuery, async (snapshot) => {
              const exist = snapshot.val();
              if (exist) {
                setTrades({ [tag]: exist });
              }
            });
          });
        }
      });

      const dbQueryForActivities = query(
        ref(db, `wallet/${address}/activities`)
      );

      onValue(dbQueryForActivities, async (snapshot) => {
        const exist = snapshot.val();
        if (exist) {
          setActivities(exist);
        }
        setFetchingData(false);
      });
    }
  }, [address]);

  return (
    <div className="w-full mt-8">
      <div className="mt-6">
        <div className="grid grid-cols-9 sm:grid-cols-12 px-3 py-2 bg-primary-dark/30 rounded-t-lg">
          <div className="col-span-3">Content</div>
          <div className="col-span-3 hidden sm:inline-block">Price</div>
          <div className="col-span-3">Action</div>
          <div className="col-span-3">Date</div>
        </div>
        {activities && !fetchingData ? (
          <div className="bg-[#14496c33] rounded-b-lg px-1 py-1  max-h-[500px] overflow-y-auto">
            {Object.keys(activities)
              .reverse()
              .map((key, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-9 sm:grid-cols-12 px-3 text-sm my-1 bg-[#19679d54] hover:bg-[#246da1cb] cursor-pointer items-center gap-2 py-1"
                  >
                    <div className="col-span-3">
                      {activities[key].content.indexOf("tick") > -1 ? (
                        <div className="text-sm font-bold px-3">
                          {JSON.parse(activities[key].content).tick}
                        </div>
                      ) : (
                        <div className="text-sm font-bold px-3">
                          {activities[key].content.length > 15
                            ? addressFormat(activities[key].content, 6)
                            : activities[key].content}
                        </div>
                      )}
                    </div>
                    <div className="col-span-3 hidden sm:inline-block">
                      {activities[key]?.price} LTC
                    </div>
                    <div
                      className={`col-span-3 ${
                        activities[key]?.type == "Sold"
                          ? "text-green-500"
                          : activities[key]?.type == "Listed"
                          ? "text-sky-500"
                          : "text-yellow-400"
                      }`}
                    >
                      {activities[key]?.type}
                    </div>
                    <div className="col-span-3 relative">
                      {new Date(activities[key]?.date).toDateString()}
                      {activities[key].type !== "Listed" && (
                        <a
                          href={`https://litecoinspace.org/tx/${activities[key].tx}`}
                          className="absolute right-1"
                          target="_blank"
                        >
                          <FaExternalLinkAlt />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <>
            {fetchingData ? (
              <div className="col-span-12 text-center py-3 bg-primary-dark/10">
                Fetching activities records...
              </div>
            ) : (
              <div className="col-span-12 text-center py-3 bg-primary-dark/10">
                No Order Records are Founded.
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-12 px-3 py-2 bg-primary-dark/30 rounded-t-lg">
          <div className="col-span-6">Content</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-3">Date</div>
        </div>
        {trades && !fetchingData ? (
          <div className="bg-[#14496c33] rounded-b-lg px-1 py-1  max-h-[500px] overflow-y-auto">
            {Object.keys(trades).map((tag, index) => {
              return (
                <div key={index}>
                  <p className="font-semibold text-lg">-{tag}</p>

                  {Object.keys(trades[tag])
                    .reverse()
                    .map((tradekey, index) => {
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-12 px-3 mb-1.5 bg-[#19679d54] hover:bg-[#246da1cb] cursor-pointer items-center gap-2 py-1"
                        >
                          <div className="my-1 col-span-6 text-sm">
                            {trades[tag][tradekey].content}
                          </div>
                          <div className="col-span-3">
                            {trades[tag][tradekey]?.paid == true ? (
                              <>
                                <span className="text-sm text-green-500">
                                  Sold
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-sky-500">
                                Listed
                              </span>
                            )}
                          </div>
                          <div
                            key={index + "Date"}
                            className="col-span-3 text-sm"
                          >
                            {new Date(
                              trades[tag][tradekey]?.date
                            ).toDateString()}
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {fetchingData ? (
              <div className="col-span-12 text-center py-3 bg-primary-dark/10">
                Fetching list from market records...
              </div>
            ) : (
              <div className="col-span-12 text-center py-3 bg-primary-dark/10">
                No Order Records are Founded.
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-12 px-3 py-2 bg-primary-dark/30 rounded-t-lg">
          <div className="col-span-6">Order ID</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-3">Date</div>
        </div>
        {orders && !fetchingData ? (
          <div className="bg-[#14496c33] rounded-b-lg px-1 py-1  max-h-[500px] overflow-y-auto">
            {Object.keys(orders)
              .reverse()
              .map((key, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 px-3 mb-1.5 bg-[#19679d54] hover:bg-[#246da1cb] cursor-pointer items-center gap-2 py-1"
                    onClick={() => goToPayment(orders[key].orderId)}
                  >
                    <div key={index + "id"} className="my-1 col-span-6 text-sm">
                      {addressFormat(orders[key].orderId, 10)}
                    </div>
                    <div key={index + "status"} className="col-span-3">
                      {orders[key]?.paid == true ? (
                        <>
                          <span className="text-sm text-green-500">Paid</span>
                        </>
                      ) : (
                        <span className="text-sm text-red-500">No Action</span>
                      )}
                    </div>
                    <div key={index + "Date"} className="col-span-3 text-sm">
                      {new Date(
                        orders[key]?.charge?.created_at * 1000
                      ).toDateString()}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <>
            {fetchingData ? (
              <div className="col-span-12 text-center py-3 bg-primary-dark/10">
                Fetching order records...
              </div>
            ) : (
              <div className="col-span-12 text-center py-3 bg-primary-dark/10">
                No Order Records are Founded.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
