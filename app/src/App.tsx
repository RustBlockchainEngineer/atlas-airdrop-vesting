import React, { lazy } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./routerHistory";

import GlobalStyle from "./style/Global";
import PageLoader from "./components/PageLoader";
import SuspenseWithChunkError from "./components/SuspenseWithChunkError";
import Web3ReactManager from "components/Web3ReactManager";
import { useFetchPublicData } from "state/hooks";
// fonts
import "fonts/Montserrat/style.css";
import "fonts/Source_Sans_Pro/style.css";

// styles
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "components/Menu";
import { ConnectionProvider } from "contexts/connection";
import { WalletProvider } from "contexts/wallet";

const Home = lazy(() => import("./views/Home"));

const App: React.FC = () => {
  useFetchPublicData();

  return (
    <ConnectionProvider>
      <WalletProvider>
        <Router history={history}>
          <GlobalStyle />
          <SuspenseWithChunkError fallback={<PageLoader />}>
            <Menu>
              <Web3ReactManager>
                <Switch>
                  <Route path="/" exact>
                    <Home />
                  </Route>
                </Switch>
              </Web3ReactManager>
            </Menu>
          </SuspenseWithChunkError>
        </Router>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
