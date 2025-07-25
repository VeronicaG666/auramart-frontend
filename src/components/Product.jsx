import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { useCart } from "context/CartContext";
import { formatCurrency } from "helpers/formatCurrency"; 

const fallbackImage = "https://placehold.co/400x300/EEE/31343C?text=Image+Not+Available";

const Product = ({ product }) => {
  const { name, description, price, image_url, id, stock } = product;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(id, 1);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        backgroundColor: "#FFFFFF",
        boxShadow: "0 6px 14px rgba(122, 11, 192, 0.08)", 
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(122, 11, 192, 0.18)",
        },
      }}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        height="220"
        image={image_url && image_url.startsWith("http") ? image_url : fallbackImage}
        alt={name || "Product Image"}
        onError={(e) => {
          e.target.src = fallbackImage;
        }}
        sx={{
          objectFit: "contain",
          backgroundColor: "#F9F9F9",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          padding: "10px",
        }}
      />

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, padding: "18px" }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "600",
            color: "#7743DB",
            fontSize: "1rem",
            mb: 1,
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 1,
            fontSize: "0.9rem",
            color: "#6D6875",
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 1,
            color: "#4B5563",
            fontWeight: "700",
            fontSize: "1.1rem",
          }}
        >
          {formatCurrency(price)} 
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ padding: "14px 18px", pt: 0 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          size="small"
          onClick={handleAddToCart}
          disabled={stock <= 0}
          sx={{
            backgroundColor: stock > 0 ? "#7A0BC0" : "#E0E0E0",
            color: stock > 0 ? "#FFF" : "#9E9E9E",
            fontWeight: "600",
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: stock > 0 ? "0 6px 12px rgba(122, 11, 192, 0.3)" : "none",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: stock > 0 ? "#5A189A" : "#E0E0E0",
            },
          }}
        >
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default Product;
