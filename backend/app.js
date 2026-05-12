import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import Custommiddleware from "./authmiddleware/customerror.js";
import authroute from "./route/route.js";

const app = express();

dotenv.config();

// PARSE JSON
app.use(express.json());

// ALLOWED ORIGINS
const alloworigin = [
  "http://localhost:3000",
  "https://facebookwebsite-frontend.onrender.com",
];

// CORS OPTIONS
const corsOptions = {
  origin: function (origin, cb) {
    // Allow requests without origin
    if (!origin) {
      return cb(null, true);
    }

    // Check allowed origins
    if (alloworigin.includes(origin)) {
      return cb(null, true);
    }

    return cb(new Error("Not allowed by CORS"));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

  credentials: true,

  allowedHeaders: ["Content-Type", "Authorization"],
};

// RATE LIMITER
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

// MIDDLEWARES
app.use(limiter);

app.use(cors(corsOptions));

// ROUTES HERE
app.use("/api/users",authroute);

// ERROR MIDDLEWARE (LAST)
app.use(Custommiddleware);

export default app;