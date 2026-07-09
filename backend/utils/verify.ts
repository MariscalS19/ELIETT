import argon2 from "argon2";
export default async function verifyAdminPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    try {
        return await argon2.verify(hashedPassword, plainPassword);
    } catch (error) {
        console.error("Critical error in Argon2 verification:", error);
        return false;
    }
}