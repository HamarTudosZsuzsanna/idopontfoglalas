export class Appointments {
    #id;
    hairdresserId;
    customerName;
    customerPhone;
    appointmentDate;
    service;
    createdAt;

    constructor (id, hairdresser_id, customer_name, customer_phone, appointment_date, service, created_at) {
        this.#id = id;
        this.hairdresserId = hairdresser_id;
        this.customerName = customer_name;
        this.customerPhone = customer_phone;
        this.appointmentDate = appointment_date;
        this.service = service;
        this.createdAt = created_at;
    }
}