"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import useUsersStore from "@/stores/usersStore";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params?.id;
  const { fetchUserById, isLoading } = useUsersStore();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetchUserById(userId)
      .then((data) => setUser(data))
      .catch((err) => setError(err.message));
  }, [fetchUserById, userId]);

  if (isLoading && !user) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load user
        </Typography>
        <Typography color="text.secondary">{error}</Typography>
        <Button component={Link} href="/users" sx={{ mt: 2 }}>
          Back to Users
        </Button>
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            User Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete user information and details
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/users"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: "none",
            borderColor: "#4caf50",
            color: "#4caf50",
            "&:hover": {
              borderColor: "#4caf50",
              bgcolor: "rgba(76, 175, 80, 0.1)",
            },
          }}
        >
          Back to Users
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box
              sx={{
                bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                p: 4,
                color: "white",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems="center"
              >
                <Avatar
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  sx={{
                    width: { xs: 100, sm: 120 },
                    height: { xs: 100, sm: 120 },
                    border: "4px solid white",
                    boxShadow: 3,
                  }}
                >
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </Avatar>
                <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }} gutterBottom>
                    {user.company?.title || "User"}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent={{ xs: "center", sm: "flex-start" }}
                    mt={2}
                  >
                    <Chip
                      label={user.gender}
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={`Age: ${user.age}`}
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                sx={{ mb: 3, color: "#4caf50" }}
              >
                Contact Information
              </Typography>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <EmailIcon sx={{ color: "#4caf50" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
                <Divider />
                <Stack direction="row" spacing={2} alignItems="center">
                  <PhoneIcon sx={{ color: "#4caf50" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {user.phone}
                    </Typography>
                  </Box>
                </Stack>
                <Divider />
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <LocationOnIcon sx={{ color: "#4caf50", mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {user.address?.address}
                      <br />
                      {user.address?.city}, {user.address?.state}{" "}
                      {user.address?.postalCode}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Company Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                sx={{ mb: 3, color: "#4caf50" }}
              >
                Company Details
              </Typography>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <BusinessIcon sx={{ color: "#4caf50" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Company Name
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {user.company?.name || "N/A"}
                    </Typography>
                  </Box>
                </Stack>
                <Divider />
                <Stack direction="row" spacing={2} alignItems="center">
                  <PersonIcon sx={{ color: "#4caf50" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Job Title
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {user.company?.title || "N/A"}
                    </Typography>
                  </Box>
                </Stack>
                <Divider />
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <LocationOnIcon sx={{ color: "#4caf50", mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Company Address
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {user.company?.address?.address || "N/A"}
                      {user.company?.address?.city && (
                        <>
                          <br />
                          {user.company.address.city},{" "}
                          {user.company.address.state}
                        </>
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Info */}
        {(user.bank || user.university || user.ssn) && (
          <Grid item xs={12}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                  sx={{ mb: 3, color: "#4caf50" }}
                >
                  Additional Information
                </Typography>
                <Grid container spacing={3}>
                  {user.bank && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">
                        Bank
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {user.bank.cardType} •••• {user.bank.cardNumber?.slice(-4)}
                      </Typography>
                    </Grid>
                  )}
                  {user.university && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">
                        University
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {user.university}
                      </Typography>
                    </Grid>
                  )}
                  {user.ssn && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">
                        SSN
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {user.ssn}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

