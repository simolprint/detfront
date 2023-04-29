import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AuthService from "../../AuthService";






function Footer() {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);


  const handleLogout = () => {
    AuthService.logout();
    history.push("/login");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const currentUser = await AuthService.getCurrentUser();
        console.log("Роль:", currentUser.role);
        setCurrentUser(currentUser);
        setIsAdmin(currentUser.role === "admin");
      } catch (err) {
        console.log(err);
        history.push("/login");
      }
    }
    fetchData();
  }, [history]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="footer">
      <Container fluid>
        <Nav className="ml-auto">
          <Nav.Item>
            {currentUser && <Nav.Link>{currentUser.role}</Nav.Link>}
          </Nav.Item>
        </Nav>
        <Nav className="mx-auto">
          <Nav.Item>
            <Nav.Link href="http://www.creative-tim.com">SIMOL APPS</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link disabled>|</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link disabled>МАХАЧКАЛА</Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="ml-auto">
          <Nav.Item>
            <Nav.Link onClick={handleLogout}>Выход</Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Footer;
