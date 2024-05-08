'use client';

import { useEffect, useState } from "react";
import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { claimTo, getNFTs, ownerOf, totalSupply } from "thirdweb/extensions/erc721";
import { NFTCard } from "./NFTCard";
import { StakedNFTCard } from "./StakedNFTCard";
import { StakeRewards } from "./StakeRewards";
import { STAKING_CONTRACT, NFT_CONTRACT } from "../utils/contracts";
import { client } from "@/app/client";
import { chain } from "@/app/chain";
import { NFT } from "thirdweb";

export const Staking = () => {
    const account = useActiveAccount();
    const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
    
    const getOwnedNFTs = async () => {
        try {
            const totalNFTSupply = await totalSupply({
                contract: NFT_CONTRACT,
            });
            const nfts = await getNFTs({
                contract: NFT_CONTRACT,
                start: 1,
                count: parseInt(totalNFTSupply.toString()),
            });
            
            // const userOwnedNFTs = nfts.filter(async nft => {
            //     const owner = await ownerOf({
            //         contract: NFT_CONTRACT,
            //         tokenId: nft.id,
            //     });
            //     return owner === account?.address;
            // });
            
            // setOwnedNFTs(userOwnedNFTs);
            const userOwnedNFTs = await Promise.all(
                nfts.map(async (nft) => {
                  const owner = await ownerOf({
                    contract: NFT_CONTRACT,
                    tokenId: nft.id,
                  });
                  return { nft, owner };
                })
              );
        
        const filteredNFTs = userOwnedNFTs
                .filter(({ owner }) => owner === account?.address)
                .map(({ nft }) => nft);
        
              setOwnedNFTs(filteredNFTs);
        } catch (error) {
            console.error("Error fetching owned NFTs:", error);
        }
    };
    
    useEffect(() => {
        if (account) {
            getOwnedNFTs();
        }
    }, [account]);

    const {
        data: stakedInfo,
        refetch: refetchStakedInfo,
    } = useReadContract({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        params: [account?.address || ""],
    });

    if(account) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#151515",
                borderRadius: "8px",
                width: "500px",
                padding: "20px",
            }}>
                <ConnectButton
                    client={client}
                    chain={chain}
                />
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: "20px 0",
                    width: "100%"
                }}>
                    <h2 style={{ marginRight: "20px"}}></h2>
                </div>
                <hr style={{
                    width: "100%",
                    border: "1px solid #333"
                }}/>
                <div style={{ 
                    margin: "20px 0",
                    width: "100%"
                }}>
                    <h2 style={{ color: "white"}}>All NFTs</h2>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "500px"}}>
                        {ownedNFTs && ownedNFTs.length > 0 ? (
                            ownedNFTs.map((nft, index) => (
                                <NFTCard
                                    key={index}
                                    nft={nft}
                                    refetch={getOwnedNFTs}
                                    refecthStakedInfo={refetchStakedInfo}
                                />
                            ))
                        ) : (
                            <p>You own 0 NFTs</p>
                        )}
                    </div>
                </div>
                <hr style={{
                    width: "100%",
                    border: "1px solid #333"
                }}/>
                <div style={{ width: "100%", margin: "20px 0", color: "white" }}>
                    <h2>Staked NFTs</h2>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "500px"}}>
                        {stakedInfo && stakedInfo[0].length > 0 ? (
                            stakedInfo[0].map((nft: any, index: number) => (
                                <StakedNFTCard
                                    key={index}
                                    tokenId={nft}
                                    refetchStakedInfo={refetchStakedInfo}
                                    refetchOwnedNFTs={getOwnedNFTs}
                                />
                            ))
                        ) : (
                            <p style={{ margin: "20px" }}>No NFTs staked</p>
                        )}
                    </div>
                </div>
                <hr style={{
                    width: "100%",
                    border: "1px solid #333"
                }}/>
                <StakeRewards />  
            </div>
        );
    }
};