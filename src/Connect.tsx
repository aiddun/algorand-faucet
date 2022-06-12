import WalletConnect from "@walletconnect/client/dist/umd/index.min.js";
// import QRCodeModal from '@walletconnect/qrcode-modal/dist/umd/index.min.js'
// import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import { useEffect, useState } from "react";

// https://developer.algorand.org/docs/get-details/walletconnect/

const SubmitButton = ({
  onClick,
  disabled,
  title = "Submit",
  loading,
  error
}: {
  onClick?: () => void;
  disabled?: boolean;
  title: string;
  loading?: boolean;
  error?: string
}) => (
  // <span className="inline-flex rounded-md shadow-sm">
  //   <button
  //     type="button"
  //     className="inline-flex items-center px-4 py-2
  //     border border-transparent text-sm leading-5 font-medium r
  //     ounded-md text-white bg-blue-500 hover:bg-blue-900 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
  //   >
  //     Submit
  //   </button>
  // </span>

  <span className="inline-flex rounded-md shadow-sm">
    <button
      disabled={disabled}
      type="button"
      className={`inline-flex items-center px-3 py-1.5 border border-transparent 
      text-xl leading-5 font-medium rounded-md text-white shadow
       ${disabled
          ? "bg-blue-600 opacity-70 cursor-default"
          : `bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 
              focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150 `
        }`}
      onClick={onClick}
    >
      {!error ?
        <div className="h-7 w-7">
          {loading ? (
            // Loading icon
            <svg
              class="animate-spin -ml-1 h-7 w-7 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 -ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>
        : undefined}
      <p className="pl-0.5">{error ?? title}</p>
    </button>
  </span>
);

const Connect = () => {


  const [loading, setLoading] = useState(false);
  const [txid, setTxid] = useState(null);
  const [error, setError] = useState(null);


  const [connector, setConnector] = useState(() => {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });

    // Check if connection is already established
    if (connector.connected) {
      connector.killSession();
    }

    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      setLoading(true)


      // Get provided accounts
      const { accounts } = payload.params[0];
      const address = accounts[0];

      fetch("https://ar-backend.aiddun.repl.co/api/tap", {
        method: "POST", body: JSON.stringify({
          "address": address
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json()).then(json => {
        if (json.error) setError(`Sorry, ${json.error}`)
        if (json.txid) setTxid(json.txid)
      })
      setLoading(false)
    });

    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts
      const { accounts } = payload.params[0];
    });

    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
    });

    return connector;
  });


  return (
    <div>
      {txid
        ?
        <p>Transaction confirmed! View it <a className="text-blue-700" href={`https://testnet.algoexplorer.io/tx/${txid}`}>here</a></p>
        :
        <SubmitButton
          title={loading ? "Processing..." : "Connect Wallet"}
          onClick={() => {
            connector.createSession();
          }}
          loading={loading}
          error={error}
        />
      }
      {/* <button onClick={() => connector.createSession()}>Connect Wallet</button> */}
    </div>
  );
};
// Create a connector

export default Connect;
