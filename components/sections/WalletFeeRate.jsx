import { useEffect, useState } from "react";
import React, { useContext } from "react";
import { WalletContext } from "../../context/wallet";

const FeeRateType = {
  SLOW: 0,
  AVG: 1,
  FAST: 2,
  CUSTOM: 3,
};

export function FeeRateBar({ onChange }) {
  const wallet = useContext(WalletContext);

  const [feeOptions, setFeeOptions] = useState([]);

  useEffect(() => {
    wallet.getFeeSummary().then((v) => {
      setFeeOptions([...v.list, { title: "Custom", feeRate: 0 }]);
    });
  }, []);

  const [feeOptionIndex, setFeeOptionIndex] = useState(FeeRateType.AVG);
  const [feeRateInputVal, setFeeRateInputVal] = useState("");

  useEffect(() => {
    const defaultOption = feeOptions[1];
    const defaultVal = defaultOption ? defaultOption.feeRate : 1;

    let val = defaultVal;
    if (feeOptionIndex === FeeRateType.CUSTOM) {
      val = parseInt(feeRateInputVal) || 0;
    } else if (feeOptions.length > 0) {
      val = feeOptions[feeOptionIndex].feeRate;
    }
    onChange(val);
  }, [feeOptions, feeOptionIndex, feeRateInputVal]);

  const adjustFeeRateInput = (inputVal) => {
    let val = parseInt(inputVal);
    if (!val) {
      setFeeRateInputVal("");
      return;
    }
    const defaultOption = feeOptions[1];
    const defaultVal = defaultOption ? defaultOption.feeRate : 1;
    if (val <= 0) {
      val = defaultVal;
    }
    setFeeRateInputVal(val.toString());
  };

  return (
    <div>
      <div className="flex justify-between mt-3 gap-2">
        {feeOptions.map((v, index) => {
          const selected = index === feeOptionIndex;
          return (
            <div
              key={v.title}
              onClick={() => {
                setFeeOptionIndex(index);
              }}
              className={`cursor-pointer flex justify-center flex-col rounded-md border border-[#dee2e682!important]  p-2 ${
                selected && "bg-primary-dark/60 "
              }`}
            >
              <p className="text-center text-sm font-semibold">{v.title}</p>
              {v.title !== "Custom" && (
                <p className="text-[9px] text-center">{`${v.feeRate} lit/vB`}</p>
              )}
              {v.title !== "Custom" && (
                <p className="text-center text-[9px]">{`${v.desc}`}</p>
              )}
            </div>
          );
        })}
      </div>
      {feeOptionIndex === FeeRateType.CUSTOM && (
        <input
         className="w-full mt-3 bg-transparent py-2 px-2 rounded-lg  border border-[#dee2e682!important]  focus:outline-none"
          preset="amount"
          placeholder={"lit/vB"}
          value={feeRateInputVal}
          onChange={async (e) => {
            adjustFeeRateInput(e.target.value);
          }}
          autoFocus={true}
        />
      )}
    </div>
  );
}
