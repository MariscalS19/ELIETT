declare module 'argon2-wasm' {
    interface HashOptions {
        hash?: string;
        time?: number;
        mem?: number;
        parallel?: number;
        type?: number;
    }

    function hash(plain: string, options?: HashOptions): Promise<string | boolean>;

    const _default: {
        hash: typeof hash;
        types: Record<string, number>;
    };

    export default _default;
}