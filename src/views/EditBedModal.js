import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditBedModal(props) {
  const [roomNumber, setRoomNumber] = useState(props.bed.roomNumber);
  const [roomType, setRoomType] = useState(props.bed.roomType);
  const [roomGender, setRoomGender] = useState(props.bed.roomGender);
  const [bedNumber, setBedNumber] = useState(props.bed.bedNumber);
  const [bedStatus, setBedStatus] = useState(props.bed.bedStatus);

  const handleSave = async () => {
   
  try {
      const response = await fetch(`http://localhost:3001/beds/beds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.bed.id,
          roomNumber,
          roomType,
          roomGender,
          bedNumber,
          bedStatus,
        }),
      });
      props.onClose();
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

const handleDelete = (bed) => {
    setTimeout(() => {
      let confirmDelete = false;
      confirmDelete = true;
      if (confirmDelete) {
        if (bed && bed.id) {
          // check if bed is defined and has an id property
          fetch(`http://localhost:3001/beds/beds/${bed.id}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (response.ok) {
                // Если койка успешно удалена, обновляем список коек на странице
                props.setBedsList(
                  props.bedsList.filter((item) => item.id !== bed.id)
                );
                alert("Койка успешно удалена");
              } else {
                throw new Error("Не удалось удалить койку");
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }
    }, 500);
};


  useEffect(() => {
    handleDelete(props.bed);
  }, [props.bed]);

  console.log("Значение roomNumber:", roomNumber);
  console.log("Значение roomType:", roomType);
  console.log("Значение roomGender:", roomGender);
  console.log("Значение bedNumber:", bedNumber);
  console.log("Значение bedStatus:", bedStatus);

  return (
    <Modal show={props.show} >
      <Modal.Header>
        <Modal.Title>Редактирование койки</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formRoomNumber">
            <Form.Label>Номер палаты</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите номер палаты"
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
              <option value="">Выберите тип палаты</option>
              <option value="Эконом">Эконом</option>
              <option value="Эконом +">Эконом +</option>
              <option value="VIP">VIP</option>
              <option value="Семейный">Семейный</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formRoomGender">
            <Form.Label>Пол палаты</Form.Label>
            <Form.Control
              as="select"
              value={roomGender}
              onChange={(e) => setRoomGender(e.target.value)}
            >
              <option value="">Выберите пол палаты</option>
              <option value="Муж.">Муж.</option>
              <option value="Жен.">Жен.</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formBedNumber">
            <Form.Label>Номер койки</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите номер койки"
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
              <option value="">Выберите статус койки</option>
              <option value="Свободна">Свободна</option>
              <option value="Занята">Занята</option>
              <option value="Бронь">Бронь</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditBedModal;
