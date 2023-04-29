import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditPatientModal({ patient, show, handleClose, handleSave }) {
  const [name, setName] = useState(patient.name);
  const [phone, setPhone] = useState(patient.phone);
  const [gender, setGender] = useState(patient.gender);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSave({ id: patient.id, name, phone, gender });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Редактирование пациента</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Имя</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите имя пациента"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Номер телефона</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите номер телефона пациента"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formGender">
            <Form.Label>Пол</Form.Label>
            <Form.Control
              as="select"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
            >
              <option value="Мужской">Мужской</option>
              <option value="Женский">Женский</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Сохранить
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditPatientModal;
