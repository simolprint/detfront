import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import Footer from "components/Footer/Footer.js";
import routes from "routes.js";

import logo from "assets/img/reactlogo.png";

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/admin" to="/admin/dashboard" />
  </Switch>
);

function Admin({ match }) {
  const mainPanelRef = React.useRef(null);
  const [sidebarOpened, setSidebarOpened] = React.useState(false);
  const [backgroundColor, setBackgroundColor] = React.useState("blue");
  const [activeColor, setActiveColor] = React.useState("info");

  const handleActiveClick = (color) => {
    setActiveColor(color);
  };

  const handleBgClick = (color) => {
    setBackgroundColor(color);
  };

  const handleFixedClick = () => {
    if (document.documentElement.className.indexOf("nav-open") !== -1) {
      document.documentElement.classList.remove("nav-open");
      setSidebarOpened(false);
    } else {
      document.documentElement.classList.add("nav-open");
      setSidebarOpened(true);
    }
  };

  return (
    <div className="wrapper">
      <Sidebar
        routes={routes}
        logo={{
          outterLink: "https://www.creative-tim.com/",
          text: "Creative Tim",
          imgSrc: logo,
        }}
        toggleSidebar={handleFixedClick}
      />
      <div className="main-panel" ref={mainPanelRef} data={backgroundColor}>
        <FixedPlugin
          bgColor={backgroundColor}
          activeColor={activeColor}
          handleActiveClick={handleActiveClick}
          handleBgClick={handleBgClick}
          sidebarOpened={sidebarOpened}
          handleFixedClick={handleFixedClick}
        />
        <nav
          className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top"
          id="navigation-example"
        >
          <div className="container-fluid">
            <div className="navbar-wrapper">
              <div className="navbar-toggle">
                <button
                  type="button"
                  className="navbar-toggler"
                  onClick={handleFixedClick}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              <a className="navbar-brand" href="#pablo">
                
              </a>
            </div>
          </div>
        </nav>
        <div className="content">
          <div className="container-fluid">{switchRoutes}</div>
        </div>
        <Footer fluid />
      </div>
    </div>
  );
}

export default Admin;
