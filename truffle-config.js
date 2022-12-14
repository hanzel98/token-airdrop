/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const infuraKey = "cf016515a2f04bb6b8cc8b5feac1caf1";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();
// const mnemonic = "cheap inch cry pulse tornado spell embrace write suspect gorilla wish page".toString().trim()

// const path = require('path');
// const envPath = path.join(__dirname, './.env');
// require('dotenv').config({ path: envPath });

require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "5777", // Any network (default: none)
      gas: 6021975, // Gas sent with each transaction (default: ~6700000)
    },
    mainfork: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "999",
    },
    matic: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          `https://matic-mumbai.chainstacklabs.com`
        ),
      network_id: 80001,
      // confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 15000000,
      gasPrice: 600000000000,
    },

    bsctestnet: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          `https://data-seed-prebsc-1-s2.binance.org:8545/`
        ),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      production: true,
      skipDryRun: true, // Ropsten's id
      gas: 15000000, // Ropsten has a lower block limit than mainnet   // # of confs to wait between deployments. (default: 0)
      // timeoutBlocks: 200,
      gasPrice: 10000000000,
      networkCheckTimeout: 10000000, // # of blocks before a deployment times out  (minimum/default: 50)
      // skipDryRun: true,
      // websockets: true
    },

    mainnet: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          `https://eth-mainnet.g.alchemy.com/v2/hrdU8O2tmO_lDTCGAdaY1BU-jmugcE1m`
        ),
      network_id: 1,
      // gasPrice: 100000000000,
      gasPrice: 50000000000,
      gas: 2700000,
      skipDryRun: true,
      production: true,
      networkCheckTimeout: 10000000,
    },

    bsc: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONICETH,
          `https://bsc-dataseed1.ninicoin.io/`
        ),
      network_id: 56,
      confirmations: 3,
      timeoutBlocks: 200,
      gasPrice: 10000000000,
      skipDryRun: true,
      production: true,
      networkCheckTimeout: 10000000,
    },

    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          `https://eth-rinkeby.alchemyapi.io/v2/yrboZFDgv7uD9E7hkSy-aUN284tFliZr`
        ),
      network_id: 4, // Ropsten's id
      gas: 15000000, // Ropsten has a lower block limit than mainnet   // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,
      gasPrice: 2000000000,
      networkCheckTimeout: 1000000, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,
      websockets: true,
    },

    kovan: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          `https://eth-kovan.alchemyapi.io/v2/yrboZFDgv7uD9E7hkSy-aUN284tFliZr`
        ),
      network_id: 42, // Ropsten's id
      gas: 15000000, // Ropsten has a lower block limit than mainnet   // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,
      gasPrice: 10000000000,
      networkCheckTimeout: 1000000, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,
      websockets: true,
    },

    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },

    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    //   provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/` + infuraKey),
    //   network_id: 3,       // Ropsten's id
    //   gas: 8000000,        // Ropsten has a lower block limit than mainnet
    //   confirmations: 0,    // # of confs to wait between deployments. (default: 0)
    //   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },

    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.10", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
        // evmVersion: "byzantium"
      },
    },
  },
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    bscscan: process.env.BINANCE_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    polygonscan: process.env.POLYGON_API_KEY,
  },
};
