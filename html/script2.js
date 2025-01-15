// FILEPATH: c:/Users/DELL/Documents/maman/nathan/html/script.js

var web3;
var account;
var contract;

const contractAddress = '0x0B8E09de2E66Ba0Ba07AcFdcE48fD992d0Bc83b3'; 
0x25c4a76E7d118705e7Ea2e9b7d8C59930d8aCD3b// Replace with your token contract address
const contractABI = [
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


// Initialize web3 and the contract
async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Please install MetaMask!");
    }
}

// Connect MetaMask wallet
document.getElementById("connectWallet").onclick = async function () {
    try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        userAccount = accounts[0];
        document.getElementById("walletAddress").innerText = `Connected: ${userAccount}`;
    } catch (error) {
        console.error(error);
        alert("Failed to connect MetaMask.");
    }
};

// Buy tokens
document.getElementById("buyTokens").onclick = async function () {
    const ethAmount = document.getElementById("ethAmount").value;
    try {
        await web3.eth.sendTransaction({
            from: userAccount,
            to: contractAddress,
            value: web3.utils.toWei(ethAmount, "ether"),
        });
        document.getElementById("buyStatus").innerText = "Tokens purchased successfully!";
    } catch (error) {
        console.error(error);
        document.getElementById("buyStatus").innerText = "Failed to purchase tokens.";
    }
};


// Swap tokens
document.getElementById("swapTokens").onclick = async function () {
    const swapAmount = document.getElementById("swapAmount").value;
    try {
        await contract.methods.swapTokens(web3.utils.toWei(swapAmount, "ether")).send({ from: userAccount });
        document.getElementById("swapStatus").innerText = "Tokens swapped successfully!";
    } catch (error) {
        console.error(error);
        document.getElementById("swapStatus").innerText = "Failed to swap tokens.";
    }
};

// Check token balance
// Check token balance
document.getElementById("checkBalance").onclick = async function () {
    try {
        const balance = await contract.methods.balanceOf(userAccount).call();
        document.getElementById("balance").innerText = `Your Balance: ${web3.utils.fromWei(balance, "ether")} RV`;
    } catch (error) {
        console.error(error);
        document.getElementById("balance").innerText = "Failed to fetch balance.";
    }
};


// Transfer tokens
document.getElementById("transferTokens").onclick = async function () {
    const recipient = document.getElementById("recipient").value;
    const transferAmount = document.getElementById("transferAmount").value;
    try {
        await contract.methods.transfer(recipient, web3.utils.toWei(transferAmount, "ether")).send({ from: userAccount });
        document.getElementById("transferStatus").innerText = "Tokens transferred successfully!";
    } catch (error) {
        console.error(error);
        document.getElementById("transferStatus").innerText = "Failed to transfer tokens.";
    }
};

// Initialize the app
init();