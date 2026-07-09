import { SignJWT } from 'jose';
import { jwtVerify } from 'jose';

export async function signJWT(payload: { id: number, user: string }) {
    const secretString = process.env.JWT_SECRET;
    const secretKey = new TextEncoder().encode(secretString);

    const jwt = await new SignJWT(
        {
            id: payload.id,
            user: payload.user
        }
    )
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('12h')
        .sign(secretKey);

    return jwt;
}

export async function verifyJWT(token: string) {
    const secretString = process.env.JWT_SECRET;
    const secretKey = new TextEncoder().encode(secretString);

    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}
