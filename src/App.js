import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

function App() {
  const [haveMetaMask, setHaveMetaMask] = useState(true);
  const [connected, setConnected] = useState(false);
  const [accountAdd, setAccountAdd] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.getDefaultProvider();

  const { ethereum } = window;

  useEffect(() => {
    checkMetaMask();
  }, []);

  const checkMetaMask = async () => {
    if (!ethereum) {
      setHaveMetaMask(false);
    }
    setHaveMetaMask(true);
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        setHaveMetaMask(false);
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance);

      setAccountAdd(accounts[0]);
      setAccountBalance(bal);
      setConnected(true);
    } catch (error) {
      setConnected(false);
    }
  };
  const changeNetwork = async () => {
    const chainId = 137; // Polygon Mainnet

    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x89",
          rpcUrls: ["https://rpc-mainnet.matic.network/"],
          chainName: "Matic Mainnet",
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
          },
          blockExplorerUrls: ["https://polygonscan.com/"],
        },
      ],
    });
  };

  const addToken = async () => {
    const tokenAddress = "0xd00981105e61274c8a5cd5a88fe7e037d935b513";
    const tokenSymbol = "TUT";
    const tokenDecimals = 18;
    const tokenImage = "http://placekitten.com/200/300";

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{`App have MetaMask: ${haveMetaMask}`}</p>
        {accountAdd && <p>{`Account: ${accountAdd}`}</p>}
        {accountBalance && <p>{`Balance: ${accountBalance}`}</p>}
        {!connected && (
          <button className="btn" onClick={connectWallet}>
            Connect
          </button>
        )}
        {connected && (
          <button className="btn" onClick={changeNetwork}>
            Switch
          </button>
        )}
        <button onClick={addToken}> Add Token</button>
      </header>
    </div>
  );
}

export default App;
