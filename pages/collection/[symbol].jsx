import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";
import { collectionsData } from "../../configs/constants";
import Layout from "../../components/sections/Layout";
import ReactPaginate from "react-paginate";
import { useWallet } from "../../store/hooks";
import useUTXOs from "../../hooks/useUTXOs";
import BuyCardForNFTs from "../../components/UI/BuyCardForNFTs";
import BuyCardSkelenton from "../../components/UI/BuyCardSkelenton";
import NFTCollectionBanner from "../../components/trade/NFTCollectionBanner";
import {
  onValue,
  ref,
  query,
  orderByChild,
  equalTo,
  limitToLast,
} from "firebase/database";
import { db } from "@/services/firebase";
import BuyCardShowAll from "../../components/UI/BuyCardShowAll";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function Collection() {
  const router = useRouter();
  const { utxos, sortedUtxos, dummyUTXOs, refreshUTXOs, selectUtxos } =
    useUTXOs();
  const { price } = useWallet();

  const [slug, setslug] = useState();
  const [collection, setCollection] = useState();
  const [inscriptions, setInscriptions] = useState();
  const [fetchingData, setFetchingData] = useState(true);
  const [offset, setOffset] = useState(0);

  const [listedNFTs, setListedNFTs] = useState();
  const [listedNumber, setListedNumber] = useState(0);
  const [fetchingListings, setFetchingListings] = useState(true);
  const [offsetListed, setOffsetListed] = useState(0);

  const [showAll, setShowAll] = useState(false);

  const handlePageClickForListed = () => {
    setOffsetListed(e.selected);
  };

  const handlePageClick = (e) => {
    setOffset(e.selected);
  };

  async function getCollection(collectionSlug) {
    const [inscriptions] = await Promise.all([
      fetch(
        `https://raw.githubusercontent.com/litecoinlabs/collections/main/collections/${collectionSlug}/inscriptions.json`
      ).then((response) => response.json()),
    ]);
    setInscriptions(inscriptions);
    setFetchingData(false);
  }

  const fetchList = async () => {
    let dbQuery;
    if (showAll) {
      dbQuery = query(
        ref(db, "market/" + slug),
        orderByChild("paid"),
        equalTo(false)
      );
    } else {
      dbQuery = query(
        ref(db, "market/" + slug),
        orderByChild("paid"),
        equalTo(false),
        limitToLast(5)
      );
    }

    onValue(dbQuery, async (snapshot) => {
      const exist = snapshot.val();
      if (exist) {
        setListedNumber(snapshot.size);
        setListedNFTs(exist);
      }
      setFetchingListings(false);
    });
  };

  useEffect(() => {
    if (router.asPath !== router.route) {
      setslug(router?.query?.symbol);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (slug) {
      const filter = collectionsData.filter((item) => item.slug === slug);
      if (filter.length > 0) {
        setCollection(filter[0]);
      }
      getCollection(slug);
      fetchList();
    }
  }, [slug]);

  useEffect(() => {
    if (showAll) {
      fetchList();
    }
  }, [showAll]);

  return (
    <Layout>
      <Head>
        <title>Litemap - {collection?.name} Market </title>
        <meta
          name="description"
          content="Litemap - NFTs Market place on Litecoin"
        />
      </Head>

      <NFTCollectionBanner key={slug} collection={collection} tag={slug} />

      {showAll && (
        <div className="w-full my-3 ml-1">
          <button
            className="main_btn px-4 py-2 flex justify-center itemx-center rounded-md"
            onClick={() => setShowAll(false)}
          >
            <FaArrowLeftLong className="text-xl" />
          </button>
        </div>
      )}

      <h1 className="my-3 text-xl font-semibold">Listed NFTs</h1>

      {fetchingListings ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4 w-full">
          {Array.from({ length: 5 }, (_, index) => {
            return <BuyCardSkelenton key={index} />;
          })}
          <BuyCardShowAll slug={slug} setShowAll={setShowAll} disabled={true} />
        </div>
      ) : (
        <>
          {listedNFTs ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4 w-full">
                {Object.keys(listedNFTs)
                  .reverse()
                  .slice(offsetListed * 12, offsetListed * 12 + 12)
                  .map((key, index) => {
                    return (
                      <BuyCardForNFTs
                        key={index}
                        inscription={listedNFTs[key]}
                        price={price}
                        utxos={utxos}
                        sortedUtxos={sortedUtxos}
                        dummyUTXOs={dummyUTXOs}
                        refreshUTXOs={refreshUTXOs}
                        selectUtxos={selectUtxos}
                        slug={slug}
                        isListed={true}
                      />
                    );
                  })}

                {!showAll && (
                  <>
                    {Array.from({ length: 5 - listedNumber }, (_, index) => {
                      return <BuyCardSkelenton key={index} isListed={false} />;
                    })}
                    <BuyCardShowAll
                      slug={slug}
                      setShowAll={setShowAll}
                      disabled={false}
                    />
                  </>
                )}
              </div>
              {showAll && (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClickForListed}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={1}
                  pageCount={Math.ceil(listedNumber / 12)}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                  className="pagination"
                />
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4 w-full relative">
                {Array.from({ length: 5 }, (_, index) => {
                  return <BuyCardSkelenton key={index} />;
                })}
                <BuyCardShowAll
                  slug={slug}
                  setShowAll={setShowAll}
                  disabled={true}
                />

                <div className="absolute w-full h-full rounded-md flex justify-center items-center ">
                  <div className="p-6 rounded-md bg-white/10 backdrop-blur-sm">
                    <p className="text-center">There is not listed NFTs Yet.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {!showAll && (
        <>
          <h1 className="my-3 text-xl font-semibold">All NFTs</h1>
          {fetchingData ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4 w-full">
              {Array.from({ length: 12 }, (_, index) => {
                return <BuyCardSkelenton key={index} />;
              })}
            </div>
          ) : (
            <>
              {inscriptions.length > 0 && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4 w-full">
                    {inscriptions
                      .slice(offset * 12, offset * 12 + 12)
                      .map((inscription, index) => {
                        return (
                          <BuyCardForNFTs
                            key={index}
                            inscription={inscription}
                            price={price}
                            utxos={utxos}
                            sortedUtxos={sortedUtxos}
                            dummyUTXOs={dummyUTXOs}
                            refreshUTXOs={refreshUTXOs}
                            selectUtxos={selectUtxos}
                            slug={slug}
                            isListed={false}
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
                    pageCount={Math.ceil(inscriptions.length / 12)}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    className="pagination"
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </Layout>
  );
}
