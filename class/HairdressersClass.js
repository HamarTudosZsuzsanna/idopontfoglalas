export class Hairdressers {
    #id;
    name;
    phoneNumber;
    email;
    workStart;
    workEnd;
    services;

    constructor(id, name, phone_number, email, work_start_time, work_end_time, services) {
        this.#id = id;  
        this.name = name;
        this.phoneNumber = phone_number;
        this.email = email;
        this.workStart = work_start_time;
        this.workEnd = work_end_time;
        this.services = services;
    }

    getID() {
        return this.#id;
    }
}

