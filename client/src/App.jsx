import React from "react";
import Home from "./components/Home";
import LandingPage from "./components/LandingPage";
import useStore from "./zustand/state";

function App() {
  const LoggedIn = useStore((state) => state.LoggedIn);
  return <>{LoggedIn ? <Home></Home> : <LandingPage></LandingPage>}</>;
}

export default App;