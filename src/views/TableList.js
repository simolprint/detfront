import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Table,
  Modal,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import handleDelete from "./deletePatient.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import AuthService from "../AuthService";


function Patients() {
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


  const [patientsList, setPatientsList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPatientData, setEditPatientData] = useState({
    id: "",
    name: "",
    phone: "",
    gender: "",
    bedNumber: "",
    currentDate: "",
    hospitalDate: "",
    dischargeDate: "",
    patientStatus: "",
    program: "",
  });

  const [proceduresData, setProcedureData] = useState({
    id: "",
    procedure_name: "",
    procedure_time: "",
    procedure_pacient: "",
    is_busy: "",
  });

  const [patients, setPatients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);


const procedureDelete = async (patients) => {
fetch(`http://localhost:3001/procedures/procedures/${patients.name}/delete`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
});
};




  useEffect(() => {

    axios.get("http://localhost:3001/patients/patients/").then((res) => {
      setPatients(res.data);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const filteredPatients = patients.filter((patient) => {
    let matchesSearch = true;
    let matchesStatus = true;
    let matchesGender = true;
    let matchesDateRange = true;

    if (searchValue !== "") {
      matchesSearch =
        patient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        patient.phone.includes(searchValue);
    }

    if (selectedStatus !== "") {
      matchesStatus = patient.patientStatus === selectedStatus;
    }

    if (selectedGender !== "") {
      matchesGender = patient.gender === selectedGender;
    }

    if (selectedStartDate && selectedEndDate) {
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(selectedEndDate);
      const patientDate = new Date(patient.hospitalDate);

      matchesDateRange = patientDate >= startDate && patientDate <= endDate;
    }

    return matchesSearch && matchesStatus && matchesGender && matchesDateRange;
  });


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

  const handleEditModalClose = () => setShowEditModal(false);

  const handleEditModalShow = (patient) => {
    setShowEditModal(true);
    setEditPatientData({
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      gender: patient.gender,
      bedNumber: patient.bedNumber,
      currentDate: patient.currentDate,
      hospitalDate: patient.hospitalDate,
      dischargeDate: patient.dischargeDate,
      patientStatus: patient.patientStatus,
      program: patient.program,
    });
  };

  const handleEditPatientDataChange = (event) => {
    const { name, value } = event.target;
    setEditPatientData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEditPatient = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/patients/patients/${editPatientData.id}/info`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editPatientData),
        }
      );
      const data = await response.json();
      console.log(data);
      handleGetPatients(); // вызываем функцию для обновления данных пациентов
      handleEditModalClose();
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    handleGetPatients();
  }, []);



const changeBedStatus = (patients) => {
const today = new Date().toISOString().slice(0, 10);
const dischargeDate = new Date(patients.dischargeDate)
  .toISOString()
  .slice(0, 10);

if (patients.patientStatus === "Лежит" && dischargeDate !== today) {
  alert("Дата выписки не совпадает с сегодняшней датой");
  return;
}
  fetch(`http://localhost:3001/beds/beds?bedNumber=${patients.bedNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Не удалось получить информацию о койке");
      }
    })
    .then((data) => {
      const bedId = data[0].id;
      console.log(`ID койки для пациента: ${bedId}`);

      let newStatus = "Свободна";
      if (patients.patientStatus === "Бронь") {
        newStatus = "Бронь";
      } else if (patients.patientStatus === "Лежит") {
        newStatus = "Занята";
      }

      const currentBedStatus = "Занята";
      const newBedStatus =
        currentBedStatus === "Занята" ? "Свободна" : "Занята";


      fetch(`http://localhost:3001/beds/beds/${bedId}`, {
        method: "PATCH",
        body: JSON.stringify({ bedStatus: newBedStatus }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("Статус койки успешно изменен");

            const newPatientStatus =
              patients.patientStatus === "Бронь" ? "Лежит" : "Выписан";

            fetch(
              `http://localhost:3001/patients/patients/${patients.id}/status`,
              {
                method: "PATCH",
                body: JSON.stringify({ patientStatus: newPatientStatus }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            fetch(
              `http://localhost:3001/procedures/procedures/${patients.name}/delete`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
              .then((response) => {
                if (response.ok) {
                  console.log("Статус пациента успешно изменен");
                  handleGetPatients();
                } else {
                  throw new Error("Не удалось изменить статус пациента");
                }
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            throw new Error("Не удалось изменить статус койки");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
};




  return (
    <Container>
      <Form style={{ display: "flex", flexWrap: "wrap", marginBottom: 20 }}>
        <Form.Group
          controlId="formBasicSearch"
          style={{ marginRight: 20, width: "25%" }}
        >
          <Form.Label>Поиск</Form.Label>
          <Form.Control
            type="text"
            name="searchValue"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </Form.Group>
        <Form.Group
          controlId="formBasicStatus"
          style={{ marginRight: 20, width: "10%" }}
        >
          <Form.Label>Статус</Form.Label>
          <Form.Control
            as="select"
            name="selectedStatus"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="">Все</option>
            <option value="Бронь">Бронь</option>
            <option value="Лежит">Лежит</option>
            <option value="Выписан">Выписан</option>
          </Form.Control>
        </Form.Group>
        <Form.Group
          controlId="formBasicGender"
          style={{ marginRight: 20, width: "10%" }}
        >
          <Form.Label>Пол</Form.Label>
          <Form.Control
            as="select"
            name="selectedGender"
            value={selectedGender}
            onChange={handleGenderChange}
          >
            <option value="">Все</option>
            <option value="Мужской">Муж.</option>
            <option value="Женский">Жен.</option>
          </Form.Control>
        </Form.Group>
        <Form>
          <Form.Label>Диапазон дат поступления</Form.Label>
          <Form.Group
            controlId="formBasicDateRange"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <Row>
              <Col>
                <DatePicker
                  selected={selectedStartDate}
                  onChange={handleStartDateChange}
                  placeholderText="Начальная дата"
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
              </Col>
              <Col>
                <DatePicker
                  selected={selectedEndDate}
                  onChange={handleEndDateChange}
                  placeholderText="Конечная дата"
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Form>
      <h1>Список пациентов</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Номер</th>
            <th>Пол</th>
            <th>Номер койки</th>
            <th>Программа</th>
            <th>Поступление</th>
            <th>Выписка</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.phone}</td>
              <td>{patient.gender}</td>
              <td>{patient.bedNumber}</td>
              <td>{patient.program}</td>
              <td>{patient.hospitalDate}</td>
              <td>{patient.dischargeDate}</td>
              <td>{patient.patientStatus}</td>
              <td>
                {patient.patientStatus === "Лежит" && (
                  <Button
                    variant="success"
                    onClick={() => {
                      changeBedStatus(patient);
                    }}
                  >
                    Выписать
                  </Button>
                )}
                {patient.patientStatus === "Бронь" && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      changeBedStatus(patient);
                    }}
                  >
                    Уложить
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEditModalShow(patient)}
                  style={{ marginLeft: "10px" }}
                >
                  Редактировать
                </Button>{" "}
                {isAdmin && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      procedureDelete();
                      handleDelete(
                        patient,
                        patientsList,
                        setPatientsList,
                        changeBedStatus
                      );
                    }}
                    style={{ marginLeft: "10px" }}
                  >
                    Удалить
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать пациента</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={editPatientData.id}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formBasicName">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editPatientData.name}
                onChange={handleEditPatientDataChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPhone">
              <Form.Label>Номер</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={editPatientData.phone}
                onChange={handleEditPatientDataChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicGender">
              <Form.Label>Гендер</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={editPatientData.gender}
                onChange={handleEditPatientDataChange}
              >
                <option value="male">Муж.</option>
                <option value="female">Жен.</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicProgram">
              <Form.Label>Программа</Form.Label>
              <Form.Control
                as="select"
                name="program"
                value={editPatientData.program}
                onChange={handleEditPatientDataChange}
              >
                <option value="">Программа</option>
                <option value="Базовая">Базовая</option>
                <option value="Эконом">Эконом</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicBedNumber">
              <Form.Label>Койка</Form.Label>
              <Form.Control
                type="text"
                name="bedNumber"
                value={editPatientData.bedNumber}
                onChange={handleEditPatientDataChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicСurrentDate">
              <Form.Label>Дата</Form.Label>
              <Form.Control
                type="date"
                name="currentDate"
                value={editPatientData.currentDate}
                onChange={handleEditPatientDataChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicHospitalDate">
              <Form.Label>Поступление</Form.Label>
              <Form.Control
                type="date"
                name="hospitalDate"
                value={editPatientData.hospitalDate}
                onChange={handleEditPatientDataChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicDischargeDate">
              <Form.Label>Дата выписки</Form.Label>
              <Form.Control
                type="date"
                name="dischargeDate"
                value={editPatientData.dischargeDate}
                onChange={handleEditPatientDataChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPatientStatus">
              <Form.Label>Статус</Form.Label>
              <Form.Control
                as="select"
                name="patientStatus"
                value={editPatientData.patientStatus}
                onChange={handleEditPatientDataChange}
              >
                <option value="Бронь">Бронь</option>
                <option value="Лежит">Лежит</option>
                <option value="Выписан">Выписан</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleEditPatient}>
            Сохранить изменения
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Patients;