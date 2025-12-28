import { makeAutoObservable } from "mobx";
import type { Ticket } from "../models";

class TicketsStore {
    tickets: Ticket[] = [];
    isLoading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }
     
    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    setError(error: string | null) {
        this.error = error;
    }

    getTickets(tickets: Ticket[]) {
        this.tickets = [...tickets];
        this.isLoading = false;
        this.error = null;
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