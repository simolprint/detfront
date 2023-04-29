const handleDelete = (
  patients,
  patientsList,
  setPatientsList,
  changeBedStatus
) => {
  if (patients.patientStatus === "Лежит") {
    alert("Нельзя удалить пациента со статусом 'Лежит'");
    return;
  }

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




export default handleDelete;
