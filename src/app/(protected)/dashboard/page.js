"use client";

import Link from "next/link";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Quick access to manage users and products from DummyJSON APIs.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Users
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Browse, search, and view details for DummyJSON users with API
                pagination.
              </Typography>
              <Button
                component={Link}
                href="/users"
                variant="contained"
                color="primary"
              >
                Go to Users
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Products
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Explore products with search, category filters, and paginated
                results powered by the API.
              </Typography>
              <Button
                component={Link}
                href="/products"
                variant="contained"
                color="secondary"
              >
                Go to Products
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

