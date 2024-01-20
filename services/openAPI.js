const { CHANNEL, OPENAPI_URL_MAINNET, VERSION } = require("@/shared/constant");

const API_STATUS = {
  FAILED: "0",
  SUCCESS: "1",
};

const baseMempoolApiUrl = "https://litecoinspace.org/api";

class OpenApiService {
  constructor() {
    this.store = {
      host: OPENAPI_URL_MAINNET,
      //   deviceId: deviceId,
    };

    const getConfig = async () => {
      try {
        this.store.config = await this.getWalletConfig();
      } catch (e) {
        this.store.config = {
          version: "0.0.0",
          moonPayEnabled: false,
          statusMessage: e.message,
        };
      }
    };
    getConfig();
  }

  setHost = async () => {
    this.store.host = OPENAPI_URL_MAINNET;
    await this.init();
  };

  setDeviceId = async (id) => {
    this.store.deviceId = id;
  };

  getHost = () => {
    return this.store.host;
  };

  setClientAddress = async (token) => {
    this.clientAddress = token;
  };

  httpGet = async (route, params) => {
    let url = this.getHost() + route;
    let c = 0;
    for (const id in params) {
      if (c == 0) {
        url += "?";
      } else {
        url += "&";
      }
      url += `${id}=${params[id]}`;
      c++;
    }
    const headers = new Headers();
    headers.append("X-Client", "Litescribe Wallet");
    headers.append("X-Version", VERSION);
    headers.append("x-address", this.clientAddress);
    headers.append("x-channel", CHANNEL);
    headers.append("x-udid", this.store.deviceId);
    try {
      const res = await fetch(new Request(url), {
        method: "GET",
        headers,
        mode: "cors",
        cache: "default",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  httpPost = async (route, params) => {
    const url = this.getHost() + route;
    const headers = new Headers();
    headers.append("X-Client", "Litescribe Wallet");
    headers.append("X-Version", VERSION);
    headers.append("x-address", this.clientAddress);
    headers.append("x-channel", CHANNEL);
    headers.append("x-udid", this.store.deviceId);
    headers.append("Content-Type", "application/json;charset=utf-8");
    const res = await fetch(new Request(url), {
      method: "POST",
      headers,
      mode: "cors",
      cache: "default",
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  };

  // getWalletConfig = async () => {
  //   const data = await this.httpGet("/default/config", {});
  //   if (data.status == API_STATUS.FAILED) {
  //     console.log(data.message);
  //   }
  //   return data.result;
  // };

  getAddressBalance = async (address) => {
    const data = await this.httpGet("/address/balance", {
      address,
    });
    if (data) {
      if (data.status == API_STATUS.FAILED) {
        console.log(data.message);
      }
      return data.result;
    }
  };

  getMultiAddressAssets = async (addresses) => {
    const data = await this.httpGet("/address/multi-assets", {
      addresses,
    });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  findGroupAssets = async (groups) => {
    const data = await this.httpPost("/address/find-group-assets", {
      groups,
    });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  getAddressUtxo = async (address) => {
    const data = await this.httpGet("/address/btc-utxo", {
      address,
    });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  getInscriptionUtxo = async (inscriptionId) => {
    const data = await this.httpGet("/inscription/utxo", {
      inscriptionId,
    });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  getInscriptionUtxoDetail = async (inscriptionId) => {
    const data = await this.httpGet("/inscription/utxo-detail", {
      inscriptionId,
    });
    if (data?.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data?.result;
  };

  getInscriptionUtxos = async (inscriptionIds) => {
    const data = await this.httpPost("/inscription/utxos", {
      inscriptionIds,
    });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  getAddressInscriptions = async (address, cursor, size) => {
    const data = await this.httpGet("/address/inscriptions", {
      address,
      cursor,
      size,
    });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  getAddressRecentHistory = async (address) => {
    const data = await this.httpGet("/address/recent-history", {
      address,
    });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  getInscriptionSummary = async () => {
    const data = await this.httpGet("/default/inscription-summary", {});
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  getAppSummary = async () => {
    const data = await this.httpGet("/default/app-summary", {});
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  pushTx = async (rawtx) => {
    const data = await this.httpPost("/tx/broadcast", {
      rawtx,
    });
    if (data.status == API_STATUS.FAILED) {
      return data.message;
    }
    return data.result;
  };

  getFeeSummary = async () => {
    try {
      const data = await this.httpGet("/default/fee-summary", {});
      if (data.status == API_STATUS.FAILED) {
        console.log(data.message);
      }
      return data.result;
    } catch (error) {
      console.log(error);
    }
  };

  getDomainInfo = async (domain) => {
    const data = await this.httpGet("/address/search", { domain });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  inscribeBRC20Transfer = async (address, tick, amount, feeRate) => {
    const data = await this.httpPost("/brc20/inscribe-transfer", {
      address,
      tick,
      amount,
      feeRate,
    });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  getInscribeResult = async (orderId) => {
    const data = await this.httpGet("/brc20/order-result", { orderId });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  getAddressTokenBalances = async (address, cursor, size) => {
    const data = await this.httpGet("/brc20/tokens", { address, cursor, size });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  getAddressTokenSummary = async (address, ticker) => {
    const data = await this.httpGet("/brc20/token-summary", {
      address,
      ticker: encodeURIComponent(ticker),
    });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  getTokenTransferableList = async (address, ticker, cursor, size) => {
    const data = await this.httpGet("/brc20/transferable-list", {
      address,
      ticker: encodeURIComponent(ticker),
      cursor,
      size,
    });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  decodePsbt = async (psbtHex) => {
    const data = await this.httpPost("/tx/decode", { psbtHex });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  createMoonpayUrl = async (address) => {
    const data = await this.httpPost("/moonpay/create", { address });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  checkWebsite = async (website) => {
    const data = await this.httpPost("/default/check-website", { website });
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };

  createOrder = async () => {
    const data = await this.httpPost("/order/create");
    if (data.status == API_STATUS.FAILED) {
      console.log(data.message);
    }
    return data.result;
  };
}

export default new OpenApiService();
