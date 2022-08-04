import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['link.getAllLinks']);
  return (
    <div className="container">
      <Head>
        <title>UrlCut</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1 className="text-6xl text-center">UrlCut</h1>
        {isLoading ? (
          <div>Loading</div>
        ) : (
          data?.map((link) => <div key={link.id}>{link.tag}</div>)
        )}
      </div>
    </div>
  );
};

export default Home;
