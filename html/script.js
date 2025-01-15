// FILEPATH: c:/Users/DELL/Documents/maman/nathan/html/script.js

var web3;
var account;
var contract;

const contractAddress = '0x0B8E09de2E66Ba0Ba07AcFdcE48fD992d0Bc83b3'; // Replace with your token contract address
const contractABI = [0x8049e12401d1eb5b936bde684d386cc5a0ff1a6c0f0e2f8a2988d5c1f5e8bb9b]; // Replace with your token contract ABI

var connectWalletButton = document.getElementById('connectWallet');
var walletAddressElement = document.getElementById('walletAddress');
var balanceAddressElement = document.getElementById('balanceAddress');
var checkBalanceButton = document.getElementById('checkBalance');
var balanceOutputElement = document.getElementById('balanceOutput');
var balanceOutputElement2 = document.getElementById('balanceOutput2');

console.log('Script loaded');
// Connect Wallet
// Function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to update balanceOutput2 based on the FakeBalance cookie
function updateFakeBalanceDisplay() {
    let fakeBalance = getCookie('FakeBalance') || '0';
    balanceOutputElement2.textContent = 'Fake Balance: ' + fakeBalance + ' ETH';
}

// Function to check balance
function checkBalance() {
    console.log('Check balance button clicked');
    if (!web3 || !account) {
        console.log('Wallet not connected');
        alert('Please connect your wallet first');
        return;
    }

    console.log('Checking balance for account:', account);
    web3.eth.getBalance(account)
        .then(function(balance) {
            var ethBalance = web3.utils.fromWei(balance, 'ether');
            console.log('Balance received:', ethBalance);
            balanceOutputElement.textContent = 'Balance: ' + ethBalance + ' ETH';
            
            // Update fake balance display
            updateFakeBalanceDisplay();
        })
        .catch(function(error) {
            console.error('Error checking balance', error);
            balanceOutputElement.textContent = 'Error checking balance';
        });
}

// Function to update fake balance
function updateFakeBalance() {
    let newFakeBalance = prompt("Enter new fake balance:");
    if (newFakeBalance !== null) {
        setCookie('FakeBalance', newFakeBalance, 7); // Save for 7 days
        updateFakeBalanceDisplay();
    }
}

// Add click event listeners
connectWalletButton.addEventListener('click', connectWallet);
checkBalanceButton.addEventListener('click', checkBalance);

console.log('Event listeners added');

// Check if MetaMask is already connected on page load
window.addEventListener('load', function() {
    console.log('Page loaded');
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed');
        web3 = new Web3(window.ethereum);
        web3.eth.getAccounts()
            .then(function(accounts) {
                console.log('Initial accounts:', accounts);
                if (accounts.length > 0) {
                    account = accounts[0];
                    walletAddressElement.textContent = 'Wallet: ' + account;
                    balanceAddressElement.value = account;
                    connectWalletButton.textContent = 'Wallet Connected';
                    connectWalletButton.disabled = true;
                    console.log('Wallet already connected');
                }
                // Update fake balance display on page load
                updateFakeBalanceDisplay();
            })
            .catch(function(error) {
                console.error('Error checking initial connection', error);
            });
    } else {
        console.log('MetaMask not detected on page load');
    }
    
    // Set up interval to check and update fake balance every 5 seconds
    setInterval(updateFakeBalanceDisplay, 5000);
});
function connectWallet() {
    console.log('Connect wallet button clicked');
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed');
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(function(accounts) {
                console.log('Accounts received:', accounts);
                web3 = new Web3(window.ethereum);
                account = accounts[0];
                
                // Update the UI
                walletAddressElement.textContent = 'Wallet: ' + account;
                balanceAddressElement.value = account;
                connectWalletButton.textContent = 'Wallet Connected';
                connectWalletButton.disabled = true;
                console.log('Wallet connected successfully');
              
            })
            .catch(function(error) {
                console.error('User denied account access', error);
            });
    } else {
        console.log('MetaMask not detected');
        alert('Please install MetaMask to use this feature');
    }
}

// Check Balance
function checkBalance() {
    console.log('Check balance button clicked');
    if (!web3 || !account) {
        console.log('Wallet not connected');
        alert('Please connect your wallet first');
        return;
    }

    console.log('Checking balance for account:', account);
    web3.eth.getBalance(account)
        .then(function(balance) {
            var ethBalance = web3.utils.fromWei(balance, 'ether');
            console.log('Balance received:', ethBalance);
            balanceOutputElement.textContent = 'Balance: ' + ethBalance + ' ETH';
           
           //save 7 days
           if (getCookie('FakeBalance') === null) {
            setCookie('FakeBalance', '10', 7); //save 7 days
           }
            console.log('Balance Fake successfully');
            updateFakeBalanceDisplay();
        })
        .catch(function(error) {
            console.error('Error checking balance', error);
            balanceOutputElement.textContent = 'Error checking balance';
        });
}

// Add click event listeners
connectWalletButton.addEventListener('click', connectWallet);
checkBalanceButton.addEventListener('click', checkBalance);

console.log('Event listeners added');

// Check if MetaMask is already connected on page load
window.addEventListener('load', function() {
    console.log('Page loaded');
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed');
        web3 = new Web3(window.ethereum);
        web3.eth.getAccounts()
            .then(function(accounts) {
                console.log('Initial accounts:', accounts);
                if (accounts.length > 0) {
                    account = accounts[0];
                    walletAddressElement.textContent = 'Wallet: ' + account;
                    balanceAddressElement.value = account;
                    connectWalletButton.textContent = 'Wallet Connected';
                    connectWalletButton.disabled = true;
                    console.log('Wallet already connected');
                }
            })
            .catch(function(error) {
                console.error('Error checking initial connection', error);
            });
    } else {
        console.log('MetaMask not detected on page load');
    }
});


// Function to update balanceOutput2 based on the FakeBalance cookie
function updateFakeBalanceDisplay() {
    let fakeBalance = getCookie('FakeBalance') || '0';
    balanceOutputElement2.textContent = 'Fake Balance: ' + fakeBalance + ' ETH';
}


const recipientAddressInput = document.getElementById('recipientAddress');
const transferAmountInput = document.getElementById('transferAmount');
const transferTokensButton = document.getElementById('transferTokens');
const transferStatus = document.getElementById('transferStatus');

transferTokensButton.addEventListener('click', async () => {
    const recipientAddress = recipientAddressInput.value;
    const amount = transferAmountInput.value;

    if (!web3.utils.isAddress(recipientAddress)) {
        transferStatus.textContent = 'Invalid recipient address';
        return;
    }

    if (amount <= 0) {
        transferStatus.textContent = 'Invalid amount';
        return;
    }

    try {
        transferStatus.textContent = 'Transferring tokens...';
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0];

        // Assuming your token contract has a 'transfer' function
        await contract.methods.transfer(recipientAddress, web3.utils.toWei(amount, 'ether')).send({ from: sender });

        transferStatus.textContent = 'Transfer successful!';
        // Update balances after transfer
        updateBalance(sender);
    } catch (error) {
        console.error('Error transferring tokens:', error);
        transferStatus.textContent = 'Error transferring tokens. Check console for details.';
    }
});


