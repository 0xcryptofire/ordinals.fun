import BigNumber from "bignumber.js";
import * as bitcoin from "bitcoinjs-lib";
export * from "./hooks";
export * from "./WalletContext";

export function addressFormat(address, length) {
  try {
    if (address) {
      const formattedAddress =
        address.slice(0, length) + "..." + address.slice(-length);
      return formattedAddress;
    }
  } catch (error) {
  //  console.log(error);
  }
}

const UI_TYPE = {
  Tab: "index",
  Pop: "popup",
  Notification: "notification",
};

type UiTypeCheck = {
  isTab: boolean;
  isNotification: boolean;
  isPop: boolean;
};

export const getUiType = (): UiTypeCheck => {
  const { pathname } = window.location;
  return Object.entries(UI_TYPE).reduce((m, [key, value]) => {
    m[`is${key}`] = pathname === `/${value}.html`;

    return m;
  }, {} as UiTypeCheck);
};

export const hex2Text = (hex: string) => {
  try {
    return hex.startsWith("0x")
      ? decodeURIComponent(
          hex.replace(/^0x/, "").replace(/[0-9a-f]{2}/g, "%$&")
        )
      : hex;
  } catch {
    return hex;
  }
};

export const getUITypeName = (): string => {
  // need to refact
  const UIType = getUiType();

  if (UIType.isPop) return "popup";
  if (UIType.isNotification) return "notification";
  if (UIType.isTab) return "tab";

  return "";
};

/**
 *
 * @param origin (exchange.pancakeswap.finance)
 * @returns (pancakeswap)
 */
export const getOriginName = (origin: string) => {
  const matches = origin.replace(/https?:\/\//, "").match(/^([^.]+\.)?(\S+)\./);

  return matches ? matches[2] || origin : origin;
};

export const hashCode = (str: string) => {
  if (!str) return 0;
  let hash = 0,
    i,
    chr,
    len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export const ellipsisOverflowedText = (
  str: string,
  length = 5,
  removeLastComma = false
) => {
  if (str.length <= length) return str;
  let cut = str.substring(0, length);
  if (removeLastComma) {
    if (cut.endsWith(",")) {
      cut = cut.substring(0, length - 1);
    }
  }
  return `${cut}...`;
};

export const satoshisToBTC = (amount: number) => {
  return amount / 100000000;
};

export const btcTosatoshis = (amount: number) => {
  return Math.floor(amount * 100000000);
};

export function shortAddress(address?: string, len = 5) {
  if (!address) return "";
  if (address.length <= len * 2) return address;
  return address.slice(0, len) + "..." + address.slice(address.length - len);
}

export function shortDesc(desc?: string, len = 50) {
  if (!desc) return "";
  if (desc.length <= len) return desc;
  return desc.slice(0, len) + "...";
}

export async function sleep(timeSec: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, timeSec * 1000);
  });
}

export function isValidAddress(address: string) {
  if (!address) return false;
  return true;
}

export const copyToClipboard = (textToCopy: string | number) => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(textToCopy.toString());
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy.toString();
    textArea.style.position = "absolute";
    textArea.style.opacity = "0";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise<void>((res, rej) => {
      document.execCommand("copy") ? res() : rej();
      textArea.remove();
    });
  }
};

export function formatDate(date: Date, fmt = "yyyy-MM-dd hh:mm:ss") {
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  for (const k in o)
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
  return fmt;
}

export function satoshisToAmount(val: number) {
  const num = new BigNumber(val);
  return num.dividedBy(100000000).toFixed(8);
}

export function amountToSatoshis(val: any) {
  const num = new BigNumber(val);
  return num.multipliedBy(100000000).toNumber();
}

export function toPsbtNetwork() {
  return {
    messagePrefix: "\x19Litecoin Signed Message:\n",
    bech32: "ltc",
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
  };
}

export function publicKeyToAddress(publicKey, type) {
  const network = toPsbtNetwork();
  if (!publicKey) return "";
  const pubkey = Buffer.from(publicKey, "hex");
  if (type === 0) {
    const { address } = bitcoin.payments.p2pkh({
      pubkey,
      network,
    });
    return address || "";
  } else if (type === 1 || 4) {
    const { address } = bitcoin.payments.p2wpkh({
      pubkey,
      network,
    });
    return address || "";
  } else if (type === 2 || type === 5) {
    const { address } = bitcoin.payments.p2tr({
      internalPubkey: pubkey.slice(1, 33),
      network,
    });
    return address || "";
  } else if (type === 3) {
    const data = bitcoin.payments.p2wpkh({
      pubkey,
      network,
    });
    const { address } = bitcoin.payments.p2sh({
      pubkey,
      network,
      redeem: data,
    });
    return address || "";
  } else {
    return "";
  }
}

export const currentPrice = async () => {
  try {
    const data = await fetch(
      "https://api.diadata.org/v1/assetInfo/Litecoin/0x0000000000000000000000000000000000000000"
    );
    const jsonData = await data.json();
    const currentPrice = jsonData?.Price;
    return currentPrice;
  } catch (error) {
  //  console.log(error);
  }
};

export const calculateFee = (
  vins,
  vouts,
  recommendedFeeRate,
  includeChangeOutput = true
) => {
  const baseTxSize = 10;
  const inSize = 180;
  const outSize = 34;

  const txSize =
    baseTxSize +
    vins * inSize +
    vouts * outSize +
    Number(includeChangeOutput) * outSize;
  const fee = txSize * recommendedFeeRate;
  console.log(fee)

  return fee;
};

export const getTxHexById = async (txId) => {
  const result = await fetch(
    `https://litecoinspace.org/api/tx/${txId}/hex`
  ).then((response) => response.text());

  return result;
};

export const validateInscription = async (key, inscriptionid) => {
  try {
    const res = await fetch(`/searchInscription/text?text=${key}`);
    const resJson = await res.json();
    if (resJson?.totalItems > 0) {
      const filter = resJson?.results.filter(
        (inscription) => inscription?.contentstr === key
      );

      if (filter.length > 0) {
        return filter[0].inscriptionid === inscriptionid;
      } else {
        return true;
      }
    } else {
      return true;
    }
  } catch (error) {
  //  console.log(error);
    return true;
  }
};
