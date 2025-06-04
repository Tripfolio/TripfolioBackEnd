const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const tripSharesRoute = require("./src/routes/tripSharesRoute");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/trip-shares", tripSharesRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
