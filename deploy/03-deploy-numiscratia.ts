import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types" 
import { 
  QUORUM_PERCENTAGE,
  VOTING_PERIOD,
  VOTING_DELAY,
} from "../helper-hardhat-config"

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const governanceToken = await get("Voice")
  const timeLock = await get("ChronosGate")

  log("Deploying GovernorContract and waiting for confirmations...")
  const numiscratia = await deploy("Numiscratia", {
    from: deployer,
    args: [
      governanceToken.address,
      timeLock.address,
      QUORUM_PERCENTAGE,
      VOTING_PERIOD,
      VOTING_DELAY,
    ],
    log: true
    // we need to wait if on a live network so we can verify properly
    //waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`Numiscratia at ${numiscratia.address}`) 
  log("_".repeat(90))
   
}

export default deployGovernorContract
deployGovernorContract.tags = ["all", "governor"]