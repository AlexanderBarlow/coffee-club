// app/login/page.js
import AuthForm from "@/components/AuthForm";
import { Box } from "@mui/material";
import BottomTabBar from "@/components/MobileNavbar";

export default function LoginPage() { 
  return (
    <>
      <Box sx={{ backgroundColor: "#fff" }}>
          <BottomTabBar />
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
            pt: 0,
          }}
        >
          <AuthForm type="login" />
        </Box>
      </Box>
    </>
  );
}
