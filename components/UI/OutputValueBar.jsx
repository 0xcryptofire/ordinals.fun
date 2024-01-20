import React, { useState, useEffect } from "react";

const FeeRateType = {
  CURRENT: 0,
  CUSTOM: 1,
};

export default function OutputValueBar({ defaultValue, onChange }) {
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
      <div className="flex justify-between mt-3 gap-2">
        {options.map((v, index) => {
          const selected = index === optionIndex;
          return (
            <div
              key={v.title}
              onClick={() => {
                setOptionIndex(index);
              }}
              className={`cursor-pointer flex justify-center flex-col rounded-md cs-border px-2 w-full py-3 items-center ${
                selected && "bg-[#103e5c]"
              }`}
            >
              <p>{v.title}</p>
              {v.value && <p>{`${v.value} sats`}</p>}
            </div>
          );
        })}
      </div>

      {optionIndex === FeeRateType.CUSTOM && (
        <input
          className="w-full mt-3 bg-transparent py-2 px-2 rounded-md cs-border focus:outline-none"
          placeholder={"sats"}
          value={inputVal}
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
          autoFocus={true}
        />
      )}
    </div>
  );
}
