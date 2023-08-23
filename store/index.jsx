"use client";
const { createContext, useState } = require("react");
const { default: Store } = require("./Store");

export const StoreContext = createContext(new Store());

export const StoreProvider = ({ children }) => {
  const [store] = useState(new Store());

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
