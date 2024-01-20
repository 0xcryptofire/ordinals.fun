import React from "react";

export default function BuyCardShowAll({
  slug = "Banksy superstar",
  setShowAll,
  disabled,
}) {
  return (
    <button
      disabled={disabled}
      className="in-card flex justify-center items-center cursor-pointer"
      onClick={() => setShowAll(true)}
    >
      <p className="text-center">Show All Listed {slug}(s)</p>
    </button>
  );
}
