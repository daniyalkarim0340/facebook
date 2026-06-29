import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import authroute from "./route/route.js";
import Airouter from "./route/ai.route.js";
import ImageRouter from "./route/image.route.js";
import AIrouter from "./route/aiassstiant.route.js";
import errorMiddleware from "./authmiddleware/error.middleware.js";
import Voiceroute from "./route/voice.router.js";

dotenv.config();

const app = express();

// --------------------
// PARSE JSON
// --------------------
app.use(express.json());

// --------------------
// CORS CONFIG
// --------------------
const corsOptions = {
  origin: ["http://localhost:5173", "https://facebookwebsite-frontend.onrender.com"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

// --------------------
// CORS MIDDLEWARE
// --------------------
app.use(cors(corsOptions));


// --------------------
// RATE LIMITER
// --------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1' || req.hostname === 'localhost',
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  },
});


app.use(limiter);

// --------------------
// ROUTES
// --------------------

app.use("/api/users", authroute);
app.use("/api/ai", Airouter);
app.use("/api/ai", ImageRouter);
app.use("/api/ai",AIrouter)
app.use("/api/ai",Voiceroute)
// ERROR MIDDLEWARE
// --------------------
app.use(errorMiddleware);

export default app;