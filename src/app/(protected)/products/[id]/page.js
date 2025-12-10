"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CategoryIcon from "@mui/icons-material/Category";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import useProductsStore from "@/stores/productsStore";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id;
  const { fetchProductById, isLoading } = useProductsStore();
  const [product, setProduct] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;
    fetchProductById(productId)
      .then((data) => {
        setProduct(data);
        setActiveIndex(0);
      })
      .catch((err) => setError(err.message));
  }, [fetchProductById, productId]);

  if (isLoading && !product) {
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
          Failed to load product
        </Typography>
        <Typography color="text.secondary">{error}</Typography>
        <Button component={Link} href="/products" sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Box>
    );
  }

  if (!product) return null;

  const discountPrice =
    product.price - (product.price * product.discountPercentage) / 100;

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
            Product Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete product information and specifications
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/products"
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
          Back to Products
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box
              sx={{
                position: "relative",
                bgcolor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 400,
                p: 2,
              }}
            >
              <CardMedia
                component="img"
                image={product.images?.[activeIndex] || product.thumbnail}
                alt={product.title}
                sx={{
                  maxHeight: 400,
                  objectFit: "contain",
                  borderRadius: 2,
                }}
              />
              {product.discountPercentage > 0 && (
                <Chip
                  label={`${product.discountPercentage}% OFF`}
                  color="error"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontWeight: 700,
                  }}
                />
              )}
            </Box>
            {product.images && product.images.length > 1 && (
              <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
                >
                  More Images
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ overflowX: "auto", pb: 1 }}
                >
                  {product.images.map((img, index) => (
                    <Paper
                      key={img}
                      elevation={index === activeIndex ? 4 : 1}
                      onClick={() => setActiveIndex(index)}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        border:
                          index === activeIndex
                            ? "3px solid #4caf50"
                            : "2px solid transparent",
                        cursor: "pointer",
                        overflow: "hidden",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "scale(1.05)",
                          borderColor: "#4caf50",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={img}
                        alt={`${product.title}-${index}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Chip
                    icon={<CategoryIcon />}
                    label={product.category}
                    sx={{
                      bgcolor: "#4caf50",
                      color: "white",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    {product.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {product.description}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ color: "#4caf50" }}
                    >
                      ${discountPrice.toFixed(2)}
                    </Typography>
                    {product.discountPercentage > 0 && (
                      <Typography
                        variant="h6"
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                        }}
                      >
                        ${product.price}
                      </Typography>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      icon={<StarIcon />}
                      label={product.rating}
                      color="warning"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      icon={<InventoryIcon />}
                      label={`${product.stock} in stock`}
                      color={product.stock > 0 ? "success" : "error"}
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{ color: "#4caf50", mb: 2 }}
                  >
                    Product Information
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <BrandingWatermarkIcon sx={{ color: "#4caf50" }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Brand
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {product.brand || "N/A"}
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider />
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CategoryIcon sx={{ color: "#4caf50" }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Category
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {product.category}
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider />
                    <Stack direction="row" spacing={2} alignItems="center">
                      <InventoryIcon sx={{ color: "#4caf50" }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Availability
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {product.stock > 0
                            ? `${product.stock} units available`
                            : "Out of stock"}
                        </Typography>
                      </Box>
                    </Stack>
                    {product.discountPercentage > 0 && (
                      <>
                        <Divider />
                        <Stack direction="row" spacing={2} alignItems="center">
                          <LocalOfferIcon sx={{ color: "#4caf50" }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Discount
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {product.discountPercentage}% off
                            </Typography>
                          </Box>
                        </Stack>
                      </>
                    )}
                  </Stack>
                </Box>

                {product.warrantyInformation && (
                  <>
                    <Divider />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Warranty Information
                      </Typography>
                      <Typography variant="body2">
                        {product.warrantyInformation}
                      </Typography>
                    </Box>
                  </>
                )}

                {product.shippingInformation && (
                  <>
                    <Divider />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Shipping Information
                      </Typography>
                      <Typography variant="body2">
                        {product.shippingInformation}
                      </Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

