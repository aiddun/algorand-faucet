import { useState } from "react";
import "./App.css";
import Connect from "./Connect";

function App() {
  return (
    <div className="App">
      <div className="flex justify-center items-center h-screen w-screen">
        <div
          className=" shadow overflow-hidden rounded-lg 
          border md:border-b md:border-l-0 md:border-r-0 md:border-t-0
          border-gray-200 w-[20rem] h-[20rem] flex flex-col"
        >
          <div className="mx-auto bg-gray-50 h-20 w-full flex flex-col justify-center align-middle">
            {/* <div className="mx-auto bg-white w-90 rounded-2xl shadow-sm text-center font-medium text-xl px-2 py-4"> */}
              <h1 className="text-black align-middle   font-semibold text-[20pt] text-black"><span className="text-">UT</span> Algorand Faucet</h1>
            {/* </div> */}
          </div>

          <div className="mx-auto  px-5 flex-grow  flex flex-col justify-center text-gray-900">
            <div className="text-lg">
              <p className="pb-2">To learn about Algorand, here's some for free you can use!</p>
              {/* <br className="m-0"/> */}
              <span className="font-light my-0 text-gray-00">
                <p>If you need a wallet, check out </p>
                <a href="https://perawallet.app/" className=" text-blue-500">
                  Perra Wallet
                </a>
              </span>
            </div>
          </div>

          <div className=" pb-4 px-1">
            <Connect />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
