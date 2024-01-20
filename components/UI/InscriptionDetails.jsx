import React from "react";

export default function InscriptionDetails({ data, content }) {
  return (
    <div className="p-3 bg-primary-dark/20 rounded-lg">
      {data ? (
        <>
          {data?.contentType?.indexOf("text") > -1 ? (
            <>
              {content && (
                <>
                  {content.indexOf("tick") > -1 ? (
                    <div className="text-lg font-bold px-3">
                      {JSON.parse(content).tick}
                    </div>
                  ) : (
                    <div className="text-lg font-bold px-3">{content}</div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="text-lg font-bold px-3">
              <img
                src={`https://ordinalslite.com/content/${data?.inscriptionId}`}
                className=" object-contain mx-auto max-w-[36px]"
                alt=""
              />
            </div>
          )}
        </>
      ) : (
        <div className="animate-pulse bg-primary-dark/20  rounded-sm h-8 w-32"></div>
      )}

      <div className="rounded-lg p-3 divide-primary-dark/40 divide-y">
        <div className="py-2">
          <p className="text-sm text-gray-300 ">
            Inscription ID
          </p>
          {data?.inscriptionId ? (
            <p className="break-words">{data?.inscriptionId}</p>
          ) : (
            <div className="animate-pulse bg-primary-dark/20  rounded-sm h-6"></div>
          )}
        </div>
        <div className="py-2">
          <p className="text-sm text-gray-300 ">Owner</p>
          {data?.address ? (
            <p className="break-words">{data?.address}</p>
          ) : (
            <div className="animate-pulse bg-primary-dark/20  rounded-sm h-6"></div>
          )}
        </div>
        <div className="py-2">
          <p className="text-sm text-gray-300 ">
            Output value
          </p>
          {data?.outputValue ? (
            <p className="break-words">{data?.outputValue}</p>
          ) : (
            <div className="animate-pulse bg-primary-dark/20  rounded-sm h-6"></div>
          )}
        </div>
        <div className="py-2">
          <p className="text-sm text-gray-300 ">
            Content Length
          </p>
          {data?.contentLength ? (
            <p className="break-words">{data?.contentLength}</p>
          ) : (
            <div className="animate-pulse bg-primary-dark/20  rounded-sm h-6"></div>
          )}
        </div>
        <div className="py-2">
          <p className="text-sm text-gray-300 ">
            Content Type
          </p>
          {data?.contentType ? (
            <p className="break-words">{data?.contentType}</p>
          ) : (
            <div className="animate-pulse bg-primary-dark/20  rounded-sm h-6"></div>
          )}
        </div>
        <div className="py-2">
          <p className="text-sm text-gray-300 ">
            Inscription Number
          </p>
          {data?.inscriptionNumber ? (
            <p className="break-words">{data?.inscriptionNumber}</p>
          ) : (
            <div className="animate-pulse bg-primary-dark/20  rounded-sm h-6"></div>
          )}
        </div>
        <div className="py-2">
          <p className="text-sm text-gray-300 ">Created</p>
          {data?.timestamp ? (
            <p className="break-words">
              {new Date(data?.timestamp * 1000).toString()}
            </p>
          ) : (
            <div className="animate-pulse bg-primary-dark/20  rounded-sm h-6"></div>
          )}
        </div>
        <div className="py-2">
          <p className="text-sm text-gray-300 ">Preview</p>
          {data?.preview ? (
            <a href={data?.preview} target="_blank" className="break-words">
              {data?.preview}
            </a>
          ) : (
            <div className="animate-pulse bg-primary-dark/20  rounded-sm h-6"></div>
          )}
        </div>
        <div className="py-2">
          <p className="text-sm text-gray-300 ">Indexer</p>
          {data?.inscriptionId ? (
            <a
              href={
                "https://ordinalslite.com/inscription/" + data?.inscriptionId
              }
              target="_blank"
              className="break-words"
            >
              {data?.inscriptionId}
            </a>
          ) : (
            <div className="animate-pulse bg-primary-dark/20  rounded-sm h-6"></div>
          )}
        </div>
      </div>
    </div>
  );
}
