import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Button, Row, Col } from "react-bootstrap";

function ProcedureRooms() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    start_time: "",
    end_time: "",
    capacity: "",
    time_per_patient: "",
    num_windows: "",
    progender: "",
    dostupno: "",
  });

  async function getRooms() {
    try {
      const response = await axios.get(
        "http://localhost:3001/procedurerooms/procedurerooms"
      );
      setRooms(response.data);
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    getRooms();
  }, []);

  async function generateWindows(roomId) {
    try {
      const response = await axios.post(
        `http://localhost:3001/procedures/procedures/1`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const updatedRooms = rooms.map((room) => {
          if (room._id === roomId) {
            return { ...room, windows: response.data };
          }
          return room;
        });
        setRooms(updatedRooms);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/procedurerooms/procedurerooms",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const newRoom = { ...formData, _id: response.data };
        setRooms((prevRooms) => [...prevRooms, newRoom]);
        setFormData({
          name: "",
          start_time: "",
          end_time: "",
          capacity: "",
          time_per_patient: "",
          num_windows: "",
          progender: "",
          dostupno: "",
        });
        alert("Процедурный кабинет добавлен!");
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div>
      <h2>Процедурные кабинеты</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Название</th>
            <th>Начало работы</th>
            <th>Конец работы</th>
            <th>Вместимость</th>
            <th>Время на одного пациента (в минутах)</th>
            <th>Гендер</th>
            <th>Доступно</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={index}>
              <td>{room.name}</td>
              <td>{room.start_time}</td>
              <td>{room.end_time}</td>
              <td>{room.capacity}</td>
              <td>{room.time_per_patient}</td>
              <td>{room.progender}</td>
              <td>{room.dostupno}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="formName">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите название"
                value={formData.name}
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    name: event.target.value,
                  }))
                }
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formStartTime">
              <Form.Label>Начало работы</Form.Label>
              <Form.Control
                type="time"
                placeholder="Выберите время"
                value={formData.start_time}
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    start_time: event.target.value,
                  }))
                }
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formEndTime">
              <Form.Label>Конец работы</Form.Label>
              <Form.Control
                type="time"
                placeholder="Выберите время"
                value={formData.end_time}
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    end_time: event.target.value,
                  }))
                }
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formCapacity">
              <Form.Label>Вместимость</Form.Label>
              <Form.Control
                type="number"
                min="1"
                placeholder="Введите число"
                value={formData.capacity}
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    capacity: event.target.value,
                  }))
                }
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formTimePerPatient">
              <Form.Label>Время на одного</Form.Label>
              <Form.Control
                type="number"
                min="1"
                placeholder="Введите число"
                value={formData.time_per_patient}
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    time_per_patient: event.target.value,
                  }))
                }
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formProgender">
              <Form.Label>Гендер</Form.Label>
              <Form.Control
                as="select"
                value={formData.progender}
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    progender: event.target.value,
                  }))
                }
                required
              >
                <option value="">Гендер</option>
                <option value="Муж.кабинет">Муж.кабинет</option>
                <option value="Жен.кабинет">Жен.кабинет</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formDostupno">
              <Form.Label>Доступно</Form.Label>
              <Form.Control
                as="select"
                value={formData.dostupno}
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    dostupno: event.target.value,
                  }))
                }
                required
              >
                <option value="">Доступно</option>
                <option value="Только_базовая">Только_базовая</option>
                <option value="Всем">Всем</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit">Добавить</Button>
      </Form>
    </div>
  );
}
export default ProcedureRooms;
