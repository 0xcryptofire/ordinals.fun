import React from "react";
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaAngleLeft,
    FaAngleRight,
  } from "react-icons/fa";

export default function Paginate({
  firstPage,
  currentPage,
  prePage,
  latestblock,
  step,
  currentPageNumber,
  handleChangeCurrentPage,
  handleSetCurrentPage,
  nextPage,
  LastPage 
}) {
  return (
    <div className="flex gap-0.5 justify-end w-100 mt-4">
      <button
        className="border border-[#00bbff0f] cursor-pointer rounded p-2 hover:bg-[#0e3a59] hover:text-white"
        onClick={firstPage}
        disabled={currentPage === 0}
      >
        <FaAngleDoubleLeft />
      </button>
      <button
        className="border border-[#00bbff0f] cursor-pointer rounded p-2 hover:bg-[#0e3a59] hover:text-white"
        onClick={prePage}
        disabled={currentPage === 0}
      >
        <FaAngleLeft />
      </button>
      <div className="flex border border-[#00bbff0f] rounded px-2 w-[150px] text-center outline-none justify-between">
        <div className="flex w-full">
          <input
            max={latestblock / (step + 1)}
            type="number"
            value={
              currentPageNumber || currentPageNumber === 0
                ? currentPageNumber + 1
                : null
            }
            className="bg-transparent w-[60px] text-center outline-none"
            onChange={(e) => handleChangeCurrentPage(e)}
            onKeyDown={(e) => handleSetCurrentPage(e)}
          />
          <span className="mt-1">/</span>
          <input
            type="text"
            value={`${(latestblock / (step + 1)).toFixed(0)}`}
            className="bg-transparent w-[60px] outline-none text-center"
            readOnly
          />
        </div>
      </div>
      <button
        className="border border-[#00bbff0f] cursor-pointer rounded p-2 hover:bg-[#0e3a59] hover:text-white"
        onClick={nextPage}
        disabled={currentPage + 1 === Math.ceil(latestblock / (step + 1))}
      >
        <FaAngleRight />
      </button>
      <button
        className="border border-[#00bbff0f] cursor-pointer rounded p-2 hover:bg-[#0e3a59] hover:text-white"
        onClick={LastPage}
        disabled={currentPage + 1 === Math.ceil(latestblock / (step + 1))}
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  );
}
