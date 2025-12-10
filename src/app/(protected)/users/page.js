"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import useUsersStore from "@/stores/usersStore";

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [data, setData] = useState({ users: [], total: 0 });

  const { fetchUsers, isLoading, error, clearError } = useUsersStore();

  const loadUsers = useCallback(async () => {
    const payload = await fetchUsers({
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      q: search,
    });
    setData(payload);
  }, [fetchUsers, page, search]);

  useEffect(() => {
    loadUsers().catch(() => {});
  }, [loadUsers]);

  const totalPages = useMemo(() => {
    if (!data?.total) return 1;
    return Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  }, [data?.total]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search, paginate, and drill into user details.
          </Typography>
        </Box>
        <TextField
          placeholder="Search users..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="refresh"
                  onClick={() => {
                    clearError();
                    loadUsers();
                  }}
                  size="small"
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell align="right">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.users?.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={600}>
                          {user.firstName} {user.lastName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={user.gender}
                        color={user.gender === "male" ? "primary" : "secondary"}
                      />
                    </TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.company?.name}</TableCell>
                    <TableCell align="right">
                      <Typography
                        component={Link}
                        href={`/users/${user.id}`}
                        color="primary"
                        fontWeight={600}
                        sx={{ textDecoration: "none" }}
                      >
                        View
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {!data.users?.length && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="text.secondary">
                        No users found for this query.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            {isLoading ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={18} />
                <Typography variant="body2">Loading...</Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Showing {(page - 1) * PAGE_SIZE + 1}-
                {Math.min(page * PAGE_SIZE, data.total || 0)} of{" "}
                {data.total || 0}
              </Typography>
            )}
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

