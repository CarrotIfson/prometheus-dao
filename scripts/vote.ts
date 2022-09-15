
import * as fs from "fs";
import { networkInterfaces } from "os";
import { DEVELOPMENT_CHAINS, proposalsFile, VOTING_PERIOD } from "../helper-hardhat-config"; 
import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";

const index = 0;

async function main(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
    const proposalId = proposals[network.config.chainId!][proposalIndex];
    // 0 = against, 1 = for, 2 = abstain
    const voteWay = 1;
    const governor = await ethers.getContract("Numiscratia");
    const reason = "Alright, I'll vote!";
    const voteTxResponse = await governor.castVoteWithReason(
        proposalId, 
        voteWay,
        reason
    );
    await voteTxResponse.wait();

    if (DEVELOPMENT_CHAINS.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1);
    }
    console.log("Vote or die!");
    console.log("_".repeat(90));

}

main(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });