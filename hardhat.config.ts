import { HardhatUserConfig } from "hardhat/config";

import "@nomicfoundation/hardhat-toolbox";
import "@matterlabs/hardhat-zksync";
// import "@matterlabs/hardhat-zksync-node";
// import "@matterlabs/hardhat-zksync-deploy";
// import "@matterlabs/hardhat-zksync-solc";
// import "@matterlabs/hardhat-zksync-verify";

// Import dotenv to read .env file
import * as dotenv from "dotenv";

dotenv.config();

const cronos_zkevm_testnet_apikey: string = <string>(
  process.env.CRONOS_ZKEVM_DEVELOPER_PORTAL_TESTNET_API_KEY
);
const cronos_zkevm_mainnet_apikey: string = <string>(
  process.env.CRONOS_ZKEVM_DEVELOPER_PORTAL_MAINNET_API_KEY
);

const config: HardhatUserConfig = {
  defaultNetwork: "cronosZkEvmTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    cronosZkEvmTestnet: {
      url: "https://testnet.zkevm.cronos.org",
      ethNetwork: process.env.ETHEREUM_SEPOLIA_URL,
      zksync: true,
      verifyURL:
        "https://explorer-api.testnet.zkevm.cronos.org/api/v1/contract/verify/hardhat?apikey=" +
        cronos_zkevm_testnet_apikey,
    },
    cronosZkEvmMainnet: {
      url: process.env.CRONOS_ZKEVM_MAINNET_URL,
      ethNetwork: process.env.ETHEREUM_MAINNET_URL,
      zksync: true,
      verifyURL:
        "https://explorer-api.zkevm.cronos.org/api/v1/contract/verify/hardhat?apikey=" +
        cronos_zkevm_mainnet_apikey,
    },
    // cronosZkEvmMainnetWithApiKey: {
    //   url: process.env.CRONOS_ZKEVM_MAINNET_URL_WITH_API_KEY,
    //   ethNetwork: process.env.ETHEREUM_MAINNET_URL,
    //   zksync: true,
    //   verifyURL:
    //     "https://explorer-api.zkevm.cronos.org/api/v1/contract/verify/hardhat?apikey=" +
    //     cronos_zkevm_mainnet_apikey,
    //   httpHeaders: {
    //     "X-API-KEY": process.env.X_API_KEY!,
    //   },
    // },
    zkSyncSepoliaTestnet: {
      // If you want to try your deployment on ZKsync Era testnet for reference
      url: process.env.CRONOS_ZKEVM_TESTNET_URL,
      ethNetwork: "sepolia", // or a Sepolia RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
      verifyURL:
        "https://explorer.sepolia.era.zksync.dev/contract_verification",
    },
    zkSyncMainnet: {
      // If you want to try your deployment on ZKsync Era mainnet for reference
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet", // or a Ethereum RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
      verifyURL:
        "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
    },
    anvilZKsync: {
      url: "http://127.0.0.1:8011",
      ethNetwork: "localhost", // anvil doesn't support eth node; removing this line will cause an error
      zksync: true,
      accounts: process.env.WALLET_PRIVATE_KEY
        ? [process.env.WALLET_PRIVATE_KEY]
        : [],
    },
  },
  zksolc: {
    // For Cronos zkEVM, currently only supports zksolc version up to 1.5.2 for contract verification
    version: "1.5.3",
    settings: {
      // find all available options in the official documentation
      // https://era.zksync.io/docs/tools/hardhat/hardhat-zksync-solc.html#configuration
      metadata: {
        // Set bytecodeHash to "none" so that the bytecode is the same at every compilation of a given code base
        bytecodeHash: "none",
      },
    },
  },
  solidity: {
    // For Cronos zkEVM, currently only supports solidity version up to 0.8.26 for contract verification
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
};

export default config;
