import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"   
// @ts-ignore
import { ethers } from "hardhat";

const deployVault: DeployFunction = async function (
    hre = HardhatRuntimeEnvironment
) {
    // @ts-ignore
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying Vault...");

    const vault = await deploy("Vault", {
        from: deployer,
        args: [],
        log: true
    });

    log(`Vault at ${vault.address}`);
    const timeLock = await ethers.getContract("ChronosGate");
    const vaultContract = await ethers.getContractAt("Vault", vault.address);

    const transferOwnerTx = await vaultContract.transferOwnership(
        timeLock.address
    );
    transferOwnerTx.wait(1);
    log(`Ownership transfered to ChronosGate`);
    log("_".repeat(90));

};



export default deployVault;