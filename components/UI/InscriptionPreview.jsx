import React from "react";

export default function InscriptionPreview({ content, inscription }) {
  const empyImage = (e) => {
    e.target.src = "/empty.png";
  };

  return (
    <div className="w-full h-full text-4xl bg-primary-dark/20 rounded-lg p-3 flex justify-center items-center font-bold min-h-[400px] gap-1">
      {inscription?.contentType.indexOf("image") > -1 && (
        <>
          <img
            src={`https://ordinalslite.com/content/${inscription?.inscriptionId}`}
            className="w-full h-full object-contain"
            alt=""
            onError={(e) => empyImage(e)}
          />
        </>
      )}

      {inscription?.contentType.indexOf("text") > -1 && (
        <>
          {content && (
            <>
              {content.indexOf("tick") > -1 ? (
                <div className="text-xl font-bold px-3">
                  {JSON.parse(content).tick}
                </div>
              ) : (
                <div className="text-xl font-bold px-3">{content}</div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
