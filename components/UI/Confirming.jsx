import React from "react";
import { AiFillCheckCircle, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegCircle } from "react-icons/fa6";
import { addressFormat } from "@/utils";

export default function Confirming({
  confirmed2,
  confirmed3,
  confirmed4,
  finished,
  inscriptionId,
}) {
  return (
    <>
      <div className="flex justify-center items-center gap-2 mt-4 mb-8">
        <div className="relative">
          {!finished ? (
            <AiOutlineLoading3Quarters
              className={`text-2xl font-extrabold animate-spin text-green-500`}
            />
          ) : (
            <FaRegCircle className="text-2xl font-extrabold text-green-500 " />
          )}

          <p
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-green-500`}
          >
            Awaiting
          </p>
        </div>

        <div
          className={`border-2 rounded-md w-[60px]  ${
            confirmed2 ? "border-green-500" : "border-white"
          } `}
        />

        <div className="relative">
          {confirmed2 ? (
            <>
              {!finished ? (
                <AiOutlineLoading3Quarters
                  className={`text-2xl font-extrabold animate-spin text-green-500`}
                />
              ) : (
                <FaRegCircle className="text-2xl font-extrabold text-green-500" />
              )}
            </>
          ) : (
            <FaRegCircle className="text-2xl font-extrabold text-white" />
          )}
          <p
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm ${
              confirmed2 ? "text-green-500" : "text-white "
            }`}
          >
            Confirming
          </p>
        </div>

        <div
          className={`border-2 rounded-md w-[60px]  ${
            confirmed3 ? "border-green-500" : "border-white"
          }`}
        />

        <div className="relative">
          {confirmed3 ? (
            <>
              {!finished ? (
                <AiOutlineLoading3Quarters
                  className={`text-2xl font-extrabold animate-spin text-green-500`}
                />
              ) : (
                <>
                  <FaRegCircle className="text-2xl font-extrabold text-green-500" />
                </>
              )}
            </>
          ) : (
            <FaRegCircle className="text-2xl font-extrabold text-white" />
          )}
          <p
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm ${
              confirmed3 ? "text-green-500" : "text-white "
            }`}
          >
            Inscribing
          </p>
        </div>

        <div
          className={`border-2 rounded-md w-[60px]  ${
            confirmed4 ? "border-green-500" : "border-white"
          }`}
        />

        <div className="relative">
          {confirmed4 ? (
            <>
              {!finished ? (
                <AiOutlineLoading3Quarters
                  className={`text-2xl font-extrabold animate-spin text-green-500`}
                />
              ) : (
                <>
                  <FaRegCircle className="text-2xl font-extrabold text-green-500" />
                </>
              )}
            </>
          ) : (
            <FaRegCircle className="text-2xl font-extrabold text-white" />
          )}
          <p
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm ${
              confirmed4 ? "text-green-500" : "text-white "
            }`}
          >
            Delivering
          </p>
        </div>
      </div>

      {inscriptionId && confirmed4 && finished && (
        <div className="mt-2 flex flex-col items-center">
          <AiFillCheckCircle className="text-6xl text-green-500" />
          <a
            href={"https://ordinalslite.com/inscription/" + inscriptionId}
            target="_blank"
            className="underline hover:text-sky-400"
          >
            {addressFormat(inscriptionId, 17)}
          </a>
        </div>
      )}
    </>
  );
}
