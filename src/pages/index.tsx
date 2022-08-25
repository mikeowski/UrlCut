import type { NextPage } from 'next'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '../utils/trpc'
import { nanoid } from 'nanoid'
import classnames from 'classnames'
import debounce from 'lodash/debounce'
import copy from 'copy-to-clipboard'
import {
  createLinkValidator,
  createLinkValidatorType,
} from '../shared/createLinkValidator'
import { ChangeEvent, useState } from 'react'
const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    getValues,
    reset,
  } = useForm<createLinkValidatorType>({
    resolver: zodResolver(createLinkValidator),
  })
  const [tag, setTag] = useState('')
  const onTagChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value)
    debounce(isUnique.refetch, 100)
  }
  const [isCoppied, setIsCopied] = useState<boolean>(false)
  const { mutate: createLink, status: createLinkStatus } = trpc.useMutation([
    'link.createLink',
  ])

  const isUnique = trpc.useQuery(['link.ısTagUnique', { tag: tag }], {
    refetchOnReconnect: false, // replacement for enable: false which isn't respected.
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const randomTag = () => {
    const rndm = nanoid(20)
    setValue('tag', rndm)
    setTag(rndm)
  }
  const tagClassMain =
    'font-bold border-gray-500 focus:border-alternate w-full text-lg sm:text-2xl rounded bg-inherit border-b pb-1 px-2 focus:outline-none focus:bg-inherit'

  const tagClass = classnames(tagClassMain, {
    ' text-alternate': isUnique.isFetched && !isUnique.data,
  })

  if (createLinkStatus === 'success' && isSubmitted) {
    return (
      <div className="container flex flex-col px-4 py-20 mt-60 space-y-4 sm:px-4">
        <h1 className="text-2xl font-bold text-center sm:text-4xl">
          {`https://url.mike4.dev/${getValues('tag')}`}
        </h1>
        <div className="flex justify-center w-full gap-4">
          <button
            className="w-full px-2 py-2 border rounded-lg hover:border-1 border-alternate text-alternate backdrop-grayscale-0 transition-all hover:cursor-pointer hover:backdrop-grayscale"
            onClick={() => {
              setIsCopied(copy(`https://url.mike4.dev/${getValues('tag')}`))
            }}
          >
            Copy Link
          </button>
          <button
            className="px-2 py-2 ml-4 border rounded-lg hover:border-1 w-52 border-alternate text-alternate grayscale transition-all hover:grayscale-0"
            onClick={() => {
              reset()
              setIsCopied(false)
            }}
          >
            New Url
          </button>
        </div>
        {isCoppied && <span className="text-xl text-center">Copied!</span>}
      </div>
    )
  }
  return (
    <div className="container">
      <Head>
        <title>UrlCut</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:title" content="UrlCut" key="title" />
        <meta
          property="description"
          content="Simple url shortener, Url Cut"
          key="description"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="px-1 py-20 rounded-lg mt-60 sm:px-4 ">
        <form
          onSubmit={handleSubmit((data) => {
            createLink(data)
          })}
          className="flex flex-col justify-center space-y-4"
        >
          <label htmlFor="string" className="flex justify-between space-x-4">
            <span className="text-xl font-bold sm:text-4xl">URL:</span>
            <input
              {...register('url', { required: true })}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="w-full px-2 pb-1 text-lg font-bold border-b border-gray-500 rounded bg-inherit focus:border-alternate focus:bg-inherit focus:outline-none sm:text-2xl"
            />
          </label>
          <label htmlFor="string" className="flex items-center justify-between">
            <span className="text-xl font-bold sm:text-4xl">
              url.mike4.dev/
            </span>
            <input
              {...register('tag', { required: true })}
              placeholder="important"
              pattern={'^[-a-zA-Z0-9]+$'}
              className={tagClass}
              onChange={(e) => {
                onTagChanged(e)
              }}
            />
            <input
              onClick={randomTag}
              type="button"
              value="Pick"
              className="px-2 py-2 ml-4 border rounded-lg hover:border-1 w-52 border-alternate text-alternate grayscale transition-all hover:cursor-pointer hover:grayscale-0"
            />
          </label>
          <input
            value=" Cut This Url"
            type="submit"
            disabled={isUnique.isFetched && !isUnique.data}
            className="px-2 py-2 border rounded-lg hover:border-1 border-alternate text-alternate backdrop-grayscale-0 transition-all hover:cursor-pointer hover:backdrop-grayscale disabled:grayscale"
          />
          {errors.url && <span>Url is required</span>}
          {errors.tag && <span>Tag is required</span>}
          {isUnique.isFetched && !isUnique.data && (
            <span>Tag is not unique!</span>
          )}
        </form>
      </div>
    </div>
  )
}

export default Home
