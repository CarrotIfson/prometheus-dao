// @ts-ignore 
import { ethers, network } from "hardhat";
import { NEW_STORE_VALUE, FUNC, PROPOSAL_DESCRIPTION, DEVELOPMENT_CHAINS, VOTING_DELAY } from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";

export async function propose(functionToCall: string, args: any[], proposalDescription: string) {
    const governor = await ethers.getContract("Numiscratia");
    const vault = await ethers.getContract("Vault");

    const encondedFunctionCall = vault.interface.encodeFunctionData(
        functionToCall,
        args
    );

    console.log(`Proposing ${functionToCall} on ${vault.address} with ${args}`);
    console.log(`Proposal Description: \n ${proposalDescription}`);
    const proposeTx = await governor.propose(
        [vault.address], ///targets
        [0],            //values
        [encondedFunctionCall], // funcs to call
        proposalDescription
    );
    const proposeReceipt = proposeTx.wait(1);
    if(DEVELOPMENT_CHAINS.includes(network.name)) {
        //gotta go fast
        await moveBlocks(VOTING_DELAY + 1);
    };

    const proposalId = proposeReceipt.event[0].args.proposalId;
    
}

propose(FUNC, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
