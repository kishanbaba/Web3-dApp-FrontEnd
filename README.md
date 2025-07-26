# Secure dApp with Dynamic MFA & Signature Verification

This project is a React-based decentralized application (dApp) that demonstrates a robust, secure authentication flow using [Dynamic.xyz](https://www.dynamic.xyz/) for wallet connections and Multi-Factor Authentication (MFA). It features a professional, responsive UI built with TailwindCSS and includes backend communication for verifying wallet message signatures.

The application showcases a complete end-to-end user journey:
1.  **Wallet Connection**: Users connect via any Ethereum-compatible wallet supported by Dynamic.
2.  **MFA Setup & Verification**: Users are prompted to set up Time-based One-Time Password (TOTP) MFA with an authenticator app.
3.  **Backup Codes**: Secure backup codes are generated for account recovery.
4.  **Authenticated Actions**: Once logged in, users can sign messages with their connected wallet.
5.  **Backend Verification**: The signature is sent to a backend service to verify its authenticity and the signer's address.
6.  **Session Persistence**: Login state and signature history are persisted in the browser.

## Tech Stack

*   **Frontend**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
*   **Authentication**: [Dynamic.xyz SDK](https://docs.dynamic.xyz/sdks/react-core/overview)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **API Calls**: [Axios](https://axios-http.com/)

*(Note: This repository only contains the frontend application. It expects a running backend service for signature verification.)*

## Features

-   **Modular Project Structure**: Code is organized into `components`, `views`, and `ui` for scalability and maintainability.
-   **Responsive Design**: A clean, mobile-first UI that adapts seamlessly to desktop, tablet, and mobile screens.
-   **Component-Based Architecture**: Reusable UI components for buttons, cards, and inputs ensure a consistent look and feel.
-   **Headless MFA Flow**: Implements a custom MFA user interface using Dynamic's `useMfa` and `useSyncMfaFlow` hooks.
-   **Secure Signature Verification**: Integrates with a backend to validate signatures, preventing spoofing.
-   **State Management**: Uses React hooks for local state and `localStorage` for persisting signature history.
-   **Dynamic Theming**: Base styling is set for a modern dark mode.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18.x or later)
-   [Yarn](https://yarnpkg.com/) or npm
-   A [Dynamic.xyz](https://www.dynamic.xyz/) account and a project **Environment ID**.
-   A running backend service for signature verification. The project is pre-configured to send requests to `https://web3dapp-backend.onrender.com/api/v1/signature/verify`.

### Installation

1.  **Install dependencies:**
    ```bash
    yarn install
    # or
    npm install
    ```

2.  **Set up environment variables:**
    This project uses Dynamic's SDK, which requires an Environment ID. While it's currently hardcoded in `src/main.tsx`, the best practice is to use an environment variable.

    Create a `.env` file in the root of the project:
    ```
    VITE_DYNAMIC_ENVIRONMENT_ID=your-dynamic-environment-id
    ```

    Then, update `src/main.tsx` to use this variable:
    ```tsx
    // src/main.tsx
    ...
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <DynamicContextProvider
          settings={{
            environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID, // Use the env variable
            walletConnectors: [EthereumWalletConnectors],
          }}
        >
          <App />
        </DynamicContextProvider>
      </StrictMode>,
    )
    ```

3.  **Run the development server:**
    ```bash
    yarn dev
    # or
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Backend Setup

This frontend requires a backend server to handle the `/verify` endpoint. The endpoint should accept a `POST` request with the following JSON body:

```json
{
  "message": "The message that was signed",
  "signature": "The signature hash"
}
