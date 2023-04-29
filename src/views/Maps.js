//Номера и койки

import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import EditBedModal from "./EditBedModal";
import AuthService from "../AuthService";
import axios from "axios";

function Beds() {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomGender, setRoomGender] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [bedsList, setBedsList] = useState([]);
  const [bedStatus, setBedStatus] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBed, setEditBed] = useState(null);

     const currentUser = AuthService.getCurrentUser();

     const [isAdmin, setIsAdmin] = useState(false);

     useEffect(() => {
       async function fetchData() {
         try {
           const currentUser = await AuthService.getCurrentUser();
           console.log("Текущий пользователь:", currentUser);
           console.log("Роль:", currentUser.role);
           setIsAdmin(currentUser.role === "admin");
         } catch (err) {
           console.log(err);
         }
       }
       fetchData();
     }, []);



  const handleAddBed = async () => {
    const errors = validateFields();

 
    if (Object.keys(errors).length > 0) {
      // Если есть ошибки валидации, отображаем их пользователю
      console.log(errors);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/beds/beds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomNumber,
          roomType,
          roomGender,
          bedNumber,
          bedStatus,
        }),
      });
      const data = await response.json();
      console.log(data);
      setBedsList([
        ...bedsList,
        { roomNumber, roomType, roomGender, bedNumber, bedStatus },
      ]);
    } catch (err) {
      console.log(err);
    }
  };


  const handleGetBeds = async () => {
    try {
      const response = await fetch("http://localhost:3001/beds/beds");
      const data = await response.json();
      console.log(data);
      setBedsList(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setShowEditModal(false);
  };


  const handleDelete = (bed) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить койку ?"
    );
    if (confirmDelete) {
      fetch(`http://localhost:3001/beds/beds/${bed.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Если койка успешно удалена, обновляем список коек на странице
            setBedsList(bedsList.filter((item) => item.id !== bed.id));
            alert("Койка успешно удалена");
          } else {
            throw new Error("Не удалось удалить койку");
          }
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        });
    }
  };

const handleEdit = (bed) => {
  axios.get(`http://localhost:3001/beds/beds/`).then((response) => {
    const foundBed = response.data.find((b) => b.id === bed.id);
    if (foundBed.bedStatus === "Занята") {
      alert("Нельзя редактировать койку пока она занята");
    } else {
      setEditBed(bed);
      setShowEditModal(true);
    }
  });
};
  useEffect(() => {
    handleGetBeds();
  }, []);


  const validateFields = () => {
    const errors = {};

    if (!roomNumber.trim()) {
      errors.roomNumber = "Поле обязательно для заполнения";
      alert ("Заполните все поля")
    }

    if (!roomType) {
      errors.roomType = "Поле обязательно для заполнения";
      alert("Заполните все поля");
    }

    if (!roomGender) {
      errors.roomGender = "Поле обязательно для заполнения";
      alert("Заполните все поля");
    }

    if (!bedNumber.trim()) {
      errors.bedNumber = "Поле обязательно для заполнения";
      alert("Заполните все поля");
    }

    if (!bedStatus) {
      errors.bedStatus = "Поле обязательно для заполнения";
      alert("Заполните все поля");
    }

    return errors;
  };




  return (
    <Container>
      <Form>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Form.Group
            controlId="formRoomNumber"
            style={{ marginRight: "10px" }}
          >
            <Form.Label>Номер палаты</Form.Label>
            <Form.Control
              type="text"
              placeholder="Номер палаты"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formRoomType">
            <Form.Label>Тип палаты</Form.Label>
            <Form.Control
              as="select"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="">Тип палаты</option>
              <option value="Стандарт">Стандарт</option>
              <option value="Полулюкс">Полулюкс</option>
              <option value="Люкс">Люкс</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formRoomGender">
            <Form.Label>Пол палаты</Form.Label>
            <Form.Control
              as="select"
              value={roomGender}
              onChange={(e) => setRoomGender(e.target.value)}
            >
              <option value="">Гендер</option>
              <option value="Муж.">Муж.</option>
              <option value="Жен.">Жен.</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formBedNumber" style={{ marginRight: "10px" }}>
            <Form.Label>Номер койки</Form.Label>
            <Form.Control
              type="text"
              placeholder="Номер койки"
              value={bedNumber}
              onChange={(e) => setBedNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBedStatus">
            <Form.Label>Статус койки</Form.Label>
            <Form.Control
              as="select"
              value={bedStatus}
              onChange={(e) => setBedStatus(e.target.value)}
            >
              <option value="">Cтатус койки</option>
              <option value="Свободна">Свободна</option>
              <option value="Занята">Занята</option>
              <option value="Бронь">Бронь</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" onClick={handleAddBed}>
            Добавить койку
          </Button>
        </div>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Номер палаты</th>
            <th>Тип палаты</th>
            <th>Пол</th>
            <th>Номер койки</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {bedsList.map((bed) => (
            <tr key={bed.id}>
              <td>{bed.roomNumber}</td>
              <td>{bed.roomType}</td>
              <td>{bed.roomGender}</td>
              <td>{bed.bedNumber}</td>
              <td>{bed.bedStatus}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(bed)}>
                  Редактировать
                </Button>{" "}
                {isAdmin && (
                  <Button variant="danger" onClick={() => handleDelete(bed)}>
                    Удалить
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {editBed && (
        <EditBedModal
          onClose={handleClose}
          bed={editBed}
          show={showEditModal}
          onBedUpdated={() => handleBedUpdated(selectedBed)}
          onHide={() => setShowEditModal(false)}
          onEdit={() => handleGetBeds()}
        />
      )}
    </Container>
  );
}
export default Beds;