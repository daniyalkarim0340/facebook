import expres from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import Custommiddleware from "./authmiddleware/customerror.js";
const app = expres();
dotenv.config();

const alloworigin=["http://localhost:3000","https://facebookwebsite-frontend.onrender.com/"]
const corsOptions = (req, cb) => {
    const origin = req.header('Origin');

    const options = {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    };

    if (!origin) {
        return cb(null, options);
    }

    if (alloworigin.includes(origin)) {
        return cb(null, options);
    }

    return cb(null, { origin: false });
}
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
   handler: (req, res) => {      res.status(429).json({ message: 'Too many requests, please try again later.' });
    }
});
app.use(limiter);
app.use(cors(corsOptions));



app.use(Custommiddleware)

export default app;