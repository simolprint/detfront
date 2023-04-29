import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Table, Button, Modal, Row, Form, Col } from "react-bootstrap";

import ReactToPrint from "react-to-print";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [availableTherapyWindows, setAvailableTherapyWindows] = useState([]);
  const [availableMassageWindows, setAvailableMassageWindows] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);

  const [proceduresData, setProceduresData] = useState([]);



useEffect(() => {
  axios
    .get("http://localhost:3001/patients/patients")
    .then((response) => {
      const filteredPatients = response.data.filter(
        (patient) => patient.patientStatus === "Лежит"
      );
      setPatients(filteredPatients);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);


const handleViewWindows = async (patient) => {
  setSelectedPatient(patient);
  try {
    const response = await axios.get(
      "http://localhost:3001/procedures/procedures"
    );
    const filteredData = response.data.filter((p) => p.is_busy === 0);
    if (patient.gender === "Муж.") {
      if (patient.program === "Базовая") {
        setAvailableTherapyWindows(
          filteredData.filter((p) => p.procedure_name === "Физиотерапия")
        );
        setAvailableMassageWindows(
          filteredData.filter((p) => p.procedure_name === "Массаж")
        );
      } else if (patient.program === "Эконом") {
        setAvailableTherapyWindows(
          filteredData.filter((p) => p.procedure_name === "Физиотерапия")
        );
        setAvailableMassageWindows([]);
      }
    } else if (patient.gender === "Жен.") {
      if (patient.program === "Базовая") {
        setAvailableTherapyWindows(
          filteredData.filter((p) => p.procedure_name === "ФизиотерапияЖ")
        );
        setAvailableMassageWindows(
          filteredData.filter((p) => p.procedure_name === "МассажЖ")
        );
      } else if (patient.program === "Эконом") {
        setAvailableTherapyWindows(
          filteredData.filter((p) => p.procedure_name === "ФизиотерапияЖ")
        );
        setAvailableMassageWindows([]);
      }
    }
  } catch (error) {
    console.error(error);
  }
  setModalShow(true);
};


const handleViewPrint = async (patient) => {
  setSelectedPatient(patient);
  setModalShow2(true);
  printText(patient);
};


const printText = async (patient) => {
  const response = await axios.get(
    `http://localhost:3001/procedures/procedures/${patient.name}/windows`
  );

  const data = response.data.windows.map((item) => ({
    procedure_name: item.procedure_name,
    procedure_time: item.procedure_time,
  }));

  setProceduresData(data);
};




const handleSchedule = () => {
  if (selectedProcedure) {
    const selectedWindows = document.querySelectorAll(
      'input[name="procedure"]:checked'
    );
    const procedureId = selectedProcedure.id;
    const patientId = selectedPatient.id;
    const procedureName = selectedProcedure.procedure_name;

    selectedWindows.forEach((window) => {
      const windowId = window.id;
      axios.post(
        `http://localhost:3001/procedures/procedures/${windowId}/status`,
        {
          procedure_id: procedureId,
          procedure_pacient: selectedPatient.name, // измененный код
          is_busy: 1, // измененный код
        }
      );
    });
    setModalShow(false);
  }
};

  const handleProcedureChange = (procedure) => {
    setSelectedProcedure(procedure);
  };

  function printDiv(divName) {
  var printContents = document.getElementById(divName).innerHTML;
  var originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print();

  document.body.innerHTML = originalContents;
}

  return (
    <div>
      <h1>Пациенты которые лежат</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Имя</th>
            <th>Гендер</th>
            <th>Номер</th>
            <th>Назначение и печать</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.gender}</td>
              <td>{patient.phone}</td>
              <td>
                <Button onClick={() => handleViewWindows(patient)}>
                  Назначить процедуру
                </Button>

                <Button onClick={() => handleViewPrint(patient)}>Распечатать</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedPatient && (
        <Modal show={modalShow} onHide={() => setModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              Время процедур для {selectedPatient.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <div className="col-md-6">
                <h4>Физиотерапия</h4>
                <Form>
                  {availableTherapyWindows.map((procedure) => (
                    <Form.Check
                      type="radio"
                      label={`${procedure.procedure_name} - ${procedure.procedure_time}`}
                      name="procedure"
                      key={procedure.id}
                      id={procedure.id}
                      onChange={() => handleProcedureChange(procedure)}
                    />
                  ))}
                </Form>
              </div>
              <div className="col-md-6">
                <h4>Массаж</h4>
                <Form>
                  {availableMassageWindows.map((procedure) => (
                    <Form.Check
                      type="radio"
                      label={`${procedure.procedure_name} - ${procedure.procedure_time}`}
                      name="procedure"
                      key={procedure.id}
                      id={procedure.id}
                      onChange={() => handleProcedureChange(procedure)}
                    />
                  ))}
                </Form>
              </div>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalShow(false)}>
              Закрыть
            </Button>
            <Button
              variant="primary"
              onClick={handleSchedule}
              disabled={!selectedProcedure}
            >
              Назначить
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {selectedPatient && (
        <Modal show={modalShow2} onHide={() => setModalShow2(false)}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Row>
              <div id="printDiv">
                <Col style={{ marginLeft: 30 }}>
                  <h3 style={{ textAlign: "center" }}>
                    {selectedPatient.name}
                  </h3>
                  <div>
                    <h4>Добро пожаловать в наш центр для детокс-очищения.</h4>
                    <p>
                      Наша команда состоит из высококвалифицированных
                      специалистов, которые предоставят вам лучшее качество
                      медицинского обслуживания и поддержки во время вашего
                      пребывания в нашем центре. Наша главная цель - помочь вам
                      очистить свой организм от вредных веществ и помочь вам
                      начать путь к здоровому образу жизни.
                    </p>
                    <p>
                      Мы убедительно просим вас сотрудничать с нашей командой,
                      чтобы достичь максимального результата. Мы будем учитывать
                      ваши индивидуальные потребности и предоставлять вам
                      индивидуальный подход.
                    </p>
                    <p>
                      Если у вас есть какие-либо вопросы или требуется
                      дополнительная информация, не стесняйтесь обращаться к
                      нашему персоналу в любое время дня или ночи.
                    </p>
                    <p>
                      Еще раз, добро пожаловать в наш центр для детокс-очищения.
                      Мы надеемся, что ваше пребывание у нас будет позитивным и
                      результативным.
                    </p>
                    <p>С уважением, центр очищения "Detox"</p>
                    <p></p>

                    <p>
                      <p>Время ваших процедур:</p>
                      <div>
                        Лечебная физическая культура - в любое удобное для вас
                        время
                      </div>
                      {proceduresData.map((item) => (
                        <div>
                          {item.procedure_name} - {item.procedure_time}
                        </div>
                      ))}
                    </p>
                  </div>
                </Col>
              </div>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalShow2(false)}>
              Закрыть
            </Button>
            <Button onClick={() => printDiv("printDiv")}>Отправить на печать</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default PatientList;
