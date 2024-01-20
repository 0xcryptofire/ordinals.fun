import React from "react";
import { useEffect, useState } from "react";

const FeeRateType = {
  CURRENT: 0,
  CUSTOM: 1,
};

export default function OutPutValue({ defaultValue, onChange }) {
  const options = [
    {
      title: "Current",
      value: defaultValue,
    },
    {
      title: "Custom",
    },
  ];
  const [optionIndex, setOptionIndex] = useState(FeeRateType.CURRENT);
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    let val = defaultValue;
    if (optionIndex === FeeRateType.CUSTOM) {
      val = parseInt(inputVal);
    } else if (options.length > 0) {
      val = options[optionIndex].value;
    }
    onChange(val);
  }, [optionIndex, inputVal]);

  return (
    <div>
      <p className="my-1">Output Value:</p>
      <div className="flex gap-2">
        {options.map((v, index) => {
          const selected = index === optionIndex;
          return (
            <div
              key={v.title}
              onClick={() => {
                setOptionIndex(index);
              }}
              className={`${
                selected && "bg-[#103e5c]"
              } output-item`}
            >
              <p>{v.title}</p>
              {v.value && <p>{`${v.value} sats`} </p>}
            </div>
          );
        })}
      </div>
      {optionIndex === FeeRateType.CUSTOM && (
        <input
          type="number"
          className="w-full mt-3 bg-transparent py-2 px-2 rounded-md border border-[white!important] focus:outline-none"
          preset="amount"
          placeholder={"lit/vB"}
          defaultValue={inputVal}
          value={inputVal}
          autoFocus={true}
          onChange={async (e) => {
            const val = e.target.value + "";
            setInputVal(val);
          }}
          onBlur={() => {
            if (inputVal) {
              const val = parseInt(inputVal || "0") + "";
              setInputVal(val);
            }
          }}
        />
      )}
    </div>
  );
}
