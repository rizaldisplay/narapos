import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
    findUserByPhone,
    createUser
} from "../services/user.service";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/token";
import { sendWhatsAppOTP } from "../services/whatsapp.service";
import { formatToID } from "../utils/phoneFormatter";
import logger from "../utils/logger";


// ---- Register ---- \\
export const register = async (req: Request, res:Response) => {
    try {
        const { name, email, phone, password } = req.body;

        if(!phone || !password){
            return res.status(400).json({ message: 'Nomor telpon dan password diperlukan' });
        }

        const formattedPhone = formatToID(phone);

        // 1. Cek apakah nomor sudah terdaftar
        const existingUser = await findUserByPhone(formattedPhone);
        
        if(existingUser){
            return res.status(400).json({ message: 'Nomor telfon sudah terdaftar' });
        }

        // 2. Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        
        // 3. Generate OTP untuk verifikasi awal
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOTP  = await bcrypt.hash(otp, 10);
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 menit

        // 4. Simpan user baru (isVerified masih false)
        await createUser({
            name,
            phone,
            passwordHash,
            otp: hashedOTP,
            otpExpires,
            isActive: false
        })

        // 5. Kirim OTP via Fonnte
        await sendWhatsAppOTP(formattedPhone, otp);

        res.status(201).json({
            message:
            "Registrasi berhasil. Silahkan masukkan kode OTP yang dikirim ke WhatsApp Anda",
            phone: formattedPhone,
            nama: name
        })
    } catch (error) {
        logger.error("Register WA Error", error);
        res.status(500).json({ message: "Terjadi kesalahan server"})
    }
}

// ---- Verifikasi ---- \\
export const verifyRegister = async(req: Request, res: Response) => {
    try {
        const { phone, otp} = req.body;

        const user = await findUserByPhone(phone);
        if(!user || !user.otp){
            return res.status(401).json({ message: "Data tidak ditemukan"});
        }

        // Cek OTP
        const isOtpMatch = await bcrypt.compare(otp, user.otp);
        if(!isOtpMatch){
            return res.status(401).json({ message: "Kode OTP Salah"})
        }

        // Cek Expired
        if(!user.otpExpires || new Date() > user.otpExpires){
            return res.status(401).json({ message: "OTP kadaluwarsa" });
        }

        // Aktifkan Akun
        await updateUser(user.id, {
            isVerified: true,
            otp: null,
            otpExpires: null
        });

        // Berikan Access & Refresh Token agar user langsung masuk ke dashboard
        // generateTokens, setCookie, res.json
        const payload = { id: user.id, phone: user.phone ?? "", role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // simpan Refresh Token di HttpOnly Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    } catch (error) {
        res.status(500).json({ message: "Kesalahan server saat verifikasi" })
    }
}

export const login = async(req: Request, res: Response) => {
    try{
        const { phone } = req.body;

        if(!phone){
            return res.status(400).json({ message: "Nomor tidak terdaftar" });
        }

        // 1. Cari user berdasarkan nomor telepon
        const user = await findUserByPhone(phone);
        if(!user){
            return res.status(404).json({ message: "Nomor tidak terdaftar" })
        }

        // 2. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOTP  = await bcrypt.hash(otp, 10);
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 menit

        // 3. Simpan OTP ke DB
        await updateUSer(user.id, { otp: hashedOTP, otpExpires });

        // 4. Kirim via WhatsApp
        await sendWhatsAppOTP(phone, otp);

        res.status(200).json({ message: "OTP telah dikirim ke WhatsApp Anda." });
    } catch (error) {
        logger.error("Login WA error", error);
        res.status(500).json({ message: "Terjadi kesalahan server"});
    }
}

export const verifyLogin = async(req: Request, res: Response) => {
    try {
        const { phone, otp} = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        const user = await findUserByPhone(phone);
        if(!user || !user.otp) {
            return res
             .status(401)
             .json({ message: "OTP salah atau tidak ditemukan" });
        }

        // Validasi OTP
        const isOtpMatch = await bcrypt.compare(otp, user.otp);
        if(!isOtpMatch){
            return res.status(401).json({ message: "OTP tidak valid" });
        }

        // Validasi Expired
        if(!user.otpExpires || new Date() > user.otpExpires){
            return res.status(401).json({ message: "OTP sudah kedaluwarsa" })
        }

        // Bersihkan OTP di DB
        await updateUser(user.id, { otp: null, otpExpires: null });

        // Generate Token
        const payload = { id: user.id, phone: user.phone ?? "", role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // simpan Refresh Token di HttpOnly Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login sukses",
            accessToken
        });
    } catch (error) {
        logger.error("Verify WA error", error);
        res.status(500).json({ message: "Terjadi kesalahan server"});
    }
}

