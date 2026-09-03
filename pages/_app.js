import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { useState, useMemo, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useAccount, useDisconnect, useWalletClient } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig, darkTheme, useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit'
import { BrowserProvider } from 'ethers'
import Navbar from '../components/Navbar'

export const ADMIN_WALLET = "0xa388C71f0D69d33455cf25f6c71F7eA37f98745B"

const PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'de2ee5398a2c3f77eddcd7ddafbe0473'

const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: { default: { http: ['https://sepolia.base.org'] } },
  blockExplorers: { default: { name: 'Basescan', url: 'https://sepolia.basescan.org' } },
  testnet: true,
}

// getDefaultConfig sets up MetaMask, Coinbase, Trust, Rainbow, and
// WalletConnect (for everything else) with RainbowKit's own mobile
// deep-linking, which is far more reliable on iOS than AppKit's was.
const wagmiConfig = getDefaultConfig({
  appName: 'FLIBBER',
  projectId: PROJECT_ID,
  chains: [baseSepolia],
  ssr: true,
})

const queryClient = new QueryClient()

// Converts a viem walletClient (what wagmi gives us) into an ethers
// BrowserProvider + Signer, so every page that already expects `provider`
// as an ethers object keeps working unchanged.
function walletClientToEthersProvider(walletClient) {
  if (!walletClient) return null
  const { transport } = walletClient
  return new BrowserProvider(transport, {
    chainId: walletClient.chain.id,
    name: walletClient.chain.name,
  })
}

function AppInner({ Component, pageProps, router }) {
  const { address, isConnected, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: walletClient } = useWalletClient()
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const [connecting, setConnecting] = useState(false)

  const provider = useMemo(() => walletClientToEthersProvider(walletClient), [walletClient])

  const connect = async () => {
    setConnecting(true)
    openConnectModal?.()
    setConnecting(false)
  }

  const wrongNetwork = isConnected && chainId !== 84532

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
          account={address || null}
          onConnect={connect}
          onDisconnect={() => disconnect()}
          chainId={chainId}
          connecting={connecting}
        />
      )}

      {wrongNetwork && router.pathname !== '/admin' && router.pathname !== '/' && (
        <div style={{ background: 'rgba(255,68,68,0.08)', borderBottom: '1px solid rgba(255,68,68,0.2)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '13px', color: 'var(--red)', zIndex: 10, position: 'relative' }}>
          <span>Wrong network — switch to Base Sepolia</span>
          <button onClick={() => openAccountModal?.()} style={{ padding: '4px 12px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '6px', color: 'var(--red)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
            Switch Network
          </button>
        </div>
      )}

      <Component
        {...pageProps}
        account={address || null}
        provider={provider}
        chainId={chainId}
        onConnect={connect}
        onDisconnect={() => disconnect()}
      />
    </>
  )
}

export default function App(props) {
  const router = useRouter()

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#00FF87',
          accentColorForeground: '#050505',
          borderRadius: 'medium',
          fontStack: 'system',
        })}>
          <AppInner {...props} router={router} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}