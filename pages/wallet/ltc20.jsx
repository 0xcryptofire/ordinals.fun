import openApi from "@/services/openAPI";
import Head from "next/head";
import Layout from "@/components/sections/Layout";
import Tabs from "@/components/UI/Tabs";
import LTC20BalanceCard from "../../components/UI/LTC20BalanceCard";
import ReactPaginate from "react-paginate";
import { useContext, useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { useLastBlock } from "../../store/hooks";
import { WalletContext } from "@/context/wallet";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function WalletLTC20() {
  const wallet = useContext(WalletContext);
  const address = wallet.getAddress();
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [bulkSelect, setBulkSelect] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { lastBlock } = useLastBlock();

  const [fetchingData, setfetchingData] = useState(true);
  const [tokenList, setTokenList] = useState();
  const [offset, setOffset] = useState(0);

  const handlePageClick = (e) => {
    setOffset(e.selected);
  };

  const getTransferableBalance = async (address) => {
    setfetchingData(true);

    try {
      const data = await openApi.getAddressTokenBalances(
        "ltc1qlj5ey57k3x0h5hxvfxcny4h6sa468ac7f7mpru",
        0,
        1000
      );
      setfetchingData(false);
      if (data) {
        setTokenList(data);
      }
    } catch (error) {
      setfetchingData(false);
    }
  };

  useEffect(() => {
    if (address) {
      getTransferableBalance(address);
    }
  }, [address]);

  return (
    <Layout>
      <Head>
        <title>Litemap - Wallet</title>
        <meta
          name="description"
          content="Litemap - wallet history and inscriptions"
        />
      </Head>

      <h1 className="text-3xl font-semibold my-16 text-center">My Wallet</h1>
{/* 
      {!bulkSelect ? (
        <button
          className="main_btn px-2 py-1 rounded-md sm:hidden inline-block mb-1"
          // onClick={() => setBulkSelect(true)}
        >
          Bulk Select
        </button>
      ) : (
        <button
          className=" bg-red-500 main_btn px-2 py-1 rounded-md gap-2 items-center sm:hidden flex  mb-1"
          // onClick={() => cancelBlocks()}
        >
          <MdCancel /> Cancel
        </button>
      )} */}

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

      {fetchingData ? (
        <div className="my-auto flex  justify-center gap-2 items-center">
          <AiOutlineLoading3Quarters className="text-3xl animate-spin" />
        </div>
      ) : (
        <>
          {tokenList?.list?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 text-sm gap-3 mt-8 w-full">
                {tokenList?.list
                  .slice(offset * 12, offset * 12 + 10)
                  .map((data, key) => {
                    return (
                      <LTC20BalanceCard
                        key={
                          key +
                          data?.ticker +
                          data?.overallBalance +
                          data?.availableBalance
                        }
                        data={data}
                      />
                    );
                  })}
              </div>
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={Math.ceil(tokenList?.total / 12)}
                previousLabel="<"
                renderOnZeroPageCount={null}
                className="pagination"
              />
            </>
          ) : (
            <>
              <div className="my-auto flex  justify-center gap-2 items-center text-xl font-semiboldd">
                No LTC Balance
              </div>
            </>
          )}
        </>
      )}

      {/* <LTC20 /> */}

      {/* <div
        className={`fixed z-50  left-1/2 border border-transparent ${
          !bulkSelect ? "-bottom-64 border-[#ffffff1a]" : "bottom-6 sm:bottom-6"
        }   -translate-x-1/2 px-6 py-3 rounded-lg bg-white/10 backdrop-blur-2xl duration-200 flex items-center gap-3 flex-wrap shadow-black shadow-lg`}
      >
        <p>{selectedBlocks.length} inscriptions selected.</p>
        <div className="flex gap-3 sm:justify-end justify-center">
          <button
            className="main_btn py-2 px-4 rounded-lg flex items-center gap-2 bg-transparent"
            onClick={() => cancelBlocks()}
          >
            <MdCancel /> Cancel
          </button>
          <button
            className="main_btn py-2 px-4 rounded-lg flex items-center gap-2 bg-sky-600"
            onClick={BulkList}
          >
            List <FaList />
          </button>
        </div>
      </div>

      <BulkListModal
        modalIsOpen={isOpen}
        setIsOpen={setIsOpen}
        tag={"ltc20"}
        blocks={selectedBlocks}
        setSelectedBlocks={setSelectedBlocks}
        cancelBlocks={cancelBlocks}
      /> */}
    </Layout>
  );
}
