import { useEffect, useState } from "react";
import React from "react";
import ChartistGraph from "react-chartist";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function Dashboard() {

  const [patientsList, setPatientsList] = useState([]);
  const [bookedList, setBookedList] = useState([]);
  const [admittedList, setAdmittedList] = useState([]);

    const [patients, setPatients] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3001/patients/patients"
          );
          setPatients(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, []);

  const dischargedPatients = patients.filter(
    (patient) => patient.patientStatus === "Выписан"
  );
  const bookedPatients = patients.filter(
    (patient) => patient.patientStatus === "Бронь"
  );
  const hospitalizedPatients = patients.filter(
    (patient) => patient.patientStatus === "Лежит"
  );


  const dischargedPatientsCount = dischargedPatients.length;
  const bookedPatientsCount = bookedPatients.length;
  const hospitalizedPatientsCount = hospitalizedPatients.length;


  const [date, setDate] = useState(new Date());

  const onChange = (date) => {
    setDate(date);
  };


  const handleGetPatients = async () => {
    try {
      const response = await fetch("http://localhost:3001/patients/patients");
      const data = await response.json();
      console.log(data);

      const bookedList = [];
      const admittedList = [];

      // Фильтруем пациентов по дате госпитализации и выписки
      const today = new Date().setHours(0, 0, 0, 0);
      data.forEach((patient) => {
        const hospitalDate = new Date(patient.hospitalDate).setHours(
          0,
          0,
          0,
          0
        );
        const dischargeDate = new Date(patient.dischargeDate).setHours(
          0,
          0,
          0,
          0
        );
        if (patient.patientStatus === "Бронь" && hospitalDate === today) {
          bookedList.push(patient);
        } else if (
          patient.patientStatus === "Лежит" &&
          dischargeDate === today
        ) {
          admittedList.push(patient);
        }
      });

      setBookedList(bookedList);
      setAdmittedList(admittedList);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (patients) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить пациента ?"
    );
    if (confirmDelete) {
      fetch(`http://localhost:3001/patients/patients/${patients.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Если койка успешно удалена, обновляем список коек на странице
            setPatientsList(
              patientsList.filter((item) => item.id !== patients.id)
            );
            alert("Пациент успешно удален");

            // Если статус пациента "Лежит", то изменяем статус койки на "Свободна"
            if (patients.patientStatus === "Лежит") {
              changeBedStatus(patients);
            }
          } else {
            throw new Error("Не удалось удалить пациента");
          }
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        });
    }
  };

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


  useEffect(() => {
    handleGetPatients();
  }, []);


  const [beds, setBeds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/beds/beds");
        const data = await response.json();
        setBeds(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const chartData = {
  
    series: [
      beds.filter((bed) => bed.bedStatus === "Свободна").length,
      beds.filter((bed) => bed.bedStatus === "Занята").length,
      beds.filter((bed) => bed.bedStatus === "Бронь").length,
    ],
  };

  const chartOptions = {};

  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-air-baloon text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Должны поступить</p>
                      <Card.Title as="h4">{bookedPatientsCount}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-refresh-02 text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Лежит</p>
                      <Card.Title as="h4">
                        {hospitalizedPatientsCount}
                      </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Выписаны</p>
                      <Card.Title as="h4">{dischargedPatientsCount}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h4>Должны сегодня поступить</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: "35%" }}>Имя</th>
                      <th style={{ width: "15%" }}>Номер</th>
                      <th style={{ width: "8%" }}>Койка</th>
                      <th style={{ width: "10%" }}>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookedList.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.name}</td>
                        <td>{patient.phone}</td>
                        <td>{patient.bedNumber}</td>
                        <td>{patient.patientStatus}</td>
                        <td>
                          <Button
                            variant="primary"
                            style={{ marginRight: "15px" }}
                            onClick={() => {
                              changeBedStatus(patient);
                            }}
                          >
                            Уложить
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              handleDelete(patient);
                            }}
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <h4>Должны сегодня выписаться</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: "35%" }}>Имя</th>
                      <th style={{ width: "15%" }}>Номер</th>
                      <th style={{ width: "8%" }}>Койка</th>
                      <th style={{ width: "10%" }}>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admittedList.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.name}</td>
                        <td>{patient.phone}</td>
                        <td>{patient.bedNumber}</td>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col
            md="4"
            className="d-flex justify-content-center align-items-center"
          >
            <Card>
              <Card.Header>
                <Card.Title as="h4">Статус и количество коек</Card.Title>
              </Card.Header>
              <Card.Body>
                <div
                  className="ct-chart ct-perfect-fourth"
                  id="chartPreferences"
                >
                  <ChartistGraph
                    data={chartData}
                    options={chartOptions}
                    type="Pie"
                  />
                </div>
                <div className="legend">
                  <i className="fas fa-circle text-info"></i>
                  Свободна <i className="fas fa-circle text-danger"></i>
                  Занята <i className="fas fa-circle text-warning"></i>
                  Бронь
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Календарь</Card.Title>
              </Card.Header>
              <Card.Body className="d-flex justify-content-center align-items-center">
                <div
                  className="ct-chart ct-perfect-fourth"
                  id="chartPreferences"
                >
                  <Calendar onChange={onChange} value={date} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
