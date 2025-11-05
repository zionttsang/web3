import { createWalletClient, custom, createPublicClient, parseEther, defineChain, formatEther } from "https://esm.sh/viem"
import { abi, contractAddress } from "./constants-js.js"


let walletClient
let publicClient

const connectButton = document.getElementById("connectButton")
connectButton.onclick = connect

async function connect() {
  console.log('hi, connecting...')
  if (typeof window.ethereum !== "undefined") {
    console.log("You do have MetaMask.")
    walletClient = createWalletClient({
      transport: custom(window.ethereum)
    })

    try {
      const [connectedAddress] = await walletClient.requestAddresses()
      connectButton.innerHTML = 'Connected!'
    } catch (error) {
      console.error('Connection failed:', error)
      connectButton.innerHTML = 'Connection failed. Try again?'
    }
  } else {
    connectButton.innerHTML = 'please install MetaMask.'
  }

}

const fundButton = document.getElementById("fundButton")
fundButton.onclick = fund
async function fund() {
  // if (typeof window.ethereum !== "undefined") {
  //   console.log("You do have MetaMask.")
  //   walletClient = createWalletClient({
  //     transport: custom(window.ethereum)
  //   })
  //   const [connectedAddress] = walletClient.requestAddresses()

  const etherAmountInput = document.getElementById("etherAmount")
  const etherAmount = etherAmountInput.value
  console.log(`Funding is ${etherAmount}...`)

  const [connectedAddress] = await walletClient.requestAddresses()

  publicClient = createPublicClient({
    transport: custom(window.ethereum)
  })

  console.log(parseEther(etherAmount))

  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi: abi,
    functionName: "fund",
    account: connectedAddress,
    chain: await getCurrentChain(walletClient),
    value: parseEther(etherAmount),
  })

  console.log(request)
  const hash = await walletClient.writeContract(request)
  console.log(hash)

}

const balanceButton = document.getElementById("balanceButton")
balanceButton.onclick = getBalance
async function getBalance() {
  if (typeof window.ethereum !== 'undefined') {
    publicClient = createPublicClient({
      transport: custom(window.ethereum)
    })
  }

  const balance = publicClient.getBalance({
    address: contractAddress,
  })
  console.log(formatEther(balance))

}

async function getCurrentChain(client) {
  const chainId = await client.getChainId()
  const currentChain = defineChain({
    id: chainId,
    name: 'Customm Chain',
    nativeCurrency: {
      name: 'Ether',
      Symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['http://localhost:8545']
      }
    }
  })

  return currentChain

}
