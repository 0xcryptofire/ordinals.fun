import React from "react";
import Head from "next/head";
import openApi from "@/services/openAPI";
import Layout from "@/components/sections/Layout";
import Link from "next/link";
import Tabs from "@/components/UI/Tabs";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { WalletContext } from "@/context/wallet";
import { useMemo } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { toast } from "react-hot-toast";
import Ltc20tokenCard from "../../../components/UI/ltc20tokenCard";
import { LuPencilLine } from "react-icons/lu";
import { MdCancel } from "react-icons/md";

export default function LTC20Token() {
  const wallet = useContext(WalletContext);
  const address = wallet.getAddress();
  const router = useRouter();
  const [bulkSelect, setBulkSelect] = useState(false);
  const [ticker, setTicker] = useState();
  const [fetchingData, setFetchingData] = useState(true);
  const [tokenSummary, setTokenSummary] = useState({
    tokenBalance: {
      ticker,
      overallBalance: "",
      availableBalance: "",
      transferableBalance: "",
      availableBalanceSafe: "",
      availableBalanceUnSafe: "",
    },
    tokenInfo: {
      totalSupply: "",
      totalMinted: "",
    },
    historyList: [],
    transferableList: [],
  });

  const [transferableList, setTransferableList] = useState();
  const [total, setTotal] = useState();
  const [pageSize, setPageSize] = useState(12);
  const [offset, setOffset] = useState(0);

  const outOfMint =
    tokenSummary.tokenInfo.totalMinted == tokenSummary.tokenInfo.totalSupply;

  const shouldShowSafe =
    tokenSummary.tokenBalance.availableBalanceSafe !==
    tokenSummary.tokenBalance.availableBalance;

  const balance = useMemo(() => {
    if (!tokenSummary) {
      return "--";
    }
    return tokenSummary?.tokenBalance.overallBalance;
  }, [tokenSummary]);

  const handlePageClick = (e) => {
    setOffset(e.selected);
  };

  const getTokenSummary = async (address, ticker) => {
    try {
      const res = await openApi.getAddressTokenSummary(
        "ltc1qlj5ey57k3x0h5hxvfxcny4h6sa468ac7f7mpru",
        ticker
      );
      setTokenSummary(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      setFetchingData(true);
      console.log("ddd");

      const { list, total } = await openApi.getTokenTransferableList(
        "ltc1qlj5ey57k3x0h5hxvfxcny4h6sa468ac7f7mpru",
        ticker,
        offset + 1,
        pageSize
      );
      console.log("ddd");
      setTransferableList(list);
      setTotal(total);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setFetchingData(false);
    }
  };

  // useEffect(() => {
  //    if (router.asPath !== router.route) {
  //     if (router?.query?.ticker) {
  //        setTicker(router?.query?.ticker);
  //      }
  //    }
  //  }, [router.isReady]);
  //
  //  useEffect(() => {
  //    if (ticker && address) {
  //     getTokenSummary(address, ticker);
  //   }
  // }, [ticker, address]);

  //   useEffect(() => {
  //    if (ticker && address) {
  //     fetchData();
  //     }
  //  }, [offset, ticker, address]);

  return (
    <Layout>
      <Head>
        <title>Litemap - LTC20 Token</title>
        <meta
          name="description"
          content="Litemap - wallet history and inscriptions"
        />
      </Head>

      <h1 className="text-3xl font-semibold my-16 text-center">My Wallet</h1>

      <div className="flex justify-center sm:justify-between w-full">
        <Tabs type={"ltc20"} loading={false} />

        {!bulkSelect ? (
          <button
            className="main_btn px-2 py-1 rounded-md hidden sm:inline-block"
            // onClick={() => setBulkSelect(true)}
          >
            Bulk Select
          </button>
        ) : (
          <button
            className=" bg-red-500 main_btn px-2 py-1 rounded-md gap-2  items-center hidden sm:flex"
            // onClick={() => cancelBlocks()}
          >
            <MdCancel /> Cancel
          </button>
        )}
      </div>

      <div className="flex justify-between w-full gap-2 items-center">
        <Link
          href={"/wallet/ltc20"}
          className="px-4 py-2 main_btn rounded-md mb-3 mt-4"
        >
          <FaArrowLeft className="text-xl" />
        </Link>

        <button className="main_btn px-3 py-2 rounded-md flex gap-2 items-center justify-center">
          <LuPencilLine /> Inscribe
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-3 gap-2 w-full cs-border rounded-sm">
        <div className="flex gap-2 justify-center">
          <p className="text-gray-300">Ticker:</p>
          <p>{tokenSummary?.tokenBalance?.ticker || "--"}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <p className="text-gray-300">Transferable:</p>
          <p>{tokenSummary?.tokenBalance.transferableBalance || "--"}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <p className="text-gray-300">Available:</p>
          <p>{tokenSummary?.tokenBalance.availableBalance || "--"}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <p className="text-gray-300">Overall:</p>
          <p>{tokenSummary?.tokenBalance?.overallBalance || "--"}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <p className="text-gray-300">Supply:</p>
          <p>{tokenSummary?.tokenInfo?.totalSupply || "--"}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <p className="text-gray-300">Minted:</p>
          <p>{tokenSummary?.tokenInfo?.totalMinted || "--"}</p>
        </div>
      </div>

      {fetchingData ? (
        <div className="my-auto flex  justify-center gap-2 items-center">
          <AiOutlineLoading className="text-3xl animate-spin" />
        </div>
      ) : (
        <>
          {transferableList?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 w-full">
                {transferableList.map((item, index) => {
                  return <Ltc20tokenCard data={item} key={index + offset} />;
                })}
              </div>
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={Math.ceil(total / 12)}
                previousLabel="<"
                renderOnZeroPageCount={null}
                className="pagination"
              />
            </>
          ) : (
            <>
              <div className="my-auto flex  justify-center gap-2 items-center text-xl font-semiboldd">
                No {ticker} Transferable Balance
              </div>
            </>
          )}
        </>
      )}
    </Layout>
  );
}
