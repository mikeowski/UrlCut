import type { NextPage } from 'next';
import Head from 'next/head';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../utils/trpc';
import { nanoid } from 'nanoid';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import {
  createLinkValidator,
  createLinkValidatorType
} from '../shared/createLinkValidator';
import { divide } from 'lodash';
const Home: NextPage = () => {
  const mainUrl = window.location.origin;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    reset
  } = useForm<createLinkValidatorType>({
    resolver: zodResolver(createLinkValidator)
  });

  const {
    mutate: createLink,
    isLoading,
    status: createLinkStatus
  } = trpc.useMutation(['link.createLink']);

  const isUnique = trpc.useQuery(
    ['link.ısTagUnique', { tag: getValues('tag') }],
    {
      refetchOnReconnect: false, // replacement for enable: false which isn't respected.
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const randomTag = () => {
    setValue('tag', nanoid());
  };
  const tag =
    'font-bold grayscale border-alternate focus:grayscale-0 w-full text-lg sm:text-2xl rounded bg-inherit border-b pb-1 px-2 focus:outline-none focus:bg-inherit';

  classnames(tag, {
    'text-alternate': isUnique.isFetched && !isUnique.data
  });
  if (createLinkStatus === 'success') {
    return (
      <>
        <div className="flex justify-center items-center">
          <h1>{`${mainUrl}/${getValues('url')}`}</h1>
          <input
            type="button"
            value="Copy Link"
            className="rounded bg-pink-500 py-1.5 px-1 font-bold cursor-pointer ml-2"
            onClick={() => {
              copy(`${url}/${form.slug}`);
            }}
          />
        </div>
        <input
          type="button"
          value="Reset"
          className="rounded bg-pink-500 py-1.5 px-1 font-bold cursor-pointer m-5"
          onClick={() => {
            reset();
          }}
        />
      </>
    );
  }
  return (
    <div className="container">
      <Head>
        <title>UrlCut</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-60 px-1 sm:px-4 py-20 rounded-lg ">
        <form
          onSubmit={handleSubmit((data) => createLink(data))}
          className="flex flex-col justify-center space-y-4"
        >
          <label htmlFor="string" className="flex justify-between space-x-4">
            <span className="font-bold text-xl sm:text-4xl">URL:</span>
            <input
              {...register('url', { required: true })}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="font-bold grayscale  border-alternate text-alternate focus:grayscale-0 w-full  text-lg sm:text-2xl rounded bg-inherit border-b pb-1 px-2 focus:outline-none focus:bg-inherit"
            />
          </label>
          <label htmlFor="string" className="flex justify-between items-center">
            <span className="font-bold text-xl sm:text-4xl">
              url.mike4.dev/
            </span>
            <input
              {...register('tag', { required: true })}
              placeholder="important"
              pattern={'^[-a-zA-Z0-9]+$'}
              className={tag}
              onChange={(e) => {
                debounce(isUnique.refetch, 100);
                console.log(getValues('tag'));
              }}
            />
            <button
              onClick={randomTag}
              className="w-52 ml-4 border-alternate text-alternate hover:grayscale-0  border grayscale transition-all rounded-lg px-2 py-2 hover:border-1"
            >
              Pick
            </button>
          </label>

          {/* errors will return when field validation fails  */}
          {errors.url && <span>This field is required</span>}
          <button
            type="submit"
            className="hover:cursor-pointer  border-alternate text-alternate hover:backdrop-grayscale backdrop-grayscale-0 border  transition-all rounded-lg px-2 py-2 hover:border-1"
          >
            Cut This Url
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
