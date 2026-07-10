import argon2Wasm from 'argon2-wasm';

export default async function verifyAdminPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    try {
        const result = await argon2Wasm.hash(plainPassword, {
            hash: hashedPassword
        });

        if (typeof result === 'object' && result !== null) {
            return (result as any).encoded === hashedPassword;
        }

        return result === true;
    } catch (error) {
        console.error("Critical error in Argon2 verification:", error);
        return false;
    }
}