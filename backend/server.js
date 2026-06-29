import chalk from "chalk";
import app from "./app.js";
import connectDB from "./config/db.config.js";
import "./eventbus/index.js"

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {

        const server = app.listen(PORT, () => {
            console.log(
                chalk.black.bgGreen(
                    `Server is running on port ${PORT}`
                )
            );
        });

        // Set high timeout for AI processing (10 minutes)
        server.timeout = 600000;
        server.keepAliveTimeout = 600000;

    })
    .catch((error) => {

        console.log(
            chalk.white.bgRed(
                `Error to run the server ${error.message}`
            )
        );

    });