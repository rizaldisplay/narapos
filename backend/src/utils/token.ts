import jwt from "jsonwebtoken";

// Definisikan bentuk data yang ada didalam token
interface TokenPayload {
    id: string;
    phone: string;
    role?: string;
}

// Tambahkan fungsi verify agar logic try-catch tidak berulang di controller
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

export const generateAccessToken = (payload: TokenPayload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "15m", // Singkat untuk keamanan
    })
}

export const generateRefreshToken = (payload: TokenPayload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d", // Lama untuk kenyamanan user
    })
}

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch {
        return null;
    }
};