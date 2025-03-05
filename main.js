import { getAppoinments } from "./controller/appointmentsAPI.js";
import { getData } from "./controller/hairdressersAPI.js";
import { createHairdresserCard } from "./views/hairdressersCards.js";

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("hairdressers-cards");

    const hairdressers = await getData();
    const appointments = await getAppoinments();
    
    //console.log(appointments)

    hairdressers.forEach(hairdresser => {
        const card = createHairdresserCard(hairdresser);
        container.appendChild(card);
    });
});






