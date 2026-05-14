import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import Custommiddleware from "./authmiddleware/customerror.js";
import authroute from "./route/route.js";

dotenv.config();

const app = express();

// --------------------
// PARSE JSON
// --------------------
app.use(express.json());

// --------------------
// ALLOWED ORIGINS
// --------------------
const alloworigin = [
  "http://localhost:5173",
  "https://facebookwebsite-frontend.onrender.com",
];

// --------------------
// CORS CONFIG
// --------------------
const corsOptions = {
  origin: function (origin, cb) {
    // allow requests like Postman or server-to-server
    if (!origin) return cb(null, true);

    if (alloworigin.includes(origin)) {
      return cb(null, true);
    }

    return cb(null, false); // block others
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

  credentials: true,

  allowedHeaders: ["Content-Type", "Authorization"],
};

// --------------------
// CORS MIDDLEWARE
// --------------------
app.use(cors(corsOptions));

// --------------------
// RATE LIMITER
// --------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

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

// --------------------
// ERROR MIDDLEWARE
// --------------------
app.use(Custommiddleware);

export default app;