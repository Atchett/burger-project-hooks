import React, { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

const Layout = (props) => {
  const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  const sideDrawerCloseHandler = () => {
    setSideDrawerIsVisible(false);
  };

  const sideDrawerToggleHandler = () => {
    setSideDrawerIsVisible(!sideDrawerIsVisible);
  };

  return (
    <Fragment>
      <Toolbar
        isAuth={isAuthenticated}
        drawerToggleClicked={sideDrawerToggleHandler}
      />
      <SideDrawer
        isAuth={isAuthenticated}
        open={sideDrawerIsVisible}
        closed={sideDrawerCloseHandler}
      />
      <main className={classes.Content}>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
