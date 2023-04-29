//номер

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AuthService from "../AuthService";

function Beds() {
  const [bedsList, setBedsList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const currentUser = await AuthService.getCurrentUser();
        console.log("Текущий пользователь:", currentUser);
        console.log("Роль:", currentUser.role);
        setIsAdmin(currentUser.role === "admin");
        const response = await fetch("http://localhost:3001/beds/beds");
        const data = await response.json();
        console.log(data);
        setBedsList(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const getBedColor = (bedStatus) => {
    if (bedStatus === "Бронь") {
      return "warning";
    } else if (bedStatus === "Занята") {
      return "danger";
    } else {
      return "success";
    }
  };

  // Группировка койек по номеру палаты
  const groupedBeds = bedsList.reduce((acc, bed) => {
    const roomNumber = bed.roomNumber;
    if (!acc[roomNumber]) {
      acc[roomNumber] = [bed];
    } else {
      acc[roomNumber].push(bed);
    }
    return acc;
  }, {});

  return (
    <Container>
      <Row>
        {Object.entries(groupedBeds).map(([roomNumber, beds]) => (
          // Создание карточки для каждой палаты
          <Col xs={10} md={3} lg={3} key={roomNumber}>
            <Card className="mb-3">
              <Card.Header>
                Палата {roomNumber} ({beds[0].roomType}) - {beds[0].roomGender}
              </Card.Header>
              <Card.Body>
                {beds.map((bed) => (
                  // Создание койки для каждой карточки
                  <div key={bed.id} className="mb-2">
                    <Card.Title>Койка {bed.bedNumber}</Card.Title>

                    <Card.Text>
                      Статус:{" "}
                      <span className={`text-${getBedColor(bed.bedStatus)}`}>
                        {bed.bedStatus}
                      </span>
                    </Card.Text>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Beds;
