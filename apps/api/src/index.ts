import express from "express";
import morgan from "morgan";
import { join } from "path";

const app = express();

const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.static(join(__dirname, "../..", "client", "dist")));

app.get("/api/v1", (req, res) => {
    res.json({ message: "It works" });
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
