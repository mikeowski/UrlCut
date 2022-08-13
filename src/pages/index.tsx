import type { NextPage } from 'next'
import Head from 'next/head'
import { SubmitHandler, useForm } from 'react-hook-form'
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
import { divide } from 'lodash'
import { ChangeEvent, useEffect, useState } from 'react'
import Logo from '../components/logo'
const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
    setValue,
    getValues,
    reset,
    getFieldState,
  } = useForm<createLinkValidatorType>({
    resolver: zodResolver(createLinkValidator),
  })
  const [tag, setTag] = useState('')
  const onTagChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value)
    debounce(isUnique.refetch, 100)
  }
  const [isCoppied, setIsCopied] = useState<boolean>(false)
  const {
    mutate: createLink,
    isLoading,
    status: createLinkStatus,
  } = trpc.useMutation(['link.createLink'])

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
      <div className="container mt-60 flex flex-col space-y-4 px-4 py-20 sm:px-4">
        <h1 className="text-center text-2xl font-bold sm:text-4xl">
          {`https://url.mike4.dev/${getValues('tag')}`}
        </h1>
        <div className="flex w-full justify-center gap-4">
          <button
            className="hover:border-1 w-full rounded-lg border border-alternate px-2 py-2  text-alternate backdrop-grayscale-0 transition-all hover:cursor-pointer hover:backdrop-grayscale"
            onClick={() => {
              setIsCopied(copy(`https://url.mike4.dev/${getValues('tag')}`))
            }}
          >
            Copy Link
          </button>
          <button
            className="hover:border-1 ml-4 w-52 rounded-lg border  border-alternate px-2 py-2 text-alternate grayscale transition-all hover:grayscale-0"
            onClick={() => {
              reset()
              setIsCopied(false)
            }}
          >
            New Url
          </button>
        </div>
        {isCoppied && <span className="text-center text-xl">Copied!</span>}
      </div>
    )
  }
  return (
    <div className="container">
      <Head>
        <title>UrlCut</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex w-full justify-center pt-4">
        <Logo width={120} height={120} fillColor={'#E9E8D4'} />
      </header>

      <div className="mt-60 rounded-lg px-1 py-20 sm:px-4 ">
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
              className="w-full  rounded border-b border-gray-500 bg-inherit px-2 pb-1 text-lg font-bold focus:border-alternate focus:bg-inherit focus:outline-none sm:text-2xl"
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
              className="hover:border-1 ml-4 w-52 rounded-lg border border-alternate  px-2 py-2 text-alternate grayscale transition-all hover:cursor-pointer hover:grayscale-0"
            />
          </label>
          <input
            value=" Cut This Url"
            type="submit"
            disabled={isUnique.isFetched && !isUnique.data}
            className="hover:border-1 rounded-lg  border border-alternate px-2 py-2 text-alternate  backdrop-grayscale-0 transition-all hover:cursor-pointer hover:backdrop-grayscale disabled:grayscale"
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
