import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = "0xf628e67e916160b55Dda4dAd7D3ce24fd359f8B8";

function App() {
 
	const [account, setAccount] = useState(null);
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  // state for whether app is minting or not.
	const [isMinting, setIsMinting] = useState(false);


  useEffect(() => {
		if (window.ethereum) {
			setIsWalletInstalled(true);
		}
	}, []);

  useEffect(() => {
		function initNFTContract() {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress,contractABI.abi,signer));
		}
		initNFTContract();
	}, [account]);


  async function connectWallet() {
		window.ethereum
			.request({
				method: "eth_requestAccounts",
			})
			.then((accounts) => {
				setAccount(accounts[0]);
			})
			.catch((error) => {
				alert("Something went wrong");
			});
	}
 

    const data = [
        {
            url: "/assets/images/Bitcoin.jpg",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmWufnxA49keGjXhoDNeZqxxiSrLVVEwvxSKXhjUN7F6Hh/bitcoin.txt')",
        },
        {
          url: "/assets/images/Cat.png",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmWufnxA49keGjXhoDNeZqxxiSrLVVEwvxSKXhjUN7F6Hh/cat.txt')",
        },
        {
          url: "/assets/images/Ethereum.png",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmWufnxA49keGjXhoDNeZqxxiSrLVVEwvxSKXhjUN7F6Hh/Ethereum.txt')",
        },
         {
          url: "/assets/images/Polygon.jpg",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmWufnxA49keGjXhoDNeZqxxiSrLVVEwvxSKXhjUN7F6Hh/polygon.txt')",
        },
        {
          url: "/assets/images/Puppy.png",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmWufnxA49keGjXhoDNeZqxxiSrLVVEwvxSKXhjUN7F6Hh/puppy.txt')",
        },
    ];

    async function withdrawMoney(){
        try {
 
            const response = await NFTContract.withdrawMoney();
            console.log("Received: ", response);
          } catch (err) {
              alert(err.message);
          }
          
    }

    async function handleMint(tokenURI) {
        setIsMinting(true);
            try {
              const options = {value: ethers.utils.parseEther("0.01")};
              const response = await NFTContract.mintNFT(tokenURI, options);
              console.log("Received: ", response);
            } catch (err) {
             
                alert(err.message);
            }
            finally {
              setIsMinting(false);
            }
    }

    if (account === null) {
      return (
        <>
         <div className="container">
           <br/>
          <h1 className="h1"> NFT Marketplace</h1>
          <p>Buy an NFT from our marketplace.</p>
  
          {isWalletInstalled ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <p>Install Metamask wallet</p>
          )}
          </div>
          </>
      );
    }

    return (
        <>
            <div className="container">
            <br/>
            <h1 className="h1"> NFT Marketplace</h1>
          
                {data.map((item, index) => (
                    <div className="imgDiv">
                        <img
                            src={item.url}
                            key={index}
                            alt="images"
                            width={150}
                            height={150}
                        />
                        <button isLoading={isMinting}
                            onClick={() => {
                                eval(item.param);
                            }}
                        >
                            Mint - 0.01 eth
                        </button>
                    </div>
                ))}
                
                <div>
                <br/>
                 <button 
                            onClick={() => {
                                withdrawMoney();
                            }}
                        >
                            Withdraw Money from Contract
                 </button>
                 </div>
          
        </div>

        </>
    );
}

export default App;
