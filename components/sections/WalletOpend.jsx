import React from "react";
import { useState } from "react";
import WalletSend from "./WalletSend";
import WalletSecret from "./WalletSecret";
import WalletMain from "./WalletMain";

export default function WalletOpend() {
  const [contentType, setContentType] = useState("main");

  if (contentType === "main") {
    return <WalletMain setContentType={setContentType} />;
  } else if (contentType === "send") {
    return <WalletSend setContentType={setContentType} />;
  } else {
    return <WalletSecret setContentType={setContentType} />;
  }
}
