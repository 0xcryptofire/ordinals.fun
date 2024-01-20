import KeyringService from "./keyring";

class DisplayKeyring {
  accounts = [];
  type = "";
  hdPath = "";

  constructor(keyring) {
    this.accounts = keyring.accounts || [];
    this.type = keyring.type;
    this.hdPath = keyring.hdPath;
  }

  unlock = async () => {
    const keyring = await KeyringService.getKeyringForAccount(
      this.accounts[0],
      this.type
    );
    if (keyring.unlock) await keyring.unlock();
  };

  getFirstPage = async () => {
    const keyring = await KeyringService.getKeyringForAccount(
      this.accounts[0],
      this.type
    );
    if (keyring.getFirstPage) {
      return await keyring.getFirstPage();
    } else {
      return [];
    }
  };

  getNextPage = async () => {
    const keyring = await KeyringService.getKeyringForAccount(
      this.accounts[0],
      this.type
    );
    if (keyring.getNextPage) {
      return await keyring.getNextPage();
    } else {
      return [];
    }
  };

  getAccounts = async () => {
    const keyring = await KeyringService.getKeyringForAccount(
      this.accounts[0],
      this.type
    );
    return await keyring.getAccounts();
  };

  activeAccounts = async (indexes) => {
    const keyring = await KeyringService.getKeyringForAccount(
      this.accounts[0],
      this.type
    );
    if (keyring.activeAccounts) {
      return keyring.activeAccounts(indexes);
    } else {
      return [];
    }
  };
}

export { DisplayKeyring };
