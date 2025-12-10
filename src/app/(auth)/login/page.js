"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import useAuthStore from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const setFromSession = useAuthStore((state) => state.setFromSession);

  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      setFromSession(session);
      router.replace("/dashboard");
    }
  }, [router, session, setFromSession]);

  const handleChange = useCallback((e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSubmitting(true);
      const result = await signIn("credentials", {
        redirect: false,
        username: formState.username,
        password: formState.password,
      });
      setSubmitting(false);

      if (result?.error) {
        // Show user-friendly error message
        const errorMsg = result.error === "CredentialsSignin" 
          ? "Invalid username or password. Please check your credentials and try again."
          : result.error;
        setError(errorMsg);
        return;
      }

      if (result?.ok) {
        // Success - redirect will happen via useEffect when session is set
        return;
      }

      router.replace("/dashboard");
    },
    [formState.password, formState.username, router]
  );

  if (status === "loading") {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Admin Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use DummyJSON credentials (e.g. username: emilys, password:
                emilyspass) to sign in. You can use any user credentials from
                the DummyJSON users endpoint.
              </Typography>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              label="Username"
              name="username"
              required
              value={formState.username}
              onChange={handleChange}
              fullWidth
              autoComplete="username"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              required
              value={formState.password}
              onChange={handleChange}
              fullWidth
              autoComplete="current-password"
            />
            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Login"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

