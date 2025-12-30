#  Helpdesk Ticket Management System

A modern Helpdesk system for managing tickets and appeals, built with React, TypeScript, and Material UI.

##  Project Overview

This application allows users to manage support requests based on their roles:
- **Customer**: Create new tickets, add comments, and view their own tickets.
- **Agent**: View assigned tickets, update statuses, and add comments.
- **Admin**: Full access to all tickets, assign tickets to agents, and manage global statuses and priorities.

---

##  User Roles & Permissions

### Customer
-  View only self-created tickets.
-  Open new support tickets.
-  Add comments to their own tickets.

### Agent
-  View only tickets assigned to them.
-  Update ticket status.
-  Add comments to tickets.

### Admin
-  View all tickets in the system.
-  Assign tickets to specific Agents.
-  Manage and change ticket statuses.
-  Add new priority levels.
-  Add new ticket statuses.

---

##  Tech Stack

- **Frontend**: React 19 + TypeScript
- **State Management**: MobX (Global State)
- **Data Fetching**: TanStack React Query v5 (Server State)
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router v7
- **HTTP Client**: Axios (with manual token passing)
- **Form Handling**: React Hook Form
- **Build Tool**: Vite

---

##  Installation & Setup

### Prerequisites:
- Node.js 18+
- npm or yarn

### Steps:

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd project_react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the Backend Server**
   The server must be running at `http://localhost:4000`.
   Refer to the [Backend Repository](https://github.com/sarataber/helpdesk-api) for instructions.

4. **Start the Application**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5174`.

---

##  Key Features

- **Role-Based Access Control (RBAC)**: Secure routes and UI elements based on user roles.
- **Global State Management**: Centralized auth and data stores using MobX.
- **Optimized Data Fetching**: Efficient server state management with React Query.
- **Responsive Design**: Fully responsive UI built with MUI.
- **Hebrew Localization**: User-friendly Hebrew interface and error messages.

---

##  Routes

- `/login` - Authentication form.
- `/dashboard` - Role-specific landing page.
- `/tickets` - List of all accessible tickets.
- `/tickets/:id` - Ticket details and comments.
- `/tickets/new` - Create a new ticket (Customer only).
- `*` - Custom 404 Error page.

---

##  License
This project was developed as part of a Helpdesk Management System assignment.
