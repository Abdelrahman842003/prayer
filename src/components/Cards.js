import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { CardActionArea } from "@mui/material";
import "./main.css"
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#0a0c0e" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function DividerStack({ name, time, image }) {
  return (
      <CardActionArea sx={{maxWidth: 345}} >
        <Card sx={{ maxWidth: 345 , marginTop:5}}>
          <CardMedia
            component="img"
            height="140"
            image={image}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" color="backgroundColor">
              {name}
            </Typography>
            <Typography variant="h3" color="text.secondary">
              {time}
            </Typography>
          </CardContent>
        </Card>
      </CardActionArea>
  );
}
