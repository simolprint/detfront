import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import axios from "axios";

function Patients() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [hospitalDate, setHospitalDate] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [patientStatus, setPatientStatus] = useState("");
  const [program, setProgram] = useState("");
  const [isCheck, setIsCheck] = useState(false);

  const [patientsList, setPatientsList] = useState([]);
  const [beds, setBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState("");

  const [currentDate, setCurrentDate] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  const handleCheck = async (e) => {
    e.preventDefault();
    const errors = validateFields();
    if (errors.length) {
      // handle errors here
    } else {
      setIsCheck(true);
      await handleGetFilteredPatients();
      // handle success here
    }
  };

  const handleGetFilteredPatients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/patients/patients"
      );
      const patients = response.data;

      const filteredPatients = patients.filter((patient) => {
        const patientHospitalDate = new Date(patient.hospitalDate);
        const patientDischargeDate = new Date(patient.dischargeDate);
        const startDate = new Date(hospitalDate);
        const endDate = new Date(dischargeDate);
        return (
          (patientHospitalDate >= startDate &&
            patientHospitalDate <= endDate) ||
          (patientDischargeDate >= startDate && patientDischargeDate <= endDate)
        );
      });

      console.log(filteredPatients);
      setFilteredPatients(filteredPatients);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetFilteredPatients();
  }, []);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setCurrentDate(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/beds/beds")
      .then((response) => response.json())
      .then((data) => setBeds(data));
  }, []);

  const filteredBeds = beds.filter((bed) => {
    if (bedNumber && bed.bedNumber !== bedNumber) {
      return false;
    }

    if (gender && bed.roomGender !== gender) {
      return false;
    }

    if (bed.bedStatus !== "Свободна") {
      return false;
    }

    // Проверяем, есть ли уже пациент на этой койке в списке filteredPatients
    if (
      filteredPatients.some((patient) => patient.bedNumber === bed.bedNumber)
    ) {
      return false;
    }

    return true;
  });

  const handleSubmit = () => {
    fetch(`http://localhost:3001/beds/beds/${selectedBed}`, {
      method: "PATCH",
      body: JSON.stringify({ bedStatus: "Занята" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Статус койки успешно изменен");
        } else {
          throw new Error("Не удалось изменить статус койки");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleBedSelect = (e) => {
    setSelectedBed(e.target.value);
    console.log("Выбрана койка с id", e.target.value);
  };

const handleAddPatients = async (e) => {
  const errors = validateFields();
  e.preventDefault();
  try {
    const bed = filteredBeds.find((bed) => bed.id === parseInt(selectedBed));
    setBedNumber(bed.bedNumber);
    const response = await fetch("http://localhost:3001/patients/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        gender,
        bedNumber: bed.bedNumber,
        currentDate,
        hospitalDate,
        dischargeDate,
        patientStatus,
        program
      }),
    });
    const data = await response.json();
    console.log(data);
    setPatientsList([
      ...patientsList,
      {
        name,
        phone,
        gender,
        bedNumber: bed.bedNumber,
        currentDate,
        hospitalDate,
        dischargeDate,
        patientStatus,
        program,
      },
    ]);
    alert("Пациент успешно добавлен!");
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
};




  const handleGetPatients = async () => {
    try {
      const response = await fetch("http://localhost:3001/patients/patients");
      const data = await response.json();
      console.log(data);
      setPatientsList(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetPatients();
  }, []);

  const validateFields = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Поле обязательно для заполнения";
      alert("Заполните все поля");
    }

    if (!phone) {
      errors.phone = "Поле обязательно для заполнения";
      alert("Заполните все поля");
    }

    if (!gender) {
      errors.gender = "Поле обязательно для заполнения";
      alert("Заполните все поля");
    }

    if (!currentDate) {
      errors.currentDate = "Поле обязательно для заполнения";
      alert("Заполните все поля");
    }

    if (!hospitalDate) {
      errors.hospitalDate = "Поле обязательно для заполнения";
      alert("Заполните все поля");
    }

    if (!dischargeDate) {
      errors.dischargeDate = "Поле обязательно для заполнения";
      alert("Заполните все поля");
    }

    if (!patientStatus) {
      errors.patientStatus = "Поле обязательно для заполнения";
      alert("Заполните все поля");
    }

     if (!program) {
       errors.program = "Поле обязательно для заполнения";
       alert("Заполните все поля");
     }

    return errors;
  };

  return (
    <Container style={{ display: "flex", flexDirection: "column" }}>
      <Container
        style={{ flexDirection: "row", display: "flex", marginBottom: 20 }}
      >
        <Form onSubmit={handleSubmit} style={{ width: "50%", marginRight: 20 }}>
          <Form.Group controlId="formName">
            <Form.Label>Имя</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Номер</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите номер"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formGender">
            <Form.Label>Пол</Form.Label>
            <Form.Control
              as="select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Пол</option>
              <option value="Муж.">Муж.</option>
              <option value="Жен.">Жен.</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formProgram">
            <Form.Label>Программа</Form.Label>
            <Form.Control
              as="select"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            >
              <option value="">Программа</option>
              <option value="Базовая">Базовая</option>
              <option value="Эконом">Эконом</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formPatientStatus">
            <Form.Label>Статус пациента</Form.Label>
            <Form.Control
              as="select"
              value={patientStatus}
              onChange={(e) => setPatientStatus(e.target.value)}
            >
              <option value="">Выберите статус пациента</option>
              <option value="Бронь">Бронь</option>
              <option value="Лежит">Лежит</option>
              <option value="Выписан">Выписан</option>
            </Form.Control>
          </Form.Group>
        </Form>

        <Form onSubmit={handleSubmit} style={{ width: "50%" }}>
          <Form.Group controlId="formCurrentDate">
            <Form.Label>Текущая дата</Form.Label>
            <Form.Control
              type="date"
              placeholder="Выберите дату"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formHospitalDate">
            <Form.Label>Дата поступления</Form.Label>
            <Form.Control
              type="date"
              value={hospitalDate}
              onChange={(e) => setHospitalDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDischargeDate">
            <Form.Label>Дата выписки</Form.Label>
            <Form.Control
              type="date"
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
            />
          </Form.Group>
          <Form style={{ marginTop: 20 }}>
            {isCheck && (
              <Button
                variant="primary"
                type="submit"
                onClick={handleAddPatients}
              >
                Добавить
              </Button>
            )}
            <Button variant="primary" type="button" onClick={handleCheck}>
              Проверить
            </Button>
          </Form>
        </Form>
      </Container>
      <Container>
        <Form style={{ width: "100%" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Номер койки</th>
                <th>Номер палаты</th>
                <th>Гендер</th>
                <th>Тип койки</th>
                <th>Статус койки</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeds.map((bed) => (
                <tr key={bed.id}>
                  <td>{bed.bedNumber}</td>
                  <td>{bed.roomNumber}</td>
                  <td>{bed.roomGender}</td>
                  <td>{bed.roomType}</td>
                  <td>{bed.bedStatus}</td>
                  <td></td>
                  <Form.Check
                    type="radio"
                    name="bedSelect"
                    value={bed.id}
                    onChange={handleBedSelect}
                  />
                </tr>
              ))}
            </tbody>
          </Table>
        </Form>
      </Container>
    </Container>
  );
}

export default Patients;
