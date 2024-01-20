import React, { useState, useEffect } from "react";
import { collectionsData } from "../../configs/constants";
import { CgWebsite } from "react-icons/cg";
import { FaTwitter } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";
import InscriptionCardSkelenton from "../UI/InscriptionCardSkelenton";
import Link from "next/link";
import InscriptionCard from "../UI/InscriptionCard";
import ReactPaginate from "react-paginate";

export default function NFTs({
  inscriptionsFromDB,
  loading,
  bulkSelect,
  setNFTSlug,
  setSelectedBlocks,
  selectedBlocks,
  lastBlock,
}) {
  const [index, setIndex] = useState(0);
  const [meta, setmeta] = useState();
  const [myInscriptions, setMyInscriptions] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [offset, setOffset] = useState(0);

  const handlePageClick = (e) => {
    setOffset(e.selected);
  };

  async function getCollection(collectionSlug) {
    const [inscriptions] = await Promise.all([
      fetch(
        `https://raw.githubusercontent.com/litecoinlabs/collections/main/collections/${collectionSlug}/inscriptions.json`
      ).then((response) => response.json()),
    ]);
    let NFTs = [];
    // console.log(inscriptionsFromDB, inscriptions);
    inscriptionsFromDB.map((inscription) => {
      const filter = inscriptions.filter(
        (item) => item.id === inscription.inscriptionId
      );
      if (filter.length > 0) {
        NFTs.push({ ...inscription, content: filter[0]?.meta?.name });
      }
    });
    setMyInscriptions(NFTs);
    setFetchingData(false);
  }

  useEffect(() => {
    setmeta(collectionsData[index]);
    setNFTSlug(collectionsData[index].slug);
  }, [index]);

  useEffect(() => {
    if (meta?.slug && !loading && inscriptionsFromDB) {
      getCollection(meta?.slug);
    }

    if (!loading && !inscriptionsFromDB) {
      setFetchingData(false);
    }
  }, [meta, inscriptionsFromDB, loading]);

  return (
    <div className="my-3 w-full">
      <div className="flex gap-3 justify-between w-full flex-wrap sm:flex-nowrap">
        <div className="flex gap-2 justify-between sm:justify-start">
          {meta?.inscription_icon ===
          "9278bd914fdc07f866fc4b4e402c87a0aa04666cfc9f0c9dde6ead58b17abcf7i0" ? (
            <img
              src={`/litecoin.png`}
              className="rounded-md h-[38px] w-[38px]"
              alt="logo"
            />
          ) : (
            <img
              src={`https://ordinalslite.com/content/${meta?.inscription_icon}`}
              className="rounded-md h-[38px] w-[38px]"
              alt="logo"
            />
          )}
          <select
            className="bg-primary-dark/50 px-3 py-2 rounded-md cursor-pointer"
            onChange={(e) => setIndex(e.target.value)}
          >
            {collectionsData?.map((collection, index) => {
              return (
                <option
                  className="bg-primary-dark/50"
                  value={index}
                  key={index}
                >
                  {collection.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-2 items-center justify-between sm:justify-end">
          <p>Supply: {meta?.supply} </p>
          <div className="flex gap-2">
            <a
              className="p-1.5 rounded-full main_btn"
              target="_blank"
              href={meta?.website_link}
            >
              <CgWebsite />
            </a>
            <a
              className="p-1.5 rounded-full main_btn"
              target="_blank"
              href={meta?.twitter_link}
            >
              <FaTwitter />
            </a>
            <a
              className="p-1.5 rounded-full main_btn"
              target="_blank"
              href={meta?.discord_link}
            >
              <BsDiscord />
            </a>
          </div>
        </div>
      </div>

      <div className="my-2">
        {fetchingData ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8 w-full">
            {Array.from({ length: 10 }, (_, key) => {
              return <InscriptionCardSkelenton key={key} />;
            })}
          </div>
        ) : (
          <>
            {myInscriptions.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8 w-full">
                  {myInscriptions &&
                    myInscriptions
                      .slice(offset * 10, offset * 10 + 10)
                      .map((inscription, key) => {
                        return (
                          <InscriptionCard
                            inscription={inscription}
                            key={inscription?.inscriptionId + "others"}
                            inscriptionIndex={key + offset * 10}
                            bulkSelect={bulkSelect}
                            tag={meta?.slug}
                            setSelectedBlocks={setSelectedBlocks}
                            selectedBlocks={selectedBlocks}
                            isNFT={true}
                            lastBlock={lastBlock}
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
                  pageCount={Math.ceil(Object.keys(myInscriptions).length / 10)}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                  className="pagination"
                />
              </>
            ) : (
              <div className="flex flex-col justify-center items-center w-full sm:mt-[7rem] mt-[10rem]">
                <h1 className="text-xl font-bold mb-8 animate-pulse text-center">
                  You don not have any NFTs.
                </h1>

                <Link
                  href={`/collection/${meta?.slug}`}
                  className="mx-auto main_btn px-3 py-2 rounded-md"
                >
                  Buy Now
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
