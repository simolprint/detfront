import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import AuthService from "../AuthService";

const Login = (props) => {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const handleSubmit = (event) => {
event.preventDefault();


AuthService.login(username, password)
  .then((user) => {
    // Если логин и пароль верные, перенаправляем пользователя на главную страницу
    props.history.push("/");
  })
  .catch((error) => {
    // Если логин или пароль неверные, показываем ошибку
    setError(error.message);
  });
};

return (
<Container>
<Row className="justify-content-center">
<Col md={6}>
<h2 className="text-center mb-4">Вход</h2>
<Form onSubmit={handleSubmit}>
<Form.Group controlId="formBasicUsername">
<Form.Label>Имя пользователя</Form.Label>
<Form.Control
type="text"
value={username}
onChange={(event) => setUsername(event.target.value)}
/>
</Form.Group>
<Form.Group controlId="formBasicPassword">
<Form.Label>Пароль:</Form.Label>
<Form.Control
type="password"
value={password}
onChange={(event) => setPassword(event.target.value)}
/>
</Form.Group>
<Button variant="primary" type="submit" className="mb-3" style={{marginTop: 10}}>
ВХОД
</Button>
{error && <Alert variant="danger">{error}</Alert>}
</Form>
</Col>
</Row>
</Container>
);
};

export default Login;