// fork from https://github.com/MetaMask/KeyringController/blob/master/index.js
const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");
const encryptor = require("browser-passworder");
const { EventEmitter } = require("events");
const log = require("loglevel");

const { ADDRESS_TYPES, KEYRING_TYPE } = require("@/shared/constant");
const { AddressType } = require("@/shared/types");
const { ObservableStore } = require("@metamask/obs-store");
const { HdKeyring } = require("@unisat/bitcoin-hd-keyring");
const { SimpleKeyring } = require("@unisat/bitcoin-simple-keyring");

const { publicKeyToAddress } = require("./../utils");

const preference = require("./preference");
const { DisplayKeyring } = require("./display");

const KEYRING_SDK_TYPES = {
  SimpleKeyring,
  HdKeyring,
};

// const KEYRING_CLASS = {
//   PRIVATE_KEY: SimpleKeyring.type,
//   MNEMONIC: HdKeyring.type,
// };

class EmptyKeyring {
  constructor() {
    // todo
  }
  async addAccounts(n) {
    return [];
  }

  async getAccounts() {
    return [];
  }
  signTransaction(psbt, inputs) {
    console.log("Method not implemented.");
  }
  signMessage(address, message) {
    console.log("Method not implemented.");
  }
  verifyMessage(address, message, sig) {
    console.log("Method not implemented.");
  }
  exportAccount(address) {
    console.log("Method not implemented.");
  }
  removeAccount(address) {
    console.log("Method not implemented.");
  }

  async serialize() {
    return "";
  }

  async deserialize(opts) {
    return;
  }
}

class KeyringService extends EventEmitter {
  keyringTypes;
  store;
  memStore;
  keyrings;
  addressTypes;
  encryptor = encryptor;
  password;

  constructor() {
    super();
    this.keyringTypes = Object.values(KEYRING_SDK_TYPES);
    this.memStore = new ObservableStore({
      isUnlocked: false,
      keyringTypes: this.keyringTypes.map((krt) => krt.type),
      keyrings: [],
      preMnemonics: "",
      addressTypes: [],
    });

    this.keyrings = [];
    this.addressTypes = [];
  }

  loadStore = (initState) => {
    // this.store = new ObservableStore(initState);
  };

  boot = async (password) => {
    this.password = password;
    const encryptBooted = await this.encryptor.encrypt(password, "true");
    return encryptBooted;
    // this.store.updateState({ booted: encryptBooted });
    // this.memStore.updateState({ isUnlocked: true });
  };

  isBooted = () => {
    // return !!this.store.getState().booted;
  };

  hasVault = () => {
    // return !!this.store.getState().vault;
  };

  fullUpdate = () => {
    // this.emit("update", this.memStore.getState());
    // return this.memStore.getState();
  };

  importPrivateKey = async (privateKey, addressType) => {
    await this.persistAllKeyrings();
    const keyring = await this.addNewKeyring(
      "Simple Key Pair",
      [privateKey],
      addressType
    );
    await this.persistAllKeyrings();
    this.setUnlocked();
    this.fullUpdate();
    return keyring;
  };

  generateMnemonic = (data) => {
    return bip39.generateMnemonic(data);
  };

  generatePreMnemonic = async (data) => {
    if (!this.password) {
    }
    const mnemonic = this.generateMnemonic(data);
    const preMnemonics = await this.encryptor.encrypt(this.password, mnemonic);
    // this.memStore.updateState({ preMnemonics });

    return mnemonic;
  };

  getKeyringByType = (type) => {
    const keyring = this.keyrings.find((keyring) => keyring.type === type);

    return keyring;
  };

  removePreMnemonics = () => {
    // this.memStore.updateState({ preMnemonics: "" });
  };

  getPreMnemonics = async () => {
    // if (!this.memStore.getState().preMnemonics) {
    //   return "";
    // }

    if (!this.password) {
    }

    return await this.encryptor.decrypt(
      this.password
      // this.memStore.getState().preMnemonics
    );
  };

