import React from "react";
import Head from "next/head";
import Block from "@/components/UI/Block";
import Banner from "@/components/UI/Banner";
import Layout from "@/components/sections/Layout";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initialize, setBulkMintBlocks } from "@/store/slices/inscribe";
import { FaArrowRight } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import ControlPanel from "../components/ControlPanel";
import { useBlocks, useInscribe, useLastBlock } from "../store/hooks";
import isMobile from "is-mobile";

const Inscribe = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { lastBlock } = useLastBlock();
  const { mintedBlocks } = useBlocks();
  const { selectedBlock } = useInscribe();

  const [pageStep, setPageStep] = useState(1);
  const [pageSize, setPageSize] = useState(300);
  const [pageCount, setPageCount] = useState(lastBlock / 300);
  const [bulkMintAmount, setBulkMintAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(2013994);

  const nextPage = () => {
    router.push("/createOrder");
  };

  function binarySearch(target) {
    let left = 0;
    let right = mintedBlocks.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (mintedBlocks[mid].blockNumber === target) {
        return false; // Block number found
      }

      if (mintedBlocks[mid].blockNumber < target) {
        left = mid + 1; // Continue searching in the right half
      } else {
        right = mid - 1; // Continue searching in the left half
      }
    }

    return true; // Block number not found
  }

  const bulkMint = () => {
    if (!bulkMintAmount) {
      toast.error("Please input the amount of Blocks");
      return;
    }

    let bulkMintArray = [];
    for (let index = 0; index < Number(bulkMintAmount); index++) {
      if (binarySearch(lastBlock - (index + pageStep))) {
        bulkMintArray.push({
          blockNumber: lastBlock - (index + pageStep),
          id: "",
          date: Date.now(),
          orderCreated: false,
          paid: false,
          orderId: "",
          owner: "",
        });
      }
    }

    if (bulkMintArray.length > 0) {
      dispatch(setBulkMintBlocks(bulkMintArray));
    } else {
      toast.error(
        "There is no blocks to mint in this page. please find on the next page."
      );
    }
  };

  const cancelBlocks = () => {
    dispatch(initialize());
  };

  const handlePageClick = (e) => {
    const step = Number(e.selected) * pageSize + 1;
    setPageStep(step);
  };

  useEffect(() => {
    if (isMobile()) {
      setPageSize(102);
      setPageCount(lastBlock / 102);
    }
  }, [isMobile()]);

  useEffect(() => {
    dispatch(initialize());
  }, []);

  return (
    <Layout>
      <Head>
        <title>Litemap - Inscribe</title>
        <meta name="description" content="Litemap - Litemap inscribe" />
      </Head>

      <Banner lastBlock={lastBlock} />

      <ControlPanel
        setBulkMintAmount={setBulkMintAmount}
        from={lastBlock - pageStep}
        to={lastBlock - (pageStep + pageSize - 1)}
      />

      <ReactPaginate
        key={pageSize + "1"}
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        className="pagination"
      />

      <div className="w-full grid grid-cols-6 sm:grid-grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {Array.from({ length: pageSize }, (_, index) => {
          if (lastBlock - (index + pageStep) >= 1)
            return (
              <Block
                index={index}
                key={index}
                blockNumber={lastBlock - (index + pageStep)}
              />
            );
        })}
      </div>

      <ReactPaginate
        key={pageSize + "2"}
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        className="pagination"
      />

      <div
        className={`fixed z-50  left-1/2 border border-transparent ${
          selectedBlock.length <= 0
            ? "-bottom-64 border-[#ffffff1a]"
            : "bottom-6 sm:bottom-6"
        }   -translate-x-1/2 px-6 py-3 rounded-lg bg-white/10 backdrop-blur-2xl duration-200 flex items-center gap-3 flex-wrap shadow-black shadow-lg`}
      >
        <p>{selectedBlock.length} litemap selected.</p>
        <input
          placeholder="80"
          type="Number"
          onChange={(e) => setBulkMintAmount(e.target.value)}
          className="py-2 px-3 bg-primary-dark/20  w-[80px]  rounded-lg focus:outline-none duration-200 border border-white/50 focus:border-white/60"
        />
        <button
          className="main_btn py-2 px-3 rounded-lg flex items-center gap-2"
          onClick={bulkMint}
        >
          Select
        </button>
        <div className="flex gap-3 sm:justify-end justify-center">
          <button
            className="main_btn py-2 px-4 rounded-lg flex items-center gap-2 bg-transparent"
            onClick={() => cancelBlocks()}
          >
            <MdCancel /> Cancel
          </button>
          <button
            className="main_btn py-2 px-4 rounded-lg flex items-center gap-2 bg-sky-600"
            onClick={nextPage}
          >
            Next <FaArrowRight />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Inscribe;
