Simple on-chain dao.
Used hardhat-deploy package

/**** SETUP ***********************************************************************/
        yarn add --dev hardhat
        yarn hardhat 
                // empty hardhat
        yarn add --dev @openzeppelin/contracts
        yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
        yarn add --dev hardhat-deploy
        yarn add --dev typescript typechain ts-node @typechain/ethers-v5 @typechain/hardhat @types/chai @types/node 
        yarn add fs


/*** RUN **************************************************************************/
        yarn hardhat run scripts/propose.ts --network localhost 