  createKeyringWithMnemonics = async (
    seed,
    hdPath,
    passphrase,
    addressType,
    accountCount
  ) => {
    if (!bip39.validateMnemonic(seed)) {
      return console.log("mnemonic phrase is invalid");
    }
    await this.persistAllKeyrings();
    const activeIndexes = [];
    for (let i = 0; i < accountCount; i++) {
      activeIndexes.push(i);
    }
    const keyring = await this.addNewKeyring(
      "HD Key Tree",
      {
        mnemonic: seed,
        activeIndexes,
        hdPath,
        passphrase,
      },
      addressType
    );
    const accounts = await keyring.getAccounts();
    if (!accounts[0]) {
      console.log("KeyringController - First Account not found.");
    }
    this.persistAllKeyrings();
    this.setUnlocked();
    this.fullUpdate();
    return keyring;
  };

  addKeyring = async (keyring, addressType) => {
    // console.log(keyring);
    try {
      const accounts = await keyring.getAccounts();
      await this.checkForDuplicate(keyring.type, accounts);
      this.keyrings.push(keyring);
      this.addressTypes.push(addressType);
      await this.persistAllKeyrings();
      await this._updateMemStoreKeyrings();
      await this.fullUpdate();
      return keyring;
    } catch (error) {
      console.log(error);
    }
  };

  changeAddressType = async (keyringIndex, addressType) => {
    const keyring = this.keyrings[keyringIndex];
    if (keyring.type === KEYRING_TYPE.HdKeyring) {
      const hdPath = ADDRESS_TYPES[addressType].hdPath;
      if (keyring.hdPath !== hdPath && keyring.changeHdPath) {
        keyring.changeHdPath(hdPath);
      }
    }
    this.addressTypes[keyringIndex] = addressType;
    await this.persistAllKeyrings();
    await this._updateMemStoreKeyrings();
    await this.fullUpdate();
    return keyring;
  };

  setLocked = async () => {
    this.password = null;
    // this.memStore.updateState({ isUnlocked: false });
    this.keyrings = [];
    await this._updateMemStoreKeyrings();
    this.emit("lock");
    return this.fullUpdate();
  };

  submitPassword = async (password, booted, vault) => {
    await this.verifyPassword(password, booted);
    this.password = password;
    try {
      this.keyrings = await this.unlockKeyrings(password, vault);
      return this.keyrings;
    } catch (error) {
      console.log(error);
    } finally {
      this.setUnlocked();
    }

    return this.fullUpdate();
  };

  changePassword = async (oldPassword, newPassword) => {
    await this.verifyPassword(oldPassword);
    await this.unlockKeyrings(oldPassword);
    this.password = newPassword;

    const encryptBooted = await this.encryptor.encrypt(newPassword, "true");
    // this.store.updateState({ booted: encryptBooted });

    // if (this.memStore.getState().preMnemonics) {
    //   const mnemonic = await this.encryptor.decrypt(
    //     oldPassword,
    //     this.memStore.getState().preMnemonics
    //   );
    //   const preMnemonics = await this.encryptor.encrypt(newPassword, mnemonic);
    //   this.memStore.updateState({ preMnemonics });
    // }

    await this.persistAllKeyrings();
    await this._updateMemStoreKeyrings();
    await this.fullUpdate();
  };

  verifyPassword = async (password, booted) => {
    const encryptedBooted = booted;
    if (!encryptedBooted) {
    }
    await this.encryptor.decrypt(password, encryptedBooted);
  };

  addNewKeyring = async (type, opts, addressType) => {
    const Keyring = this.getKeyringClassForType(type);
    const keyring = new Keyring(opts);
    return await this.addKeyring(keyring, addressType);
  };

  createTmpKeyring = (type, opts) => {
    const Keyring = this.getKeyringClassForType(type);
    const keyring = new Keyring(opts);
    return keyring;
  };

  checkForDuplicate = async (type, newAccountArray) => {
    const keyrings = this.getKeyringsByType(type);
    const _accounts = await Promise.all(
      keyrings.map((keyring) => keyring.getAccounts())
    );

    const accounts = _accounts.reduce((m, n) => m.concat(n), []);

    const isIncluded = newAccountArray.some((account) => {
      return accounts.find((key) => key === account);
    });

    return isIncluded
      ? console.log("Wallet existed.")
      : Promise.resolve(newAccountArray);
  };

