import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Tipe data untuk payload JWT
interface JwtPayload {
    id: string,
    username: string,
    phone: string,
    email?: string,
    role?: string;
    shift?: string;
}

declare global {
    namespace Express {
        interface Request {
            cashier?: {
                id: string,
                username: string,
                phone: string,
                email?: string,
                role?: string;
                shift?: string;
            }
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log("Token yang diterima:", token); 
    console.log("Secret yang dipakai:", process.env.ACCESS_TOKEN_SECRET);

    if(!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    if(!secret) {
        return res.status(500).json({ message: 'JWT_SECRET belum di-set' });
    }

    try {
        const payload = jwt.verify(token, secret) as JwtPayload;
        req.cashier = {
            id: payload.id,
            username: payload.username,
            phone: payload.phone,
            email: payload.email,
            role: payload.role,
            shift: payload.shift,
        };

        next();
    } catch (err) {
        if(err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Access token expired',
                code: 'TOKEN_EXPIRED'
            })
        }
    }
}