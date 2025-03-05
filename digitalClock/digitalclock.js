export const digitalClock = (function () {
    const template = `
        <div id="clock-box">
            <div id="day-container-clock"></div>
            <div id="date-container-clock">
                <div id="number-clock"></div>
                <div id="date-clock"></div>
            </div>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = template;

    const days = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

    let timerID;

    const render = (renderTo) => {
        const parentElement = document.querySelector(renderTo);

        if (parentElement) {
            const boxElement = div.firstElementChild.cloneNode(true);
            parentElement.appendChild(boxElement);

            // Idő frissítése
            const numberElement = parentElement.querySelector("#number-clock");
            const updateTime = () => {
                numberElement.innerHTML = new Date().toLocaleTimeString();
            };
            updateTime();
            timerID = setInterval(updateTime, 1000);

            // Dátum frissítése
            const dateElement = parentElement.querySelector("#date-clock");
            dateElement.innerHTML = `${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${String(new Date().getDate()).padStart(2, '0')}.`;

            // Napok megjelenítése
            const dayContainer = parentElement.querySelector("#day-container-clock");
            const nowDay = new Date().getDay();

            days.forEach((day, index) => {
                const daysDiv = document.createElement("div");
                daysDiv.textContent = day;
                daysDiv.classList.add("days-clock");
                dayContainer.appendChild(daysDiv);

                if (index === (nowDay === 0 ? 6 : nowDay - 1)) {
                    daysDiv.classList.add("active-day-clock");
                } else {
                    daysDiv.classList.remove("active-day-clock");
                }
            });
        }
    };

    return {
        render
    };
})();