  addNewAccount = async (selectedKeyring) => {
    const accounts = await selectedKeyring.addAccounts(1);
    accounts.forEach((hexAccount) => {
      this.emit("newAccount", hexAccount);
    });
    await this.persistAllKeyrings();
    await this._updateMemStoreKeyrings();
    await this.fullUpdate();
    return accounts;
  };

  exportAccount = async (address) => {
    const keyring = await this.getKeyringForAccount(address);
    const privkey = await keyring.exportAccount(address);
    return privkey;
  };

  removeAccount = async (address, type, brand) => {
    const keyring = await this.getKeyringForAccount(address, type);

    if (typeof keyring.removeAccount != "function") {
      console.log(
        `Keyring ${keyring.type} doesn't support account removal operations`
      );
    }
    keyring.removeAccount(address);
    this.emit("removedAccount", address);
    await this.persistAllKeyrings();
    await this._updateMemStoreKeyrings();
    await this.fullUpdate();
  };

  removeKeyring = async (keyringIndex) => {
    delete this.keyrings[keyringIndex];
    this.keyrings[keyringIndex] = new EmptyKeyring();
    await this.persistAllKeyrings();
    await this._updateMemStoreKeyrings();
    await this.fullUpdate();
  };

  signTransaction = (EXPrive, psbt, inputs) => {
    // console.log("simple key ring");
    const simpleKeyring = new HdKeyring({
      mnemonic: EXPrive,
      activeIndexes: [0],
      hdPath: "m/84'/2'/0'/0",
      passphrase: "",
    });
    // console.log(simpleKeyring);
    return simpleKeyring.signTransaction(psbt, inputs);
  };

  signMessage = async (address, data) => {
    const keyring = await this.getKeyringForAccount(address);
    const sig = await keyring.signMessage(address, data);
    return sig;
  };

  verifyMessage = async (address, data, sig) => {
    const keyring = await this.getKeyringForAccount(address);
    const result = await keyring.verifyMessage(address, data, sig);
    return result;
  };

  persistAllKeyrings = () => {
    if (!this.password || typeof this.password !== "string") {
      return Promise.reject(
        new Error("KeyringController - password is not a string")
      );
    }
    return Promise.all(
      this.keyrings.map((keyring, index) => {
        return Promise.all([keyring.type, keyring.serialize()]).then(
          (serializedKeyringArray) => {
            return {
              type: serializedKeyringArray[0],
              data: serializedKeyringArray[1],
              addressType: this.addressTypes[index],
            };
          }
        );
      })
    )
      .then((serializedKeyrings) => {
        return this.encryptor.encrypt(this.password, serializedKeyrings);
      })
      .then((encryptedString) => {
        // this.store.updateState({ vault: encryptedString });
        return true;
      });
  };

  unlockKeyrings = async (password, _vault) => {
    const encryptedVault = _vault;
    if (!encryptedVault) {
      console.log("no vault");
    }

    await this.clearKeyrings();
    const vault = await this.encryptor.decrypt(password, encryptedVault);
    const arr = Array.from(vault);
    for (let i = 0; i < arr.length; i++) {
      const { keyring, addressType } = await this._restoreKeyring(vault);
      this.keyrings.push(keyring);
      this.addressTypes.push(addressType);
    }
    // await this._updateMemStoreKeyrings();
    return this.keyrings;
  };

  restoreKeyring = async (serialized) => {
    const { keyring } = await this._restoreKeyring(serialized);
    await this._updateMemStoreKeyrings();
    return keyring;
  };

  _restoreKeyring = async (serialized) => {
    const { type, data, addressType } = serialized;
    // if (type === KEYRING_TYPE.Empty) {
    //   const keyring = new EmptyKeyring();
    //   return {
    //     keyring,
    //     addressType: addressType === undefined ? 1 : addressType,
    //   };
    // }
    const Keyring = this.getKeyringClassForType(type);
    const keyring = new Keyring();
    await keyring.deserialize(data);
    await keyring.getAccounts();
    return {
      keyring,
      addressType: addressType === undefined ? 1 : addressType,
    };
  };

  getKeyringClassForType = (type) => {
    const keyringTypes = Object.values(KEYRING_SDK_TYPES);
    return keyringTypes.find((kr) => kr.type === type);
  };

  getKeyringsByType = (type) => {
    return this.keyrings.filter((keyring) => keyring.type === type);
  };

