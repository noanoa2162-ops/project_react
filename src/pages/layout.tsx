import { createBrowserRouter, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import Footer from "../components/footer";
import Header from "../components/header";
import Dashboard from "./dashboard";
import NewTicket from "./newTicket";
import AllTickets from "./allTickets";
import Error from "./error";
import TicketDetails from "./ticketDetails";
import TicketComments from "./ticketComments";
import Login from "./login";
import PrivateRoute from "../components/privateRoute";
import authStore from "../store/auth.store";
import { getMe } from "../services/api.service";

interface LayoutProps {
}
const Layout: React.FC<LayoutProps> = observer(() => {
    // טוען את היוזר מהשרת לפי הטוקן - תמיד!
    const { data: user } = useQuery({
        queryKey: ["currentUser", authStore.token],
        queryFn: () => getMe(authStore.token!),
        enabled: !!authStore.token,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (user) {
            authStore.setCurrentUser(user);
        }
    }, [user]);

    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
});
export const layoutRouter = createBrowserRouter([
    
    {
        path: "/login", element: <Login />
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            { 
                index: true, 
                element: <PrivateRoute><Dashboard /></PrivateRoute> 
            },
            {
                path: "dashboard", 
                element: <PrivateRoute><Dashboard /></PrivateRoute>,
            },
            {
                path: "tickets/new", 
                element: <PrivateRoute requiredRole="customer"><NewTicket /></PrivateRoute>
            },
            {
                path: "tickets", 
                element: <PrivateRoute><AllTickets /></PrivateRoute>
            },
            {
                path: "tickets/:id/details", 
                element: <PrivateRoute><TicketDetails /></PrivateRoute>
            },
            {
                path: "tickets/:id/comments", 
                element: <PrivateRoute><TicketComments /></PrivateRoute>
            },
        ]
    },
    {
        path: "*", element: <Error />
    },
]);
