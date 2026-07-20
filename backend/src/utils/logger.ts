import winston from "winston";
import path from "path";
import fs from "fs";

// Menggunakan process.cwd() agar path selalu konsisten di root project
const logDir = path.join(process.cwd(), "logs");

// Pastikan folder logs ada, jika tidak, buat otomatis
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Definisikan format custom agar log di console lebih rapi
const logFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  },
);

const logger = winston.createLogger({
  level: "info", // Default level
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }), // Menangkap stack trace jika ada error
    winston.format.json(), // Format default untuk file adalah JSON (Best Practice)
  ),
  transports: [
    // 1. Output ke Console (Terminal) dengan Warna
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        logFormat,
      ),
    }),

    // 2. Output ke file error.log (Hanya level 'error')
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),

    // 3. Output ke file combined.log (Semua level: info, warn, error)
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      tailable: true, // Memastikan stream tetap terbuka
      maxsize: 5242880, // 5MB sebelum rotasi
      maxFiles: 5,
      options: { flags: "a" }, // 'a' untuk append/tambah teks
    }),
  ],
  // Jangan biarkan Winston berhenti jika ada error internal
  exitOnError: false,
});

export default logger;
