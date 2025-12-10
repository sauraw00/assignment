"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import StarIcon from "@mui/icons-material/Star";
import useProductsStore from "@/stores/productsStore";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState({ products: [], total: 0 });

  const {
    fetchProducts,
    fetchCategories,
    categories,
    isLoading,
    error,
    clearError,
  } = useProductsStore();

  const loadProducts = useCallback(async () => {
    const payload = await fetchProducts({
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      q: search,
      category,
    });
    setData(payload);
  }, [category, fetchProducts, page, search]);

  useEffect(() => {
    fetchCategories().catch(() => {});
  }, [fetchCategories]);

  useEffect(() => {
    loadProducts().catch(() => {});
  }, [loadProducts]);

  const totalPages = useMemo(() => {
    if (!data?.total) return 1;
    return Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  }, [data?.total]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
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
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search, filter by category, and page through DummyJSON products.
          </Typography>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <TextField
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            size="small"
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
                      loadProducts();
                    }}
                    size="small"
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              label="Category"
              value={category}
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      {isLoading && !data.products?.length ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "30vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {data.products?.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                component={Link}
                href={`/products/${product.id}`}
                sx={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  textDecoration: "none",
                  position: "relative",
                  bgcolor: "background.paper",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                    "& .product-image": {
                      transform: "scale(1.1)",
                    },
                    "& .view-details": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                {/* Image Container */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    flex: "1 1 auto",
                    minHeight: 0,
                    bgcolor: "#f8f9fa",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.thumbnail}
                    alt={product.title}
                    className="product-image"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      p: 2,
                    }}
                  />
                  {/* Discount Badge */}
                  {product.discountPercentage > 0 && (
                    <Chip
                      label={`${product.discountPercentage}% OFF`}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: "#4caf50",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        height: 24,
                        boxShadow: "0 2px 8px rgba(76, 175, 80, 0.4)",
                      }}
                    />
                  )}
                  {/* Category Badge */}
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "rgba(0,0,0,0.7)",
                      color: "white",
                      fontWeight: 500,
                      backdropFilter: "blur(8px)",
                      fontSize: "0.7rem",
                      height: 24,
                    }}
                  />
                  {/* Stock Badge */}
                  <Chip
                    label={product.stock > 0 ? "In Stock" : "Out of Stock"}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      bgcolor: product.stock > 0 ? "#4caf50" : "#f44336",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.65rem",
                      height: 22,
                    }}
                  />
                </Box>

                {/* Content Container */}
                <CardContent
                  sx={{
                    flex: "0 0 auto",
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    bgcolor: "background.paper",
                  }}
                >
                  {/* Title */}
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      color: "text.primary",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 56,
                      lineHeight: 1.4,
                      fontSize: "1rem",
                    }}
                  >
                    {product.title}
                  </Typography>

                  {/* Rating and Price */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                  >
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <StarIcon
                        sx={{
                          fontSize: 18,
                          color: "#fbc02d",
                        }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ color: "text.primary" }}
                      >
                        {product.rating}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ color: "#4caf50" }}
                    >
                      ${product.price}
                    </Typography>
                  </Stack>

                  {/* View Details Button */}
                  <Box
                    className="view-details"
                    sx={{
                      mt: "auto",
                      pt: 1,
                      opacity: 0.8,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4caf50",
                        fontWeight: 600,
                        textAlign: "center",
                        py: 1,
                        borderRadius: 2,
                        bgcolor: "rgba(76, 175, 80, 0.1)",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: "rgba(76, 175, 80, 0.2)",
                        },
                      }}
                    >
                      View Details →
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        {isLoading ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CircularProgress size={18} />
            <Typography variant="body2">Loading...</Typography>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, data.total || 0)} of {data.total || 0}
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
    </Box>
  );
}

