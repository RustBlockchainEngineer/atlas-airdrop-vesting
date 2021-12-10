import React, { lazy } from "react";

const Header = lazy(() => import("components/Header"));
const Footer = lazy(() => import("components/Footer"));

const Menu: React.FC = ({ children }) => {

    return (
        <div id="manu-box">
            <Header />
            <div>{children}</div>
            {<Footer />}
        </div>
    );
};

export default Menu;