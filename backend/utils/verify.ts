import { argon2Verify } from 'hash-wasm';

export default async function verifyAdminPassword(
    hashedPassword: string,
    plainPassword: string
): Promise<boolean> {
    try {
        return await argon2Verify({
            password: plainPassword,
            hash: hashedPassword,
        });
    } catch (error) {
        console.error("Critical error in Argon2 verification:", error);
        return false;
    }
}