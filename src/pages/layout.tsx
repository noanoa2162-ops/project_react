import { createBrowserRouter, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { Box, CircularProgress, Typography, Container, Button } from "@mui/material";
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
import statusesStore from "../store/status.store";
import prioritiesStore from "../store/priorities.store";
import usersStore from "../store/users.store";
import { getMe, getStatuses, getPriorities, getUsers } from "../services/api.service";

interface LayoutProps {
}
const Layout: React.FC<LayoutProps> = observer(() => {
    const token = authStore.token;

    // טוען את היוזר מהשרת לפי הטוקן
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["currentUser", token],
        queryFn: async () => {
            const data = await getMe(token!);
            authStore.setCurrentUser(data);
            return data;
        },
        enabled: !!token,
        staleTime: Infinity,
        retry: 1, // ננסה פעם אחת נוספת במקרה של שגיאה
    });

    // טעינת סטטוסים גלובלית
    useQuery({
        queryKey: ["statuses"],
        queryFn: async () => {
            const data = await getStatuses(token!);
            statusesStore.setStatuses(data);
            return data;
        },
        enabled: !!token && !!user,
        staleTime: Infinity,
    });

    // טעינת עדיפויות גלובלית
    useQuery({
        queryKey: ["priorities"],
        queryFn: async () => {
            const data = await getPriorities(token!);
            prioritiesStore.setPriorities(data);
            return data;
        },
        enabled: !!token && !!user,
        staleTime: Infinity,
    });

    // טעינת משתמשים גלובלית (רק למנהלים)
    useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const data = await getUsers(token!);
            usersStore.setUsers(data);
            return data;
        },
        enabled: !!token && user?.role === 'admin',
        staleTime: Infinity,
    });

    if (token && isLoading) {
        return (
            <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" color="textSecondary">מתחבר למערכת...</Typography>
            </Container>
        );
    }

    if (token && isError) {
        return (
            <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 3, textAlign: 'center' }}>
                <Typography variant="h2">⏳</Typography>
                <Box>
                    <Typography variant="h5" color="error" gutterBottom sx={{ fontWeight: 'bold' }}>
                        משהו השתבש בחיבור למערכת
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        אנחנו נתקלים בקושי קטן כרגע. כדאי לנסות לרענן את הדף או לנסות שוב בעוד כמה דקות.
                    </Typography>
                </Box>
                <Button variant="contained" size="large" onClick={() => window.location.reload()} sx={{ px: 4 }}>
                    נסו לרענן את הדף
                </Button>
            </Container>
        );
    }

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
