import { Cashier, Prisma, Role } from "@prisma/client";
import db from "../utils/db.client";
import { formatToID } from "../utils/phoneFormatter";

export const findUserByPhone = async (
    phoneNumber: string,
): Promise<User | null> => {
    return db.user.findUnique({
        where: { phone: phoneNumber },
    })
}

export type CreateUserDTO = {
    name: string;
    username: string;
    password_hash: string;
    email?: string | null;
    phone: string;
    shift: string;
    position: string;
    avatar_url?: string | null;
    role_id: string;
}

export const createUser = async (data: CreateUserDTO): Promise<Cashier> => {
    return db.cashier.create({
        name: data.name,
        username: data.username,
        password_hash: data.password_hash,
        email: data.email,
        phone: data.phone,
        shift: data.shift,
        position: data.position,
        role_id: data.role_id
    })
}