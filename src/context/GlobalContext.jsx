import { createContext, useContext } from "react";
const GlobalContext = createContext({});

export default GlobalContext;

export const useGlobalContext = () => useContext(GlobalContext);
