import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { createContext } from 'react';
import { useRouter } from 'next/router';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import Header from '../components/header';
import AppFooter from '../components/footer';
import '../styles/landing.css';
import '../styles/login.css';

const clientSideEmotionCache = createEmotionCache();
export const authContext = createContext();
export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  console.log(router.asPath);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Guess My Book</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Component {...pageProps} />
        {router.asPath !== '/landing' ? <AppFooter /> : <div />}
      </ThemeProvider>
    </CacheProvider>
  );
}
