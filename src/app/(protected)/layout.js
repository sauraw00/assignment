"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import useAuthStore from "@/stores/authStore";
import { useEffect } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/products", label: "Products" },
];

export default function ProtectedLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession({ required: true });
  const setFromSession = useAuthStore((state) => state.setFromSession);

  useEffect(() => {
    if (session) {
      setFromSession(session);
    }
  }, [session, setFromSession]);

  if (status === "loading") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#1a1a1a",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: "#ffffff",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Green Dream Admin
          </Typography>
          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 1 }}
            alignItems="center"
          >
            {links.map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  color: isActive(link.href) ? "#4caf50" : "#ffffff",
                  fontWeight: isActive(link.href) ? 700 : 500,
                  textTransform: "none",
                  px: { xs: 1, sm: 2 },
                  py: 1,
                  borderRadius: 2,
                  position: "relative",
                  "&::after": isActive(link.href)
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "60%",
                        height: 3,
                        bgcolor: "#4caf50",
                        borderRadius: "3px 3px 0 0",
                      }
                    : {},
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: isActive(link.href) ? "#4caf50" : "#ffffff",
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
            <Button
              variant="outlined"
              onClick={handleSignOut}
              sx={{
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.3)",
                textTransform: "none",
                ml: { xs: 0.5, sm: 1 },
                "&:hover": {
                  borderColor: "#4caf50",
                  bgcolor: "rgba(76, 175, 80, 0.1)",
                  color: "#4caf50",
                },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}

