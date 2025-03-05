import {
  getAppoinments,
  getSearchCustomer,
} from "../controller/appointmentsAPI.js";
import { getData } from "../controller/hairdressersAPI.js";
import { digitalClock } from "../digitalClock/digitalclock.js";
import { hairdresserAdmin } from "../views/adminDashboard.js";

document.addEventListener("DOMContentLoaded", async () => {
  digitalClock.render(".clock-container");

  const ulContainer = document.createElement("ul");
  ulContainer.className = "nav flex-column name-ul-container";

  const hairdressers = await getData();

  console.log(hairdressers);
  const appointments = await getAppoinments();

  //console.log("search", appointments);

  hairdressers.forEach((hairdresser) => {
    const names = hairdresserAdmin(hairdresser);
    ulContainer.appendChild(names);
  });

  document.querySelector(".name-container").appendChild(ulContainer);
});

const searchBtn = document.querySelector("#search-btn");

searchBtn.addEventListener("click", () => {
  getSearchCustomer();
});
document.querySelector("#search").addEventListener("keydown", (event) => {
    if (event.key == "Enter")
        searchBtn.click();
});

