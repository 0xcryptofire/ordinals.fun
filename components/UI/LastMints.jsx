import React from "react";
import { useBlocks } from "../../store/hooks";

export default function LastMints() {
  const { mintedBlocks } = useBlocks();
  const lastBlocksInHour = mintedBlocks.filter(
    (block) => block.date >= Date.now() - 3600000
  );

  return (
    <div className="main_btn py-2 px-3 rounded-md w-fit">
      🔥 {lastBlocksInHour.length} mints in last hour
    </div>
  );
}
