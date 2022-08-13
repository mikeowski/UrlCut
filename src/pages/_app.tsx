import { withTRPC } from '@trpc/next'
import { AppType } from 'next/dist/shared/lib/utils'
import { AppRouter } from './api/trpc/[trpc]'
import superjson from 'superjson'
import '../styles/globals.css'
import Logo from '../components/logo'
import Footer from '../components/footer'
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <header className="flex w-full justify-center pt-4">
        <Logo width={120} height={120} fillColor={'#E9E8D4'} />
      </header>
      <Component {...pageProps} />
      <Footer />
    </>
  )
}
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query-v3.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp)
