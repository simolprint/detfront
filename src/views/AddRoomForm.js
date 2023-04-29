import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomGender, setRoomGender] = useState("");
  const [numBeds, setNumBeds] = useState("");
  const [bedNumber, setBedNumber] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3001/rooms");
        setRooms(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const handleAddBed = async (roomId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/rooms/${roomId}/beds`,
        {
          bedNumber,
        }
      );
      console.log(response.data);
      const updatedRooms = rooms.map((room) => {
        if (room.id === roomId) {
          return { ...room, beds: response.data };
        }
        return room;
      });
      setRooms(updatedRooms);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!roomGender) {
      alert("Пожалуйста, выберите пол палаты");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/rooms", {
        roomNumber,
        roomType,
        roomGender,
        numBeds,
      });
      console.log(response.data);
      setRooms([...rooms, response.data]);
      handleCloseAddModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="roomNumber">
        <Form.Label>Номер палаты:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите номер палаты"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="roomType">
        <Form.Label>Тип палаты:</Form.Label>
        <Form.Control
          as="select"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          required
        >
          <option value="">--Выберите тип палаты--</option>
          <option value="Эконом">Эконом</option>
          <option value="ЭкономPlus">Эконом+</option>
          <option value="VIP">VIP</option>
          <option value="Семейный">Семейный</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="roomGender">
        <Form.Label>Пол палаты:</Form.Label>
        <Form.Control
          as="select"
          value={roomGender}
          onChange={(e) => setRoomGender(e.target.value)}
          required
        >
          <option value="">--Выберите пол палаты--</option>
          <option value="Мужской">Мужской</option>
          <option value="Женский">Женский</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="numBeds">
        <Form.Label>Количество койкомест:</Form.Label>
        <Form.Control
          type="number"
          min="1"
          placeholder="Введите количество койкомест"
          value={numBeds}
          onChange={(e) => setNumBeds(e.target.value)}
          required
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        Добавить
      </Button>
    </Form>
  );
}

export default BedsList;
