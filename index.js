import MetaMaskOnboarding from '@metamask/onboarding';


const onboarding = new MetaMaskOnboarding();
const connectBtn = document.querySelector('.onboard');
const sendButton = document.querySelector('.sendButton');
const getBalance = document.querySelector('.getBalance');
const statusText = document.querySelector('h1');
const statusDesc = document.querySelector('.desc');
const balanceText = document.querySelector('.balance');
const loader = document.querySelector('.loader');
const upArrow = document.querySelector('.up');

let account
let balance


const isMetaMaskInstalled = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
}

let connected = (accounts) => {
    account = accounts[0]
    statusText.innerHTML = 'Connected!'
    statusDesc.classList.add('account');
    statusDesc.innerHTML = accounts[0]
    connectBtn.style.display = 'none';
    loader.style.display = 'none';
    upArrow.style.display = 'none';
    statusDesc.classList.add('account');
    balanceText.innerHTML = balance
}

async function connectWallet() {
    return await ethereum.request({ method: 'eth_accounts' });
}

async function getBalanceFunction() {
    return await ethereum.request({ method: 'eth_getBalance' , params: [account, "latest"]});
}

const onClickInstallMetaMask = () => {
    onboarding.startOnboarding();
    loader.style.display = 'block';
}
// Connect Wallet
connectBtn.addEventListener('click', async () => {
    connectBtn.style.backgroundColor = '#cccccc';
    loader.style.display = 'block';

    try {
        const accounts = await ethereum.request({method: 'eth_requestAccounts'})
        connected(accounts)
    } catch (error) {
        console.error(error);
    }
})

// Get Balance Function
getBalance.addEventListener('click', async () => {
    try {
       balance = getBalanceFunction()
    } catch (error) {
        console.error(error);
    }
})

//Sending Ethereum to an address
sendButton.addEventListener('click', () => {
    console.log(account)
    ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: account,
                    to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
                    value: '0x29a2241af62c0000',
                    gasPrice: '0x09184e72a000',
                    gas: '0x2710',
                },
            ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
});

// Check if metamask is installed
const MetaMaskClientCheck = () => {
    if (!isMetaMaskInstalled()) {
        statusText.innerText = 'You need to Install a Wallet';
        statusDesc.innerText = 'We recommend the MetaMask wallet.';
        connectBtn.innerText = 'Install MetaMask'
        connectBtn.onclick = onClickInstallMetaMask;
    } else {

        connectWallet().then((accounts) => {
            if (accounts && accounts[0] > 0) {
                connected(accounts)
            } else {
                statusText.innerHTML = 'Connect your wallet'
                statusDesc.innerHTML = `To begin, please connect your MetaMask wallet.`
                connectBtn.innerText = 'Connect MetaMask'
                upArrow.style.display = 'block';
            }
        })
    }
}

MetaMaskClientCheck()
