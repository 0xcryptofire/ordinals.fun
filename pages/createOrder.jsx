import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import FeeRecommend from "@/components/UI/FeeRecommend";
import InscriptionList from "@/components/InscriptionList";
import Layout from "@/components/sections/Layout";
import Bills from "@/components/UI/Bills";
import { useRouter } from "next/router";
import InputAddress from "../components/UI/InputAddress";
import { useDispatch } from "react-redux";
import { updateFeeRate } from "@/store/slices/inscribe";
import { toast } from "react-hot-toast";
import { ref, push } from "firebase/database";
import { db } from "@/services/firebase";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useInscribe } from "../store/hooks";
import OrderHistory from "../components/UI/OrderHistory";
import Head from "next/head";

const CreateOrder = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { selectedBlock, receiveAddress } = useInscribe();

  const [feeOption, setFeeOption] = useState("economy");
  const [pendingOrder, setPendingOrder] = useState(false);

  const placeOrder = async () => {
    if (selectedBlock <= 0) {
      toast.error("Please select blocks to inscribe");
      return;
    }

    if (!receiveAddress) {
      toast.error("Please input receive Address");
      return;
    }

    let files = [];
    selectedBlock.map((item, key) => {
      let dataURL =
        "data:text/plain;base64," + btoa(item.blockNumber + ".litemap");
      let size = (item.blockNumber + ".litemap").length;
      files.push({
        size: size,
        type: "text/plain",
        name: key + ".txt",
        dataURL: dataURL,
        url: "",
      });
    });

    const data = {
      files: files,
      fee: "4",
      receiveAddress: receiveAddress,
      referral: "",
    };

    setPendingOrder(true);
    fetch("/ordinalslite/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((order) => {
        const dbRef = ref(db, "/orders");
        push(dbRef, { ...order, orderId: order?.charge?.id + "48" })
          .then(() => {
            setPendingOrder(false);
            router.push("/order/" + order?.charge?.id + "48");
          })
          .catch((error) => {
            console.error("Error saving transaction:", error);
            setPendingOrder(false);
          });
      })
      .catch((error) => {
        toast.error(error);
        setPendingOrder(false);
        return;
      });
  };

  const backToInscribe = () => {
    router.push("/inscribe");
  };

  const handleChangeFeeOption = (e) => {
    dispatch(updateFeeRate(e));
  };

  return (
    <Layout>
      <Head>
        <title>Litemap - Create Order</title>
        <meta
          name="description"
          content="Litemap - Create order to inscribe litemaps"
        />
      </Head>

      <div className="py-16 flex justify-center relative">
        <div className="w-full max-w-[600px] bg-primary-dark/20 px-4 py-8 rounded-lg relative shadow-lg shadow-black/30">
          <div
            className="absolute px-2 py-1 rounded top-2 left-2 z-10 text-sm cursor-pointer"
            onClick={backToInscribe}
          >
            <FaArrowLeft className="text-lg mt-3" />
          </div>
          <div className="py-2">
            <h2 className="text-center text-2xl mb-3">Inscribe LiteMap</h2>
          </div>
          <InscriptionList />
          <InputAddress />
          <FeeRecommend
            feeOption={feeOption}
            setFeeOption={setFeeOption}
            onChange={handleChangeFeeOption}
          />
          <Bills />
          <button
            className="main_btn py-2 px-3 w-full mt-6 rounded-md flex justify-center h-[41px] items-center"
            onClick={placeOrder}
          >
            {pendingOrder ? (
              <AiOutlineLoading3Quarters className="text-xl animate-spin text-center" />
            ) : (
              "Submit & Pay Invoice"
            )}
          </button>
        </div>
      </div>

      <OrderHistory />
    </Layout>
  );
};

export default CreateOrder;
