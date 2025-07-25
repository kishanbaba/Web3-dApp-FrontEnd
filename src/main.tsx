import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import {
  DynamicContextProvider,
} from "@dynamic-labs/sdk-react-core";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: "4b321ef7-9256-4bff-8650-96ea9493a070",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <App />
    </DynamicContextProvider>
  </StrictMode>,
)