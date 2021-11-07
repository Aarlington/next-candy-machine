/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useEffect, useState } from "react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useCandyMachine from "../hooks/useCandyMachine";
import useWalletBalance from "../hooks/useWalletBalance";
import { useWallet } from "@solana/wallet-adapter-react";

import { Toaster } from "react-hot-toast";
import Countdown from "react-countdown";
import useWalletNfts from "../hooks/useWalletNFTs";
import AnNFT from "../components/AnNFT/AnNFT";

export default function Home() {
  const [balance] = useWalletBalance();
  const {
    isSoldOut,
    mintStartDate,
    isMinting,
    startMint,
    startMintMultiple,
    nftsData,
  } = useCandyMachine();

  const [isLoading, nfts] = useWalletNfts();

  const { connected } = useWallet();

  const [isMintLive, setIsMintLive] = useState(false);

  useEffect(() => {
    if (new Date(mintStartDate).getTime() < Date.now()) {
      setIsMintLive(true);
    }
  }, []);

  const MintMany = () => {
    const [mintCount, setMintCount] = useState(2);

    return (
      <>
        <button
          onClick={() => startMintMultiple(mintCount)}
          disabled={isMinting}
          className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600"
        >
          {isMinting ? "loading" : `mint ${mintCount}`}
        </button>

        <input
          disabled={isMinting}
          type="number"
          min={2}
          max={10}
          className="mb-3 mt-5 px-4 py-2 font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-50 via-blue-560 to-purple-700"
          value={mintCount}
          onChange={(e) => setMintCount((e.target as any).value)}
        />
        <p className="mx-auto mt-2 bg-clip-text text-white">max 4;</p>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>next-candy-machine</title>
        <meta
          name="The Hypno Wolf"
          content="The Transmission Portal... Smells like K9."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center min-h-screen mx-3 bg-clip-text">
        <Toaster />
        <div className="flex items-center justify-between w-full mt-3 background bg-clip-text">
          <h1 className="text-2xl font-bold bg-clip-text"> </h1>
          
          <div className="flex items-center bg-clip-text">
            {connected && (
              <div className="flex items-end mr-2 bg-clip-text">
                <p className="text-xs text-gray-400 bg-clip-text">balance</p>
                <p className="mx-1 font-bold leading-none bg-clip-text text-white ">
                  {balance.toFixed(2)}
                </p>
                <p
                  className="leading-none text-transparent bg-clip-text"
                >
                </p>
              </div>
            )}
            <WalletMultiButton />
          </div>
        </div>
        {connected && (
          <p className="mb-3 mt-16 text-sm bg-clip-text text-white">
            <span className="mb-3 ext-3xl font-white background bg-clip-text text-white">Transmittable/Transmitted/Total:</span>{" "}
            {nftsData.itemsRemaining}/{nftsData.itemsRedeemed}/
            {nftsData.itemsAvailable}
          </p>
        )}
        <div className="flex items-start justify-center w-13/17 my-10 background transparent text-white ">
          {connected ? (
            <>
              {new Date(mintStartDate).getTime() < Date.now() ? (
                <>
                  {isSoldOut ? (
                    <p>SOLD OUT</p>
                  ) : (
                    <>
                      <div className="flex flex-col w-1/2">
                        <h1 className="mb-5 ext-3xl font-bold text-white">  </h1>
                        <button
                          onClick={startMint}
                          disabled={isMinting}
                          className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600"
                        >
                          {isMinting ? "loading" : "mint 1"}
                        </button>
                      </div>
                      <div className="flex flex-col w-1/2">
                        <h1 className="mb-5 ext-3xl font-bold text-white background transparent">  </h1>
                        <MintMany />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Countdown
                  date={mintStartDate}
                  onMount={({ completed }) => completed && setIsMintLive(true)}
                  onComplete={() => setIsMintLive(true)}
                />
              )}
            </>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </>
  );
}
