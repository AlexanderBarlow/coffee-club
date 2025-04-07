// app/login/page.js
import AuthForm from "@/components/AuthForm";
import { Box } from "@mui/material";
import BottomTabBar from "@/components/MobileNavbar";

export default function LoginPage() {
  return (
    <>
      <BottomTabBar />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <AuthForm type="signup" />
      </Box>
    </>
  );
}
