import { createBrowserRouter, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { Box } from "@mui/material";
import Footer from "../components/footer";
import Header from "../components/header";
import Dashboard from "./dashboard";
import NewTicket from "./newTicket";
import AllTickets from "./allTickets";
import Error from "./error";
import TicketDetails from "./ticketDetails";
import Login from "./login";
import PrivateRoute from "../components/privateRoute";
import authStore from "../store/auth.store";
import { getMe } from "../services/api.service";

interface LayoutProps {
}
const Layout: React.FC<LayoutProps> = observer(() => {
    // טוען את היוזר מהשרת לפי הטוקן - פעם אחת בלבד!
    const { data: user } = useQuery({
        queryKey: ["currentUser", authStore.token],
        queryFn: () => getMe(authStore.token!),
        enabled: !!authStore.token,
        staleTime: Infinity, // קושר למשך כל הסשן
        gcTime: 30 * 60 * 1000, // שמור לשדה 30 דקות
        refetchOnWindowFocus: false, // אל תבדוק בחזרה ל-focus
    });

    useEffect(() => {
        if (user) {
            authStore.setCurrentUser(user);
        }
    }, [user]);

    return (
        <div>
            <Header />
            <Box component="main" sx={{ paddingTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
                <Outlet />
            </Box>
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
                path: "tickets/:id", 
                element: <PrivateRoute><TicketDetails /></PrivateRoute>
            },
        ]
    },
    {
        path: "*", element: <Error />
    },
]);
