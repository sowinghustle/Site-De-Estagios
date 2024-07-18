import express from "express";
import cors from "cors";
import config from "./config/project-config";
import exampleRoutes from "./example/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: [config.environment != "production" ? "http://localhost:8000" : ""],
    })
);

app.get("/", (req, res) => res.send("Bem vindo"));
app.use("/example", exampleRoutes);
app.use((_, res) => res.status(404));

app.listen(config.port, () => {
    console.log("Server running at port " + config.port);
});
