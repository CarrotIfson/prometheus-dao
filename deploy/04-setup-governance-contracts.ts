import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"   
// @ts-ignore
import { ethers } from "hardhat";
import { 
  DEAD_ADDRESS
} from "../helper-hardhat-config"

const setupContracts: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    // @ts-ignore
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    const timeLock = await ethers.getContract("ChronosGate", deployer);
    const governor = await ethers.getContract("Numiscratia", deployer);

    log("Setting up roles...")
    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
    await proposerTx.wait(1);

    const executorTx = await timeLock.grantRole(executorRole, DEAD_ADDRESS);
    await executorTx.wait(1);

    const revokeTx = await timeLock.revokeRole(adminRole, deployer);
    await revokeTx.wait(1);
    log("_".repeat(90))
};

export default setupContracts;