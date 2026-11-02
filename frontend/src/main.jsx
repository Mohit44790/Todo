
import React, { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App.jsx";
import store, { persistor } from "./redux/store";
import "./index.css";

function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>
);
