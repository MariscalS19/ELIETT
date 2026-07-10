import localFont from 'next/font/local';
export const guidaMono = localFont({
    src: [
        {
            path: '/fonts/GuidaMonoPro-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '/fonts/GuidaMonoPro-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '/fonts/GuidaMonoPro-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '/fonts/GuidaMonoPro-Black.ttf',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: '--font-guida-mono'
});

export const guidaMonoSharp = localFont({
    src: [
        {
            path: '/fonts/GuidaMonoSharpPro-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '/fonts/GuidaMonoSharpPro-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '/fonts/GuidaMonoSharpPro-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '/fonts/GuidaMonoSharpPro-Black.ttf',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: '--font-guida-mono-sharp'
});
