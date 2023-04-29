import { useState } from "react";
import { Form, Button } from "react-bootstrap";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Неправильное имя пользователя или пароль");
        }
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <Form onSubmit={handleLogin}>
      <Form.Group controlId="formBasicUsername">
        <Form.Label>Имя пользователя:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Пароль:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      {error && <p>{error}</p>}
      <Button variant="primary" type="submit">
        Войти
      </Button>
    </Form>
  );
}

export default Login;
