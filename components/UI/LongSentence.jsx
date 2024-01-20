import React from "react";
import { copyToClipboard } from "@/utils";
import { toast } from "react-hot-toast";

export default function LongSentence({ text }) {
  const copied = () => {
    toast.success("copied!");
  };

  return (
    <p
      className="break-words mb-3 text-center"
      style={{ overflowWrap: "anywhere" }}
      onClick={() => {
        copyToClipboard(text);
        copied();
      }}
    >
      {text}
    </p>
  );
}
