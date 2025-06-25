require("dotenv").config();

const express = require("express");
const cors = require("cors");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

const app = express();

const swaggerDocument = YAML.load("./swagger.yaml");

require("./src/middlewares/passport.js");
const passport = require("passport");
app.use(passport.initialize());

const authRoutes = require("./src/routes/authRoutes");
const protectedRoutes = require("./src/routes/protectedRoutes");
const itineraryRouter = require("./src/routes/itinerary");
const emailPreferencesRoute = require("./src/routes/emailPreferencesRoute");
const travelSchedulesRoutes = require("./src/routes/scheduleRoutes");
const communityRoutes = require("./src/routes/communityRoutes");
const loginRouter = require("./src/routes/loginRoutes");
const arriveItinerary = require("./src/routes/arriveItinerary");
const oauthRouter = require("./src/routes/oAuthRoute");
const profileRoutes = require("./src/routes/profileRoutes");
const paymentRoute = require("./src/routes/paymentRoutes");
const updateScheduleRoutes = require("./src/routes/updateScheduleRoutes");
const tripSharesRoute = require("./src/routes/tripSharesRoute");
const postsRoute = require("./src/routes/postsRoute");

app.use(
    cors({
        origin: [
            process.env.VITE_API_URL,
            "http://localhost:5173",
            "https://maytripfoliodev.netlify.app",
            "https://portfolioo-devv.netlify.app",
            "https://tripfolioo.netlify.app",
        ].filter(Boolean),
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/signup", authRoutes);
app.use("/api/login", loginRouter);
app.use("/auth", oauthRouter);

app.use("/api/profile", profileRoutes);
app.use("/api", protectedRoutes);

app.use("/api/itinerary", itineraryRouter);
app.use("/api/itineraryTime", arriveItinerary);
app.use("/api/travelSchedule", travelSchedulesRoutes);
app.use("/api/updateScheduleRoutes", updateScheduleRoutes);
app.use("/api/tripShares", tripSharesRoute);

app.use("/api/community", communityRoutes);
app.use("/api/allposts", postsRoute);

app.use("/api/email-preferences", emailPreferencesRoute);
app.use("/api/payment", paymentRoute);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Backend is alive 🚀" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});