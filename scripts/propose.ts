// @ts-ignore 
import { ethers, network } from "hardhat";
import { NEW_STORE_VALUE, FUNC, PROPOSAL_DESCRIPTION, DEVELOPMENT_CHAINS, VOTING_DELAY, proposalsFile } from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import * as fs from "fs";

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
    if(DEVELOPMENT_CHAINS.includes(network.name)) {
        //gotta go fast
        await moveBlocks(VOTING_DELAY + 1);
    };
    
    const proposeReceipt = await proposeTx.wait(1)
    const proposalId = proposeReceipt.events[0].args.proposalId
    console.log(`Proposed with proposal ID:\n  ${proposalId}`)

    const proposalState = await governor.state(proposalId)
    const proposalSnapShot = await governor.proposalSnapshot(proposalId)
    const proposalDeadline = await governor.proposalDeadline(proposalId)
    // save the proposalId
    storeProposalId(proposalId);
  
    // The state of the proposal. 1 is not passed. 0 is passed.
    console.log(`Current Proposal State: ${proposalState}`)
    // What block # the proposal was snapshot
    console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
    // The block number the proposal voting expires
    console.log(`Current Proposal Deadline: ${proposalDeadline}`)    
    console.log("_".repeat(90))

}


function storeProposalId(proposalId: any) {
    const chainId = network.config.chainId!.toString(); 
    let proposals:any;
    if (fs.existsSync(proposalsFile)) {
        proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
    } else {
        proposals = { };
        proposals[chainId] = [];
    }   
    proposals[chainId].push(proposalId.toString());
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8");
  }
  


propose(FUNC, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
