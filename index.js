const express = require("express");
const app = express();
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");

console.log("✅ 已掛載 /api/login 路由");


app.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use('/api', authRoutes)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
