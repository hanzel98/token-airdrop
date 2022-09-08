require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");

const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);

const path = require("path");
const envPath = path.join(__dirname, "./.env");
require("dotenv").config({ path: envPath });
require("hardhat-gas-reporter");
require("solidity-coverage");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_RINKEBY}`,
      accounts:
        process.env.PRIVATE_KEY &&
        process.env.OPERATOR_PRIVATE_KEY !== undefined
          ? [process.env.PRIVATE_KEY, process.env.OPERATOR_PRIVATE_KEY]
          : [],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 50000,
  },
  gasReporter: {
    enabled: true,
  },
};
