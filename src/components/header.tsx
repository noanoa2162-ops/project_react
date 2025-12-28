
import { Link, useNavigate } from "react-router-dom";
import authStore from "../store/auth.store";
import { observer } from "mobx-react-lite";
import type React from "react";

const Header: React.FC = observer(() => {
    const navigate = useNavigate();
    const role = authStore.currentUser?.role;
    const name = authStore.currentUser?.name;

    const handleLogout = () => {
        authStore.logout();
        localStorage.removeItem('token');
        navigate("/login");
    };

    return (
        <header >
            <div>
                <h3 >🎫 Helpdesk</h3>
                
                {authStore.isAuthenticated && (
                    <nav >
                        <Link to="/dashboard" >
                            🏠 בית
                        </Link>

                    </nav>
                  
                )}
            </div>

            {authStore.isAuthenticated && (
                <div >
                    <span >
                        👤 {name} <span >({role})</span>
                    </span>
                    <button
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>
                </div>
            )}
        </header>
    );
});



    export default Header;