import React from "react";
import { useHistory } from "react-router-dom";
import AuthService from "../AuthService.js";

function Logout() {
  const history = useHistory();

  const handleLogout = () => {
    console.log("Logging out...");
    AuthService.logout();
    console.log("Logout successful.");
    history.push("/login");
  };

  return <button onClick={handleLogout}>Выход</button>;
}

export default Logout;
