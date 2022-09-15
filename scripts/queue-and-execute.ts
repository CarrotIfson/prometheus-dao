import { DEVELOPMENT_CHAINS, FUNC, MIN_DELAY, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION } from "../helper-hardhat-config";
// @ts-ignore
import { ethers, network } from "hardhat";
import { moveTime } from "../utils/move-time";
import { moveBlocks } from "../utils/move-blocks";


export async function queueAndExecute() {
    const args = [NEW_STORE_VALUE];
    const vault = await ethers.getContract("Vault");
    const governor = await ethers.getContract("Numiscratia");
    const encodedFunctionCall = vault.interface.encodeFunctionData(FUNC, args);
    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
    );
    console.log("Queueing...");
    const queueTx = await governor.queue(
        [vault.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );

    await queueTx.wait(1);

    if (DEVELOPMENT_CHAINS.includes(network.name)) {
        await moveTime(MIN_DELAY + 1);
        await moveBlocks(1);
    }


    let vaultNewValue = await vault.retrieve();
    console.log(`Old vault value: ${vaultNewValue}`);
    console.log("Executing...");
    const executeTx = await governor.execute(
        [vault.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );

    await executeTx.wait(1);

    vaultNewValue = await vault.retrieve();
    console.log(`New vault value: ${vaultNewValue}`);

};

queueAndExecute()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });