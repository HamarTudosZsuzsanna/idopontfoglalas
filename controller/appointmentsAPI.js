import { Appointments } from "../class/appointmentsClass.js";
import { Hairdressers } from "../class/HairdressersClass.js";
import { getData } from "./hairdressersAPI.js";


export async function getAppoinments() {
  const url = "https://salonsapi.prooktatas.hu/api/appointments";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Hibaüzenet: ${response.status}`);
    }

    const json = await response.json();
    /*console.log(json)*/

    return json.map(
      (ap) =>
        new Appointments(
          ap.id,
          ap.hairdresser_id,
          ap.customer_name,
          ap.customer_phone,
          ap.appointment_date,
          ap.service,
          ap.created_at
        )
    );
  } catch (error) {
    console.error(error.message);
  }
}

export async function getAllTimes(hairdresser) {
  try {
    const startHour = parseInt(hairdresser.workStart.split(":")[0]);
    const endHour = parseInt(hairdresser.workEnd.split(":")[0]);

    let allTimes = [];
    let startTime = new Date();
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, 0, 0, 0);

    while (startTime <= endTime) {
      const hour = startTime.getHours().toString().padStart(2, "0");
      const minutes = startTime.getMinutes().toString().padStart(2, "0");
      const time = `${hour}:${minutes}`;

      allTimes.push(time);

      startTime.setMinutes(startTime.getMinutes() + 30);
    }

    console.log("Összes időpontok:", allTimes);
    return allTimes;
  } catch (error) {
    console.error("Hiba az időpontok lekérésekor:", error.message);
    return [];
  }
}

export async function getBookedTimes(hairdresser, selectedDate) {
  try {
    const appointmentsData = await getAppoinments();

    console.log(
      "Kiválasztott fodrász ID:",
      hairdresser.getID(),
      typeof hairdresser.id
    );

    const bookedDate = appointmentsData.filter(
      (d) =>
        String(d.hairdresserId) === String(hairdresser.getID()) &&
        d.appointmentDate &&
        d.appointmentDate.split(" ")[0] === selectedDate
    );

    const bookedTime = bookedDate.map((t) =>
      t.appointmentDate.split(" ")[1].slice(0, 5)
    );

    console.log("Foglalt időpontok:", bookedTime);
    console.log("Foglalt dátumok:", bookedDate);

    return bookedTime;
  } catch (error) {
    console.error("Hiba a foglalások lekérésekor:", error);
    return [];
  }
}

export async function sendAppointmentData(appointmentData, hairdresser) {
  try {
    const response = await fetch(
      "https://salonsapi.prooktatas.hu/api/appointments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      }
    );

    if (!response.ok) {
      throw new Error("Hiba történt a foglalás mentésekor!");
    }

    const result = await response.json();
    const hairdresserName = hairdresser.name;

    console.log("Sikeres foglalás:", result);
    thankYouMessage(appointmentData, hairdresserName);
  } catch (error) {
    console.error("Hiba:", error);
    alert("Hiba történt a foglalás elküldésekor.");
  }
}

export function thankYouMessage(appointmentData, hairdresserName) {
  console.log("köszi");

  let customerDataDiv = document.querySelector(".customer-data");
  customerDataDiv.classList.add("display-none");

  let btnClose = document.querySelector(".btn-close");
  btnClose.classList.add("d-none");

  let modalTitle = document.querySelector(".modal-title");
  modalTitle.classList.add("d-none");
  let modalFooter = document.querySelector(".modal-footer");
  modalFooter.classList.add("d-none");

  let imgCheck = document.querySelector(".check");
  imgCheck.classList.remove("d-none");

  const template = `
        
            <div class="text-center">
                <h4 class="text-uppercase text-dark fw-bold mt-3 mb-3">Köszönjük, hogy időpontot foglaltál!</h4>
                <div class="fw-bold">Fodrász:</div>
                <div>${hairdresserName}</div>
                <div class="fw-bold">Szolgáltatás:</div>
                <div>${appointmentData.service}</div>
                <div class="fw-bold">Foglalás időpontja:</div>
                <div>${appointmentData.appointment_date}</div>
                <h3 class="fw-bold">Hamarosan találkozunk!</h3>
            </div>
    `;

  let modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = template;

  closeModal();
}

export async function getcustomerData(hairdresser, selectedAppointmenstDate) {
  try {
    const customerData = await getAppoinments();
    console.log("customerData", customerData);

    const data = customerData.filter(
      (d) =>
        String(d.hairdresserId) === String(hairdresser.getID()) &&
        d.appointmentDate === selectedAppointmenstDate
    );

    console.log("id", data);
    let dataBody = document.querySelector(".data-body");

    if (data.length === 0) {
      console.log("Nincs találat");
      dataBody.innerHTML = "";
      let freeDiv = document.createElement("div");
      freeDiv.textContent = "A kiválasztott időpontra nincs foglalás.";
      dataBody.appendChild(freeDiv);
      return;
    }

    const customer = data[0];
    const template = `
            <h3 class="text-center fw-bold">${customer.customerName}</h3>
            <h4 class="text-uppercase text-dark text-center fw-bold">${customer.service}</h4>
            <div class="text-center mt-4">
                <div>Dátum:</div>
                <div>${customer.appointmentDate}</div>
            </div>
            <div class="text-center mt-2">
                <div>Telefonszám:</div>
                <div>${customer.customerPhone}</div>
            </div>
        `;

    dataBody.innerHTML = template;

    return template;
  } catch (error) {
    console.error("Hiba a customerData lekérésekor:", error);
  }
}

export async function getSearchCustomer() {
  try {
    const customerData = await getAppoinments();
    //const hairdressers = await getData();

    const searchElement = document.querySelector("#search");
    const searchValue = searchElement.value.trim().toUpperCase();
    const searchError = document.querySelector(".search-error");

    const resultsContainer = document.querySelector("#results-container");

    searchError.textContent = "";

    const customer = customerData.filter(c =>
      c.customerName.toUpperCase().includes(searchValue)
    );

    if (customer.length === 0) {
      searchError.textContent = "Nincs megfelelő találat!";
      resultsContainer.innerHTML = "";
      return;
    }

    console.log("customer:", customer)

    const tableRows = customer.map(c => {
      
      return `
        <tr>
          <td>${c.customerName}</td>
          <td>${c.hairdresserId}</td>
          <td>${c.service}</td>
          <td>${c.appointmentDate}</td>
          <td>${c.customerPhone}</td>
        </tr>
      `;
    }).join("");

    console.log("tábla:", tableRows)

    const template = `
      <table>
        <tr>
          <th>Név</th>
          <th>Fodrász</th>
          <th>Szolgáltatás</th>
          <th>Időpont</th>
          <th>Telefonszám</th>
        </tr>
        ${tableRows}
      </table>
    `;

    resultsContainer.innerHTML = template;

  } catch (error) {
    console.error("Hiba a keresés során:", error);
  }
}




export function closeModal() {
  const bookingModalElement = document.getElementById("bookingModal");
  const bookingModal = bootstrap.Modal.getInstance(bookingModalElement);

  
  const nameInput = document.querySelector("#name");
  const phoneInput = document.querySelector("#phone");

  if (nameInput) nameInput.value = "";
  if (phoneInput) phoneInput.value = "";

  setTimeout(() => {
    bookingModal.hide();
  }, 3000);
}



