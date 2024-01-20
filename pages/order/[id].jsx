import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Moment from "react-moment";
import Layout from "@/components/sections/Layout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  onValue,
  ref,
  query,
  orderByChild,
  equalTo,
  push,
  update,
} from "firebase/database";
import { db } from "@/services/firebase";
import { useState } from "react";
import LongSentence from "../../components/UI/LongSentence";
import PaymentData from "../../components/UI/paymentData";
import {
  updateConfirmed1,
  updateConfirmed2,
  updateConfirmed3,
  updateConfirmed4,
  clearConfirms,
} from "@/store/slices/inscribe";
import { useDispatch, useSelector } from "react-redux";
import Confirming from "../../components/UI/Confirming";
import { FaArrowLeft } from "react-icons/fa";
import Head from "next/head";

const Payment = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const inscribe = useSelector(
    (state) => state?.persistedReducer?.inscribeReducer?.value
  );
  const [ID, setID] = useState();
  const [orderData, setOrderData] = useState();
  const [finished, setFinished] = useState(false);
  const [inscriptionId, setInscriptionID] = useState();

  const goToHome = () => {
    router.push("/inscribe");
  };

  const getData = () => {
    const dbQuery = query(
      ref(db, "orders"),
      orderByChild("orderId"),
      equalTo(ID)
    );

    onValue(dbQuery, async (snapshot) => {
      const exist = snapshot.val();
      if (exist) {
        setOrderData(exist[Object.keys(exist)[0]]);
      }
    });
  };

  const saveInscription = async () => {
    try {
      if (ID) {
        const url = "https://ordinalslite.xyz/api/order?id=" + ID.slice(0, -2);
        const data = await fetch(url);
        const jsonData = await data.json();
        let inscriptions = [];
        jsonData.files.map((file, index) => {
          if (file?.tx) {
            inscriptions.push({
              id: file.tx.inscriptions[0]?.id,
              blockNumber:
                inscribe?.selectedBlock[index]?.blockNumber || "125725",
            });
          }
        });

        inscriptions.map((inscirption) => {
          const dbQuery = query(
            ref(db, "inscriptions"),
            orderByChild("id"),
            equalTo(inscirption.id)
          );

          onValue(dbQuery, async (snapshot) => {
            const exist = snapshot.val();
            setInscriptionID(inscirption.id);
            setFinished(true);
            if (exist) {
              const dbRef = ref(db, `/inscriptions/${Object.keys(exist)[0]}`);
              update(dbRef, inscirption);
            } else {
              const dbRef = ref(db, "/inscriptions");
              push(dbRef, inscirption)
                .then(() => {
                //  console.log("Transaction saved successfully");
                })
                .catch((error) => {
                  console.error("Error saving transaction:", error);
                });
            }
          });
        });
      }
    } catch (error) {
    //  console.log("----save inscription--", error);
    }
  };

  const saveOrder = async () => {
    try {
      if (ID) {
        const dbQuery = query(
          ref(db, "orders"),
          orderByChild("orderId"),
          equalTo(ID)
        );
        onValue(dbQuery, async (snapshot) => {
          const exist = snapshot.val();
          const url =
            "https://ordinalslite.xyz/api/order?id=" + ID.slice(0, -2);
          try {
            const data = await fetch(url);
            const jsonData = await data.json();
            if (exist) {
              const dbRef = ref(db, `/orders/${Object.keys(exist)[0]}`);
              update(dbRef, {
                ...jsonData,
                orderId: jsonData?.charge?.id + "48",
              });
            } else {
              const dbRef = ref(db, "/orders");
              push(dbRef, {
                ...jsonData,
                orderId: jsonData?.charge?.id + "48",
              });
            }
          } catch (error) {}
        });
      }
    } catch (error) {}
  };

  const checkConFirmed = async () => {
    if (ID) {
      try {
        const url = "https://ordinalslite.xyz/api/order?id=" + ID.slice(0, -2);
        const data = await fetch(url);
        const jsonData = await data.json();

        if (jsonData?.paid) {
          dispatch(updateConfirmed1(true));
          dispatch(updateConfirmed2(true));
        }

        let confirm4 = true;
        jsonData?.files.map((file) => {
          if (file?.completed) {
            dispatch(updateConfirmed3(true));
          }

          if (!file?.completed) {
            confirm4 = false;
          }
        });

        dispatch(updateConfirmed4(confirm4));
      } catch (error) {}
    }
  };

  useEffect(() => {
    let id;
    if (ID) {
      id = setInterval(() => {
        checkConFirmed();
      }, [10000]);
    }

    return () => {
      clearInterval(id);
    };
  }, [ID]);

  useEffect(() => {
    if (router.asPath !== router.route) {
      setID(router?.query?.id);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (ID) {
      checkConFirmed();
      saveOrder();
      getData();
    }
  }, [ID]);

  useEffect(() => {
    if (inscribe?.confirmed4) {
      saveInscription();
    }
    if (inscribe?.confirmed2) {
      saveOrder();
    }
  }, [inscribe, ID]);

  useEffect(() => {
    dispatch(clearConfirms());
  }, []);

  return (
    <Layout>
      <Head>
        <title>Litemap - Order</title>
        <meta
          name="description"
          content="Litemap - Waiting payment for Order"
        />
      </Head>

      {orderData ? (
        <div className="py-[70px] flex justify-center relative px-2">
          <div className="px-4 py-16 w-full max-w-[600px] rounded-lgn bg-primary-dark/20 relative shadow-lg shadow-black/30">
            <div
              className="absolute px-2 py-1 rounded top-2 left-2 z-10 text-sm cursor-pointer"
              onClick={goToHome}
            >
              <FaArrowLeft className="text-lg mt-3" />
            </div>

            <div className="pb-3 w-full">
              <h4 className="text-3xl text-center">Inscribe Order</h4>
              <p className="mt-3 p-2 text-center break-words">Order ID: </p>
              <LongSentence text={orderData?.orderId} />
              <hr />
            </div>

            <PaymentData data={orderData} />

            <Confirming
              confirmed1={inscribe.confirmed1}
              confirmed2={inscribe.confirmed2}
              confirmed3={inscribe.confirmed3}
              confirmed4={inscribe.confirmed4}
              finished={finished}
              inscriptionId={inscriptionId}
            />

            <p className="text-[12px] pt-2 text-center">
              Order created at &nbsp;
              <Moment>
                {new Date(Number(orderData?.createdAt) - 60000 * 60).toString()}
              </Moment>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-40">
          <Spinner />
        </div>
      )}
    </Layout>
  );
};

export default Payment;
