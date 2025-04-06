// app/login/page.js
import AuthForm from "@/components/AuthForm";
import { Box } from "@mui/material";

export default function LoginPage() { 
  return (
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
      <AuthForm type="login" />
    </Box>
  );
}
