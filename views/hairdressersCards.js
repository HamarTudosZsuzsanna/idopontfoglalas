import {
  getAllTimes,
  getBookedTimes,
  sendAppointmentData,
} from "../controller/appointmentsAPI.js";

let selectedHairdresser = "";

export function createHairdresserCard(hairdresser) {
  const card = document.createElement("div");

  const servicesList = hairdresser.services
    .map((service) => `<li>${service}</li>`)
    .join("");

  card.innerHTML = `
        <div class="card-hairdresser" style="width: 18rem;">
            <div class="card-body card-body-hairdressers">
                <h4 class="card-title text-uppercase text-light fw-bold mt-3 mb-3">${
                  hairdresser.name
                }</h4>
                <h6 class="card-subtitle mb-2 text-body-secondary"><ul>${servicesList}</ul></h6>
                <p class="card-text"><a href="mailto:${
                  hairdresser.email
                }" class="text-decoration-none text-dark">${
    hairdresser.email
  }</a></p>
                <p class="card-text"><a href="tel:${
                  hairdresser.phoneNumber
                }" class="text-decoration-none text-dark">${
    hairdresser.phoneNumber
  }</a></p>
                <button class="btn btn-outline-dark mb-2 open-modal-btn" data-id="${hairdresser.getID()}">Foglalás</button>
            </div>
        </div>
    `;

  card.querySelector(".open-modal-btn").addEventListener("click", () => {
    selectedHairdresser = hairdresser;
    openModal(hairdresser);
  });

  return card;
}

let selectedDate = "";
let selectedService = "";
let selectedTime = "";
let customerName = "";
let customerPhone = "";

let nowTime = new Date()
const nowTimeGetTime = nowTime.getTime();
console.log(nowTime)
console.log("most:", nowTimeGetTime)

function openModal(hairdresser) {
  const modalTitle = document.querySelector(".modal-title");
  modalTitle.innerHTML = hairdresser.name;
  const timeContainer = document.querySelector(".time-container");

  const dateInput = document.querySelector("#date");
  dateInput.value = new Date().toISOString().split("T")[0];

  const servicesContainer = document.querySelector(".service-container");
  let errorText = document.querySelector(".error-message");

  const newDateInput = dateInput.cloneNode(true);
  dateInput.parentNode.replaceChild(newDateInput, dateInput);

  newDateInput.addEventListener("change", async () => {
    selectedDate = newDateInput.value;
    const selectedDateGetTime = new Date(selectedDate).getTime();
    console.log(selectedDateGetTime)

    errorText.textContent = "";

    if (selectedDate !== "" && selectedDateGetTime >= nowTime) {
      console.log("Kiválasztott dátum:", selectedDate);
      console.log("Fodrász ID:", hairdresser.getID());

      // időpont kiválasztása
      timeContainer.innerHTML = "";

      const allTimes = await getAllTimes(hairdresser);

      const bookedTimes = await getBookedTimes(hairdresser, selectedDate);

      if (allTimes.length === 0) {
        timeContainer.innerHTML =
          "<p>Kérlek válassz egy másik napot! Ezen a napon nincs szabad időpont.</p>";
        return;
      }

      allTimes.forEach((time) => {
        let buttonElement = document.createElement("button");
        buttonElement.className = "btn btn-dark m-1 time-btn";
        buttonElement.value = time;
        buttonElement.textContent = time;

        timeContainer.appendChild(buttonElement);

        if (bookedTimes.includes(time)) {
          buttonElement.classList.add("inactive");
        }

        buttonElement.addEventListener("click", (e) => {

          document.querySelectorAll(".time-btn").forEach((btn) => {
            btn.style.backgroundColor = "";
          });

          selectedTime = e.target.value;
          console.log("Kiválasztott időpont:", selectedTime);
          e.target.style.backgroundColor = "#ae8625";
        });
      });

      //szolgáltatás kiválasztása
      servicesContainer.innerHTML = "";

      const selectElement = document.createElement("select");
      //selectElement.value = "services";
      selectElement.id = "services";
      servicesContainer.appendChild(selectElement);

      let defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Válassz szolgáltatást";
      selectElement.appendChild(defaultOption);

      hairdresser.services.forEach((service) => {
        let optionElement = document.createElement("option");
        optionElement.value = service;
        optionElement.textContent = service;

        selectElement.appendChild(optionElement);
      });

      selectElement.addEventListener("change", (e) => {
        selectedService = e.target.value;
        console.log("Kiválasztott szolgáltatás:", selectedService);
      });
    } else {
      console.log("Régi dátum");
      errorText.textContent = "Kérlek válassz egy másik dátumot!";
    }
  });

  const customerDataButton = document.querySelector("#customer-btn");

  customerDataButton.addEventListener("click", () => {
    errorText.textContent = "";

    let hairdresserContainer = document.querySelector(".hairdresser-container");
    let customerDataDiv = document.querySelector(".customer-data");

    if (selectedDate != "" && selectedTime != "" && selectedService != "") {
      hairdresserContainer.classList.add("d-none");
      const backBtn = document.querySelector("#back-btn");
      backBtn.classList.remove("d-none");

      customerDataDiv.classList.replace("d-none", "d-flex");
      customerDataButton.classList.add("d-none");

      backBtn.addEventListener("click", () => {
        hairdresserContainer.classList.remove("d-none");
        customerDataDiv.classList.replace("d-flex", "d-none");
        customerDataButton.classList.remove("d-none");
        backBtn.classList.add("d-none");
      });
    } else {
      errorText.textContent = "Kérlek válassz időpontot / szolgáltatást!";
    }
  });

  const sendButton = document.querySelector("#send");

  sendButton.addEventListener("click", () => {
    errorText.textContent = "";

    customerName = document.querySelector("#name").value;
    customerPhone = document.querySelector("#phone").value;

    if (!customerName || !customerPhone) {
      errorText.textContent = "Minden mező kitöltése kötelező!";
      return;
    } else {
      errorText.textContent = "";
    }

    const appointmentData = {
      hairdresser_id: hairdresser.getID(),
      customer_name: customerName,
      customer_phone: customerPhone,
      appointment_date: selectedDate + " " + selectedTime,
      service: selectedService,
    };

    console.log(appointmentData);
    sendAppointmentData(appointmentData, hairdresser);
  });

  const bookingModal = new bootstrap.Modal(
    document.getElementById("bookingModal")
  );
  bookingModal.show();
}
