import React, { useEffect, useState } from "react";
import InscriptionCardSkelenton from "../UI/InscriptionCardSkelenton";
import InscriptionCard from "../UI/InscriptionCard";
import ReactPaginate from "react-paginate";

export default function Others({
  inscriptionsFromDB,
  loading,
  bulkSelect,
  setSelectedBlocks,
  selectedBlocks,
  lastBlock,
}) {
  const [offset, setOffset] = useState(0);

  const handlePageClick = (e) => {
    setOffset(e.selected);
  };

  return (
    <div className={`w-full ${!inscriptionsFromDB && "my-auto"}`}>
      <div className="my-2">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8 w-full">
            {Array.from({ length: 10 }, (_, key) => {
              return <InscriptionCardSkelenton key={key} />;
            })}
          </div>
        ) : (
          <>
            {inscriptionsFromDB ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8 w-full">
                  {inscriptionsFromDB &&
                    inscriptionsFromDB
                      .slice(offset * 10, offset * 10 + 10)
                      .map((inscription, key) => {
                        return (
                          <InscriptionCard
                            inscription={inscription}
                            key={inscription?.inscriptionId + "others"}
                            inscriptionIndex={key + offset * 10}
                            bulkSelect={bulkSelect}
                            tag="others"
                            setSelectedBlocks={setSelectedBlocks}
                            selectedBlocks={selectedBlocks}
                            isNFT={false}
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
                  pageCount={Math.ceil(
                    Object.keys(inscriptionsFromDB).length / 10
                  )}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                  className="pagination"
                />
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full mt-16">
                <h1 className="text-xl font-bold mb-8 animate-pulse text-center">
                  You don not have any NFTs.
                </h1>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
