import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { stakingContractABI } from "./stakingContractABI";

const nftContractAddress = "0x647F2622ABB57D18E19E717cFD3fc9754B914C82";
const rewardTokenContractAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const stakingContractAddress = "0x729EfeBf0f5F50751F6e7F9C9FD358205F7ebeDa";

export const NFT_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: nftContractAddress,
});


export const REWARD_TOKEN_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: rewardTokenContractAddress,
});

export const STAKING_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: stakingContractAddress,
    abi: stakingContractABI,
});