  getAccounts = async () => {
    const keyrings = this.keyrings || [];
    let addrs = [];
    for (let i = 0; i < keyrings.length; i++) {
      const keyring = keyrings[i];
      const accounts = await keyring.getAccounts();
      addrs = addrs.concat(accounts);
    }
    return addrs;
  };

  displayedKeyringToWalletKeyring = (displayedKeyring, index) => {
    const addressType = displayedKeyring.addressType;
    const key = "keyring_" + index;
    const type = displayedKeyring.type;
    const accounts = [];
    for (let j = 0; j < displayedKeyring.accounts.length; j++) {
      const { pubkey } = displayedKeyring.accounts[j];
      const address = publicKeyToAddress(pubkey, addressType);
      const accountKey = key + "#" + j;
      accounts.push({
        type,
        pubkey,
        address,
        index: j,
        key: accountKey,
      });
    }
    const hdPath = type === displayedKeyring.keyring.hdPath;

    const keyring = {
      index,
      key,
      type,
      addressType,
      accounts,
      hdPath,
    };
    return keyring;
  };

  getKeyringForAccount = async (
    address,
    type,
    start,
    end,
    includeWatchKeyring = true
  ) => {
    log.debug(`KeyringController - getKeyringForAccount: ${address}`);
    const keyrings = type
      ? this.keyrings.filter((keyring) => keyring.type === type)
      : this.keyrings;
    for (let i = 0; i < keyrings.length; i++) {
      const keyring = keyrings[i];
      const accounts = await keyring.getAccounts();
      if (accounts.includes(address)) {
        return keyring;
      }
    }
    console.log("No keyring found for the requested account.");
  };

  displayForKeyring = async (keyring, addressType, index) => {
    const accounts = await keyring.getAccounts();
    const all_accounts = [];
    for (let i = 0; i < accounts.length; i++) {
      const pubkey = accounts[i];
      all_accounts.push({
        pubkey,
        brandName: keyring.type,
      });
    }
    return {
      type: keyring.type,
      accounts: all_accounts,
      keyring: new DisplayKeyring(keyring),
      addressType,
      index,
    };
  };

  getAllDisplayedKeyrings = () => {
    return Promise.all(
      this.keyrings.map((keyring, index) =>
        this.displayForKeyring(keyring, this.addressTypes[index], index)
      )
    );
  };

  getAllVisibleAccountsArray = async () => {
    const typedAccounts = await this.getAllDisplayedKeyrings();
    const result = [];
    typedAccounts.forEach((accountGroup) => {
      result.push(
        ...accountGroup.accounts.map((account) => ({
          pubkey: account.pubkey,
          brandName: account.brandName,
          type: accountGroup.type,
        }))
      );
    });

    return result;
  };
  getAllPubkeys = async () => {
    const keyrings = await this.getAllDisplayedKeyrings();
    const result = [];
    keyrings.forEach((accountGroup) => {
      result.push(
        ...accountGroup.accounts.map((account) => ({
          pubkey: account.pubkey,
          brandName: account.brandName,
          type: accountGroup.type,
        }))
      );
    });

    return result;
  };

  hasPubkey = async (pubkey) => {
    const addresses = await this.getAllPubkeys();
    return !!addresses.find((item) => item.pubkey === pubkey);
  };

  /**
   * Clear Keyrings
   *
   * Deallocates all currently managed keyrings and accounts.
   * Used before initializing a new vault.
   */
  /* eslint-disable require-await */
  clearKeyrings = async () => {
    // clear keyrings from memory
    this.keyrings = [];
    // this.memStore.updateState({
    //   keyrings: [],
    // });
  };

  /**
   * Update Memstore Keyrings
   *
   * Updates the in-memory keyrings, without persisting.
   */
  _updateMemStoreKeyrings = async () => {
    const keyrings = await Promise.all(
      this.keyrings.map((keyring, index) =>
        this.displayForKeyring(keyring, this.addressTypes[index], index)
      )
    );
    // return this.memStore.updateState({ keyrings });
  };

  /**
   * Unlock Keyrings
   *
   * Unlocks the keyrings.
   *
   * @emits KeyringController#unlock
   */
  setUnlocked = () => {
    this.memStore.updateState({ isUnlocked: true });
    this.emit("unlock");
    return;
  };
}

export default new KeyringService();
