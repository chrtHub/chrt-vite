import { useState } from "react";
import Layout from "./Components/Layout/Layout";
import LandingPage from "./Components/LandingPage/LandingPage";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return authenticated ? (
    <Layout />
  ) : (
    <div className="overflow-visible">
      <LandingPage />
    </div>
  );
}

export default App;
