import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rootRouter from "./src/routes/index";
import logger from "./src/utils/logger";
import cookieParser from "cookie-parser";

// Load config di awal
dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "localhost";

// Middleware
app.use(helmet()); // Keamanan header
app.use(cors()); // Izin akses cross-origin
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req: Request, res: Response) => {
  // Di server.ts paling bawah atau setelah logger.info
  logger.info("Tes menulis ke file");
  res.status(200).json({
    message: "Welcome to Authentication API",
    status: "Active",
  });
});

// Gunakan rootRouter untuk semua route yang sudah didefinisikan
app.use(rootRouter);

// Error Handling Dasar (Opsional tapi disarankan)
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  logger.error(`Error: ${err.message} - Stack: ${err.stack}`);
  res.status(500).send("Terjadi kesalahan pada server!");
});

app.listen(PORT, HOST, () => {
  // console.log(`🚀 Arslan Server running at http://${HOST}:${PORT}`);
  logger.info(`🚀 Arslan Server running at http://${HOST}:${PORT}`);
});
