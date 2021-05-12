import { useEffect, React } from 'react';
import '../styles/main.css'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url) => { 

            var colours = ['#FF6B4A', '#3B5CC4', '#12284C', '#ABE8E8'];
            var rand = Math.floor(Math.random() * 3);
            document.body.style.background = colours[rand];
            // console.log(rand);
            
            window.setTimeout(() => window.scrollTo(0, 0), 1000)
        }
        router.events.on('routeChangeStart', handleRouteChange)
    }, [router.events])

    return (
        <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} key={router.asPath} />
        </AnimatePresence>
    )
}