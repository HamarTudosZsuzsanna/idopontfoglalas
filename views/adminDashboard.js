import {
  getAllTimes,
  getcustomerData,
  getBookedTimes,
} from "../controller/appointmentsAPI.js";

let selectedAdminDate = "";
let selectedAdminTime = "";
let selectedAdminHairdresser = "";

export function hairdresserAdmin(hairdresser) {
  const liElement = document.createElement("li");
  liElement.className = "nav-item";

  liElement.innerHTML = `
            <a class="nav-link d-flex align-items-center text-light" aria-current="page" href="#" data-id="${hairdresser.getID()}">
            ${hairdresser.name} - ( ${hairdresser.getID()} )</a>
    `;

  liElement.querySelector(".nav-link").addEventListener("click", (e) => {
    selectedAdminHairdresser = hairdresser;

    hairdresserAppointmentsData(hairdresser);

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("text-warning");
      link.classList.add("text-light");
    });

    e.target.classList.add("text-warning");
    e.target.classList.remove("text-light");
  });

  return liElement;
}

let selectedAppointmenstDate = "";

function hairdresserAppointmentsData(hairdresser) {
  const dateInput = document.querySelector("#date");
  dateInput.valueAsDate = new Date();

  const timeContainer = document.querySelector(".time-container-admin");

  selectedAdminDate = dateInput.value;

  const hdName = document.querySelector(".hd-name");
  hdName.textContent = hairdresser.name;

  const newDateInput = dateInput.cloneNode(true);
  dateInput.parentNode.replaceChild(newDateInput, dateInput);

  updateTimes(hairdresser, selectedAdminDate, timeContainer);

  newDateInput.addEventListener("change", async () => {
    selectedAdminDate = newDateInput.value;
    updateTimes(hairdresser, selectedAdminDate, timeContainer);
  });
}

async function updateTimes(hairdresser, selectedDate, timeContainer) {
  if (!selectedDate) return;

  console.log("Kiválasztott dátum:", selectedDate);
  console.log("Fodrász ID:", hairdresser.getID());

  timeContainer.innerHTML = "";

  const allTimes = await getAllTimes(hairdresser);
  const bookedTimes = await getBookedTimes(hairdresser, selectedDate);

  allTimes.forEach((time) => {
    let buttonElement = document.createElement("button");
    buttonElement.className = "btn btn-success m-1 time-btn";
    buttonElement.value = time;
    buttonElement.textContent = time;

    timeContainer.appendChild(buttonElement);

    if (bookedTimes.includes(time)) {
      buttonElement.classList.add("btn-warning");
    }

    buttonElement.addEventListener("click", (e) => {
      selectedAdminTime = e.target.value;
      console.log("Kiválasztott időpont:", selectedAdminTime);
      console.log("Kiválasztott fodrász:", hairdresser);
      console.log("Kiválasztott dátum:", selectedDate);

      selectedAppointmenstDate = selectedDate + " " + selectedAdminTime + ":00";

      console.log("Kiválasztott dátum:", selectedAppointmenstDate);

      getcustomerData(hairdresser, selectedAppointmenstDate);
    });
  });
}


