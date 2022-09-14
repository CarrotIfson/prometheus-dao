import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";

import {HardhatUserConfig} from "hardhat/config";

/** @type import('hardhat/config').HardhatUserConfig */

//module.exports = {
//  solidity: "0.8.9",
//};


const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    //hardhat is used when running tests
    hardhat: {
      chainId: 31337
    }, 
    //localhost is used when running hardhat node
    localhost: {
      chainId: 31337,
      gas: 2000000
    }
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  }
}

export default config;