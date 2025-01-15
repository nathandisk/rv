// Replace with your actual contract address and ABI
const contractAddress: string = "0x0B8E09de2E66Ba0Ba07AcFdcE48fD992d0Bc83b3";
const contractABI: any[] = [
    // Replace with the actual ABI of your ERC20 token contract
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "success", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let web3: Web3;
let contract: any;
let userAccount: string | null = null;

// Initialize Web3 and the contract
async function init(): Promise<void> {
    try {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Web3 initialized.");
        } else {
            alert("MetaMask is not installed. Please install it to continue.");
        }
    } catch (error) {
        console.error("Error initializing Web3:", error);
    }
}

// Connect MetaMask wallet
document.getElementById("connectWallet")?.addEventListener("click", async () => {
    try {
        if (!window.ethereum) {
            alert("MetaMask is not installed.");
            return;
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        userAccount = accounts[0];
        document.getElementById("walletAddress")!.innerText = `Connected: ${userAccount}`;
        console.log(`Connected to wallet: ${userAccount}`);
    } catch (error) {
        console.error("Error connecting wallet:", error);
    }
});

// Buy tokens
document.getElementById("buyTokens")?.addEventListener("click", async () => {
    const ethAmount = (document.getElementById("ethAmount") as HTMLInputElement).value;
    if (!ethAmount || isNaN(Number(ethAmount)) || parseFloat(ethAmount) <= 0) {
        alert("Enter a valid ETH amount.");
        return;
    }

    try {
        if (!userAccount) {
            alert("Please connect your MetaMask wallet first.");
            return;
        }

        await web3.eth.sendTransaction({
            from: userAccount,
            to: contractAddress,
            value: web3.utils.toWei(ethAmount, "ether"),
        });
        document.getElementById("buyStatus")!.innerText = "Tokens purchased successfully!";
    } catch (error) {
        console.error("Error buying tokens:", error);
        document.getElementById("buyStatus")!.innerText = "Error purchasing tokens.";
    }
});

// Swap tokens
document.getElementById("swapTokens")?.addEventListener("click", async () => {
    const swapAmount = (document.getElementById("swapAmount") as HTMLInputElement).value;
    if (!swapAmount || isNaN(Number(swapAmount)) || parseFloat(swapAmount) <= 0) {
        alert("Enter a valid token amount.");
        return;
    }

    try {
        if (!userAccount) {
            alert("Please connect your MetaMask wallet first.");
            return;
        }

        await contract.methods.swapTokens(web3.utils.toWei(swapAmount, "ether")).send({ from: userAccount });
        document.getElementById("swapStatus")!.innerText = "Tokens swapped successfully!";
    } catch (error) {
        console.error("Error swapping tokens:", error);
        document.getElementById("swapStatus")!.innerText = "Error swapping tokens.";
    }
});

// Check token balance
document.getElementById("checkBalance")?.addEventListener("click", async () => {
    try {
        if (!userAccount) {
            alert("Please connect your MetaMask wallet first.");
            return;
        }

        const balance = await contract.methods.balanceOf(userAccount).call();
        document.getElementById("balance")!.innerText = `Your Balance: ${web3.utils.fromWei(balance, "ether")} RV`;
    } catch (error) {
        console.error("Error checking balance:", error);
        document.getElementById("balance")!.innerText = "Error fetching balance.";
    }
});

// Transfer tokens
document.getElementById("transferTokens")?.addEventListener("click", async () => {
    const recipient = (document.getElementById("recipient") as HTMLInputElement).value;
    const transferAmount = (document.getElementById("transferAmount") as HTMLInputElement).value;

    if (!recipient || !web3.utils.isAddress(recipient)) {
        alert("Enter a valid recipient address.");
        return;
    }

    if (!transferAmount || isNaN(Number(transferAmount)) || parseFloat(transferAmount) <= 0) {
        alert("Enter a valid transfer amount.");
        return;
    }

    try {
        if (!userAccount) {
            alert("Please connect your MetaMask wallet first.");
            return;
        }

        await contract.methods.transfer(recipient, web3.utils.toWei(transferAmount, "ether")).send({ from: userAccount });
        document.getElementById("transferStatus")!.innerText = "Tokens transferred successfully!";
    } catch (error) {
        console.error("Error transferring tokens:", error);
        document.getElementById("transferStatus")!.innerText = "Error transferring tokens.";
    }
});

// Initialize the app
init();
