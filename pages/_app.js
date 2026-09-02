import '../styles/globals.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'

export const ADMIN_WALLET = "0xa388C71f0D69d33455cf25f6c71F7eA37f98745B"

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [account,    setAccount]    = useState(null)
  const [provider,   setProvider]   = useState(null)
  const [chainId,    setChainId]    = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [w3m,        setW3m]        = useState(null) // Web3Modal instance

  useEffect(() => {
    if (typeof window === 'undefined') return
    initModal()
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accs => {
        if (accs.length === 0) { setAccount(null); setProvider(null) }
        else setAccount(accs[0])
      })
      window.ethereum.on('chainChanged', c => setChainId(parseInt(c, 16)))
    }
  }, [])

  const initModal = async () => {
    try {
      const { createWeb3Modal, defaultConfig } = await import('@web3modal/ethers/react')

      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'de2ee5398a2c3f77eddcd7ddafbe0473'

      const modal = createWeb3Modal({
        ethersConfig: defaultConfig({
          metadata: {
            name: 'FLIBBER',
            description: 'The first cross-chain slotting protocol',
            url: 'https://flibber-xyz.vercel.app',
            icons: ['/flibber.png'],
          }
        }),
        chains: [{
          chainId: 84532,
          name: 'Base Sepolia',
          currency: 'ETH',
          explorerUrl: 'https://sepolia.basescan.org',
          rpcUrl: 'https://sepolia.base.org',
        }],
        projectId,
        themeMode: 'dark',
        themeVariables: {
          '--w3m-color-mix': '#050505',
          '--w3m-color-mix-strength': 40,
          '--w3m-accent': '#ECEEF1',
          '--w3m-border-radius-master': '12px',
        },
        featuredWalletIds: [
          'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
          'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
          '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
          '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
        ],
      })

      setW3m(modal)

      // Listen for connection events
      modal.subscribeProvider(({ address, chainId, isConnected, provider: wp }) => {
        if (isConnected && address && wp) {
          import('ethers').then(({ BrowserProvider }) => {
            const ethersProvider = new BrowserProvider(wp)
            setAccount(address)
            setProvider(ethersProvider)
            setChainId(chainId)
          })
        } else {
          setAccount(null)
          setProvider(null)
          setChainId(null)
        }
      })
    } catch(e) {
      console.error('Web3Modal failed, using MetaMask fallback:', e)
      autoConnect()
    }
  }

  const autoConnect = async () => {
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

  const connect = async () => {
    if (w3m) {
      w3m.open()
      return
    }
    // Fallback to MetaMask
    setConnecting(true)
    try {
      if (!window.ethereum) return alert('Please install MetaMask or another wallet')
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

  const disconnect = () => {
    if (w3m) { w3m.open({ view: 'Account' }); return }
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
          <button onClick={() => w3m ? w3m.open({ view: 'Networks' }) : null} style={{ padding: '4px 12px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '6px', color: 'var(--red)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
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