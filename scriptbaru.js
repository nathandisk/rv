const contractAddress = '0x0B8E09de2E66Ba0Ba07AcFdcE48fD992d0Bc83b3'; // Replace with your deployed contract address

const contractABI = [
    // Add your contract ABI here
    {
        "constant": false,
        "inputs": [],
        "name": "buyTokens",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{ "name": "_amount", "type": "uint256" }],
        "name": "swapTokens",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let web3;
let userAccount;
let contract;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Please install MetaMask to use this DApp!");
    }
}

// Connect MetaMask wallet
// Connect MetaMask wallet
document.getElementById("connectWallet").onclick = async function () {
    try {
        await init(); // Ensure web3 and contract are initialized
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        userAccount = accounts[0];
        document.getElementById("walletAddress").innerText = `Wallet: ${userAccount}`;
        
        // Fetch and display token balance after connecting
        await updateTokenBalance();
    } catch (error) {
        console.error(error);
        alert("Failed to connect wallet.");
    }
};

async function updateTokenBalance() {
    if (!window.ethereum || !userAccount) {
        alert("Please connect your MetaMask wallet first.");
        return;
    }

    try {
        // Get the ETH balance in Wei
        const balanceWei = await web3.eth.getBalance(userAccount);
        
        // Convert Wei to Ether (ETH)
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        
        // Display the ETH balance
        const balanceElement = document.getElementById("balance");
        if (balanceElement) {
            balanceElement.innerText = `Your ETH Balance: ${balanceEth} ETH`;
        } else {
            console.warn("Element with id 'balance' not found");
        }

        // Get the token balance (ERC20 token balance)
        // Assuming your contract has a balanceOf method
        if (contract.methods.balanceOf) {
            const tokenBalanceWei = await contract.methods.balanceOf(userAccount).call();
            const tokenBalance = web3.utils.fromWei(tokenBalanceWei, 'ether');  // Assumes token has 18 decimal places
            const tokenBalanceElement = document.getElementById("tokenBalance");
            if (tokenBalanceElement) {
                tokenBalanceElement.innerText = `Your Token Balance: ${tokenBalance} RV`;
            } else {
                console.warn("Element with id 'tokenBalance' not found");
            }
        } else {
            console.warn("Contract does not have a balanceOf method");
        }

    } catch (error) {
        console.error("Error fetching balances:", error);
    }
}
document.getElementById("checkBalance").onclick = async function () {
    if (!window.ethereum || !userAccount) {
        alert("Please connect your MetaMask wallet first.");
        return;
    }

    try {
        // Get the ETH balance in Wei
        const balanceWei = await web3.eth.getBalance(userAccount);
        
        // Convert Wei to Ether (ETH)
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        
        // Display the ETH balance
        document.getElementById("balance").innerText = `Your ETH Balance: ${balanceEth} ETH`;

        // Get the token balance (ERC20 token balance)
        const tokenBalanceWei = await contract.methods.balanceOf(userAccount).call();
        const tokenBalance = web3.utils.fromWei(tokenBalanceWei, 'ether');  // Assumes token has 18 decimal places
        document.getElementById("tokenBalance").innerText = `Your Token Balance: ${tokenBalance} RV`;

    } catch (error) {
        console.error("Error fetching balances:", error);
      
    }
};
// Buy RV Tokens
document.getElementById("buyTokens").onclick = async function () {
    const ethAmount = document.getElementById("ethAmount").value;
    if (!ethAmount || ethAmount <= 0) {
        alert("Enter a valid ETH amount.");
        return;
    }

    try {
        await contract.methods.buyTokens().send({
            from: userAccount,
            value: web3.utils.toWei(ethAmount, "ether")
        });
        document.getElementById("buyStatus").innerText = "Tokens purchased successfully!";
    } catch (error) {
        console.error(error);
        document.getElementById("buyStatus").innerText = "Failed to purchase tokens.";
    }
};

// Swap Tokens
document.getElementById("swapTokens").onclick = async function () {
    const swapAmount = document.getElementById("swapAmount").value;
    const tswapElement = document.getElementById("tswap");
    const transactionElement = document.getElementById("transaction");
    const swapStatusElement = document.getElementById("swapStatus");

    if (!web3 || !userAccount) {
        alert("Please connect your wallet first.");
        return;
    }

    if (!swapAmount || swapAmount <= 0) {
        alert("Please enter a valid amount to swap.");
        return;
    }

    if (!tswapElement || !transactionElement) {
        console.error("Required elements 'tswap' or 'transaction' not found.");
        alert("Swap functionality is not fully configured. Please contact support.");
        return;
    }

    const selectedToken = tswapElement.value;
    if (!selectedToken) {
        alert("Please select a token to swap.");
        return;
    }

    swapStatusElement.innerText = "Initiating swap...";

    try {
        // Convert the swapAmount to Wei (assuming the contract expects the amount in Wei)
        const swapAmountWei = web3.utils.toWei(swapAmount, "ether");
        
        // Call the contract's swap function with the correct parameter types
        const result = await contract.methods.swapTokens(swapAmountWei).send({ from: userAccount });
        
        swapStatusElement.innerText = "Tokens swapped successfully!";
        transactionElement.innerText = `Transaction: ${result.transactionHash}`;
    } catch (error) {
        console.error("Swap error:", error);
        swapStatusElement.innerText = "Failed to swap tokens. " + error.message;
    }
};


// Transfer RV Tokens
document.getElementById("transferTokens").onclick = async function () {
    const recipient = document.getElementById("recipient").value;
    const transferAmount = document.getElementById("transferAmount").value;

    if (!recipient || !web3.utils.isAddress(recipient)) {
        alert("Enter a valid recipient address.");
        return;
    }
    if (!transferAmount || transferAmount <= 0) {
        alert("Enter a valid RV amount.");
        return;
    }

    try {
        await contract.methods.transfer(recipient, web3.utils.toWei(transferAmount, "ether")).send({ from: userAccount });
        document.getElementById("transferStatus").innerText = "Tokens transferred successfully!";
    } catch (error) {
        console.error(error);
        document.getElementById("transferStatus").innerText = "Failed to transfer tokens.";
    }
};

init();