import type { NextPage } from 'next';
import Head from 'next/head';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../utils/trpc';
import {
  createLinkValidator,
  createLinkValidatorType
} from '../shared/createLinkValidator';
import { z } from 'zod';
const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<createLinkValidatorType>({
    resolver: zodResolver(createLinkValidator)
  });
  const onSubmit: SubmitHandler<createLinkValidatorType> = (data) => {};
  return (
    <div className="container">
      <Head>
        <title>UrlCut</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-60 px-1 sm:px-4 py-20 rounded-lg ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center space-y-4"
        >
          <label htmlFor="string" className="flex justify-between space-x-4">
            <span className="font-bold text-xl sm:text-4xl">URL:</span>
            <input
              defaultValue="test"
              {...register('url', { required: true })}
              className="font-bold grayscale  border-alternate text-alternate focus:grayscale-0 w-full  text-lg sm:text-2xl rounded bg-inherit border-b pb-1 px-2 focus:outline-none focus:bg-inherit"
            />
          </label>
          <label htmlFor="string" className="flex justify-between items-center">
            <span className="font-bold text-xl sm:text-4xl">
              url.mike4.dev/
            </span>
            <input
              {...register('tag')}
              className="font-bold grayscale  border-alternate text-alternate focus:grayscale-0 w-full  text-lg sm:text-2xl rounded bg-inherit border-b pb-1 px-2 focus:outline-none focus:bg-inherit"
            />
            <button className="w-52 ml-4 border-alternate text-alternate hover:grayscale-0  border grayscale transition-all rounded-lg px-2 py-2 hover:border-1">
              Pick
            </button>
          </label>

          {/* errors will return when field validation fails  */}
          {errors.url && <span>This field is required</span>}
          <button
            type="submit"
            className="hover:cursor-pointer  border-alternate text-alternate hover:grayscale-0  border grayscale transition-all rounded-lg px-2 py-2 hover:border-1"
          >
            Cut This Url
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
