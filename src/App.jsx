import { useState } from "react";
import Layout from "./Layout/Layout";
import Landing from "./Landing/Landing";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return authenticated ? <Layout /> : <Landing />;
}

export default App;
