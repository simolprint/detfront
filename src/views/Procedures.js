import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

function ProcedureWindows() {
  const [procedureRooms, setProcedureRooms] = useState([]);
  const [procedureWindows, setProcedureWindows] = useState([]);

  useEffect(() => {
    handleGetProcedureWindows();
  }, []);

  const handleGetProcedureRooms = () => {
    axios
      .get("http://localhost:3001/procedurerooms/procedurerooms")
      .then((response) => {
        console.log("Список процедурных кабинетов получен", response.data);
        setProcedureRooms(response.data);
      })
      .catch((error) => {
        console.error(
          "Не удалось получить список процедурных кабинетов",
          error
        );
      });
  };

  const handleGetProcedureWindows = () => {
    axios
      .get("http://localhost:3001/procedures/procedures")
      .then((response) => {
        console.log("Список временных окон получен", response.data);
        setProcedureWindows(response.data);
      })
      .catch((error) => {
        console.error("Не удалось получить список временных окон", error);
      });
  };


const handleCreateProcedureWindows = async () => {
  const shouldCreateWindows = window.confirm(
    "Вы уверены, что хотите создать новые временные окна?"
  );

  if (shouldCreateWindows) {
    const newProcedureWindows = [];

    for (const procedureRoom of procedureRooms) {
      const startTime = new Date(`01/01/2000 ${procedureRoom.start_time}`);
      const endTime = new Date(`01/01/2000 ${procedureRoom.end_time}`);
      const timePerPatient = parseInt(procedureRoom.time_per_patient, 10);
      const capacity = parseInt(procedureRoom.capacity, 10);

      for (let i = 0; i < capacity; i++) {
        let procedureWindowId = i + 1;
        let procedureTime = new Date(startTime);

        while (procedureTime <= endTime) {
          if (
            procedureTime >= startTime &&
            procedureTime <= new Date(endTime - timePerPatient * 60000)
          ) {
            const procedureWindow = {
              id: procedureWindowId,
              procedure_name: procedureRoom.name,
              procedure_time: procedureTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              is_busy: 0,
            };
            newProcedureWindows.push(procedureWindow);
            try {
              await axios.post(
                "http://localhost:3001/procedures/procedures",
                procedureWindow
              );
              console.log(
                `Временное окно ${procedureWindow.procedure_name} в ${procedureWindow.procedure_time} успешно добавлено`
              );
            } catch (error) {
              console.error(
                `Не удалось добавить временное окно ${procedureWindow.procedure_name} в ${procedureWindow.procedure_time}`,
                error
              );
            }
          }
          procedureTime.setTime(
            procedureTime.getTime() + timePerPatient * 60000
          );
          procedureWindowId += capacity;
        }
      }
    }
    setProcedureWindows(newProcedureWindows);
  }
};


  return (
    <div>
      <h1>Временные окна процедур</h1>
      <Button variant="primary" onClick={handleGetProcedureRooms}>
        Получить список процедурных кабинетов
      </Button>{" "}
      <Button variant="primary" onClick={handleGetProcedureWindows}>
        Получить список временных окон
      </Button>{" "}
      <Button variant="error" onClick={handleCreateProcedureWindows}>
        Создать временные окна
      </Button>{" "}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Имя пациента</th>
            <th>Название процедуры</th>
            <th>Время процедуры</th>
            <th>Занято/свободно</th>
          </tr>
        </thead>
        <tbody>
          {procedureWindows.map((procedureWindow) => (
            <tr key={procedureWindow.id}>
              <td>{procedureWindow.procedure_pacient}</td>
              <td>{procedureWindow.procedure_name}</td>
              <td>{procedureWindow.procedure_time}</td>
              <td>{procedureWindow.is_busy ? "Занято" : "Свободно"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ProcedureWindows;
