import type { FunctionComponent } from "react"
import { Box, Typography } from "@mui/material";

interface FooterProps {

}
const Footer: FunctionComponent<FooterProps> = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#ffffff',
                color: '#6b7280',
                textAlign: 'center',
                padding: '30px',
                marginTop: '60px',
                borderTop: '1px solid #e5e7eb'
            }}
        >
            <Typography sx={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.02em' }}>
                © {new Date().getFullYear()} Helpdesk System • Professional Support Management
            </Typography>
        </Box>
    );
}   
    export default Footer;