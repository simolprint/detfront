export const changeBedStatus = (patients) => {
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

      fetch(`http://localhost:3001/beds/beds/${bedId}`, {
        method: "PATCH",
        body: JSON.stringify({ bedStatus: newStatus }),
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
