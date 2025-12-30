import { makeAutoObservable } from "mobx";
import type { Ticket } from "../models";

class TicketsStore {
    tickets: Ticket[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    getTickets(tickets: Ticket[]) {
        this.tickets = [...tickets];
    }

    addTicket(ticket: Ticket) {
        this.tickets.push(ticket);      
    }

    updateTicketById(updatedTicket: Ticket) {
        const index = this.tickets.findIndex(t => t.id === updatedTicket.id);
        if (index !== -1) {
            this.tickets[index] = updatedTicket;
        }
    }
}

const ticketsStore = new TicketsStore();
export default ticketsStore;   