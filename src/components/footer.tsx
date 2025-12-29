import type { FunctionComponent } from "react"
import { Box, Typography } from "@mui/material";

interface FooterProps {

}
const Footer: FunctionComponent<FooterProps> = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#34495e',
                color: '#ecf0f1',
                textAlign: 'center',
                padding: '20px',
                marginTop: '50px'
            }}
        >
            <Typography sx={{ fontSize: '14px', margin: 0 }}>
                © {new Date().getFullYear()} Helpdesk System | נוצר עבור ניהול כרטיסי תמיכה
            </Typography>
        </Box>
    );
}   
    export default Footer;