import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

import { ethers } from "hardhat"

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts() 
  log("Deploying Voice and waiting for confirmations...")
  const governanceToken = await deploy("Voice", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    //waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`Voice at ${governanceToken.address}`)
    log(`Delegating to ${deployer}`)
  await delegate(governanceToken.address, deployer) 
  log("Delegated!")
  log("_".repeat(90))
}

const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
  const governanceToken = await ethers.getContractAt("Voice", governanceTokenAddress)
  const transactionResponse = await governanceToken.delegate(delegatedAccount)
  await transactionResponse.wait(1)
  console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}

export default deployGovernanceToken 