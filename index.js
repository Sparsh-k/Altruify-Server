import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./config/db-config.js";
import userRoutes from "./routes/users-routes.js";
import campaignRoutes from "./routes/campaigns-routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

connectMongoDB();

const app = express();

dotenv.config();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);


app.listen(port, () => {
    console.log("Node+Express Server is successfull");
});