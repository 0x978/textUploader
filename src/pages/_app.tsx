import { type AppType } from "next/app";
import localFont from "@next/font/local";
import { api } from "~/utils/api";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";


import "~/styles/globals.css";

const myFont = localFont({ src: "../misc/Web437_IBM_VGA_8x14.woff" });

// loading libraries
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useRouter } from "next/router";


const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
    const router = useRouter();
    useEffect(() => {
        router.events.on("routeChangeStart", () => NProgress.start());
        router.events.on("routeChangeComplete", () => NProgress.done());
        router.events.on("routeChangeError", () => NProgress.done());
    }, []);
    return (
        <main className={myFont.className}>
            <SessionProvider session={session}>
                <Component {...pageProps} />
                <Analytics />
            </SessionProvider>
        </main>
    );
};

export default api.withTRPC(MyApp);
