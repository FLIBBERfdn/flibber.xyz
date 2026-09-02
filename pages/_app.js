import '../styles/globals.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'

export const ADMIN_WALLET = "0xa388C71f0D69d33455cf25f6c71F7eA37f98745B"

const PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'de2ee5398a2c3f77eddcd7ddafbe0473'

const metadata = {
  name: 'FLIBBER',
  description: 'The first cross-chain slotting protocol',
  url: 'https://flibber-xyz.vercel.app',
  icons: ['https://flibber-xyz.vercel.app/flibber.png'],
}

const baseSepolia = {
  id: 84532,
  caipNetworkId: 'eip155:84532',
  chainNamespace: 'eip155',
  name: 'Base Sepolia',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: { default: { http: ['https://sepolia.base.org'] } },
  blockExplorers: { default: { name: 'Basescan', url: 'https://sepolia.basescan.org' } },
}

let modalInstance = null
let modalLoadPromise = null

async function getModal() {
  if (modalInstance) return modalInstance
  // Dedupe concurrent calls (e.g. useEffect + a fast tap) into one load.
  if (modalLoadPromise) return modalLoadPromise

  modalLoadPromise = (async () => {
    const { createAppKit } = await import('@reown/appkit')
    const { EthersAdapter } = await import('@reown/appkit-adapter-ethers')

    const ethersAdapter = new EthersAdapter()

    modalInstance = createAppKit({
      adapters: [ethersAdapter],
      networks: [baseSepolia],
      metadata,
      projectId: PROJECT_ID,
      features: { analytics: false },
      themeMode: 'dark',
      themeVariables: {
        '--w3m-color-mix': '#050505',
        '--w3m-color-mix-strength': 40,
        '--w3m-accent': '#ECEEF1',
        '--w3m-border-radius-master': '12px',
        '--w3m-font-family': 'Manrope, sans-serif',
      },
      featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
        'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
        '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
        '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
      ],
    })

    return modalInstance
  })()

  return modalLoadPromise
}

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [account,    setAccount]    = useState(null)
  const [provider,   setProvider]   = useState(null)
  const [chainId,    setChainId]    = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [modal,      setModal]      = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    initAppKit()
  }, [])

  const initAppKit = async () => {
    try {
      const m = await getModal()
      setModal(m)
      wireModalSubscriptions(m)
    } catch(e) {
      console.error('AppKit init failed, using injected-provider fallback:', e)
      fallbackAutoConnect()
    }
  }

  const wireModalSubscriptions = (m) => {
    // Subscribe to account changes
    m.subscribeAccount(({ address, isConnected }) => {
      if (isConnected && address) {
        setAccount(address)
        getProvider(m)
      } else {
        setAccount(null)
        setProvider(null)
        setChainId(null)
      }
    })

    // Subscribe to network changes
    m.subscribeNetwork(({ chainId: cid }) => {
      if (cid) setChainId(Number(cid))
    })

    // Check if already connected
    const state = m.getAccount()
    if (state?.isConnected && state?.address) {
      setAccount(state.address)
      getProvider(m)
    }
  }

  const getProvider = async (m) => {
    try {
      const { BrowserProvider } = await import('ethers')
      const walletProvider = m.getWalletProvider()
      if (walletProvider) {
        const ethersProvider = new BrowserProvider(walletProvider)
        setProvider(ethersProvider)
        const network = await ethersProvider.getNetwork()
        setChainId(Number(network.chainId))
      }
    } catch(e) { console.error(e) }
  }

  const fallbackAutoConnect = async () => {
    try {
      if (!window.ethereum) return
      const { ethers } = await import('ethers')
      const p = new ethers.BrowserProvider(window.ethereum)
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setProvider(p)
        const network = await p.getNetwork()
        setChainId(Number(network.chainId))
      }
    } catch(e) { console.error(e) }
  }

  // IMPORTANT (mobile fix): previously this checked `if (modal)` — React
  // state set from the useEffect's initAppKit() call. On mobile, JS often
  // hasn't finished loading AppKit by the time the user taps Connect, so
  // `modal` was still null and this fell through to the window.ethereum
  // fallback, which does nothing on mobile Safari/Chrome (no injected
  // provider outside a wallet's own in-app browser). Now we always try
  // getModal() directly — its memoized, so it's instant once loaded once,
  // and only truly awaits on that first race.
  const connect = async () => {
    setConnecting(true)
    try {
      const m = modal || await getModal()
      if (m) {
        if (!modal) {
          setModal(m)
          wireModalSubscriptions(m)
        }
        m.open({ view: 'Connect' })
        setConnecting(false)
        return
      }
    } catch (e) {
      console.error('AppKit unavailable, falling back to injected provider:', e)
    }

    // Injected-provider fallback: MetaMask browser extension on desktop,
    // or a wallet's own in-app browser on mobile (Trust Wallet, MetaMask
    // mobile browser, Coinbase Wallet browser, etc. all inject window.ethereum
    // when you open your dapp URL *inside* their app).
    try {
      if (!window.ethereum) {
        alert('No wallet detected in this browser. On mobile, either tap Connect to use WalletConnect (scan/deep-link), or open this site from inside your wallet app\'s built-in browser.')
        setConnecting(false)
        return
      }
      const { ethers } = await import('ethers')
      const p = new ethers.BrowserProvider(window.ethereum)
      await p.send('eth_requestAccounts', [])
      const signer = await p.getSigner()
      setAccount(await signer.getAddress())
      setProvider(p)
      const network = await p.getNetwork()
      setChainId(Number(network.chainId))
    } catch(e) { console.error(e) }
    setConnecting(false)
  }

  const disconnect = async () => {
    if (modal) {
      modal.open({ view: 'Account' })
      return
    }
    setAccount(null); setProvider(null); setChainId(null)
  }

  const wrongNetwork = account && chainId !== 84532

  return (
    <>
      <Head>
        <title>FLIBBER — Slotting Protocol</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="The first cross-chain protocol where one token pays all gas and all swaps preserve 100% value." />
        <meta name="theme-color" content="#050505" />
        <link rel="icon" href="/flibber.png" />
      </Head>

      {router.pathname !== '/admin' && router.pathname !== '/' && (
        <Navbar
          account={account}
          onConnect={connect}
          onDisconnect={disconnect}
          chainId={chainId}
          connecting={connecting}
        />
      )}

      {wrongNetwork && router.pathname !== '/admin' && router.pathname !== '/' && (
        <div style={{ background: 'rgba(255,68,68,0.08)', borderBottom: '1px solid rgba(255,68,68,0.2)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '13px', color: 'var(--red)', zIndex: 10, position: 'relative' }}>
          <span>Wrong network — switch to Base Sepolia</span>
          <button onClick={() => modal?.open({ view: 'Networks' })} style={{ padding: '4px 12px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '6px', color: 'var(--red)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
            Switch Network
          </button>
        </div>
      )}

      <Component
        {...pageProps}
        account={account}
        provider={provider}
        chainId={chainId}
        onConnect={connect}
        onDisconnect={disconnect}
      />
    </>
  )
}