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
      <div className="container flex flex-col space-y-4 mt-60 px-4 sm:px-4 py-20">
        <h1 className="font-bold text-2xl sm:text-4xl text-center">
          {`https://url.mike4.dev/${getValues('tag')}`}
        </h1>
        <div className="flex w-full gap-4 justify-center">
          <button
            className="w-full hover:cursor-pointer border-alternate text-alternate hover:backdrop-grayscale backdrop-grayscale-0 border  transition-all rounded-lg px-2 py-2 hover:border-1"
            onClick={() => {
              setIsCopied(copy(`https://url.mike4.dev/${getValues('tag')}`))
            }}
          >
            Copy Link
          </button>
          <button
            className="w-52 ml-4 border-alternate text-alternate hover:grayscale-0  border grayscale transition-all rounded-lg px-2 py-2 hover:border-1"
            onClick={() => {
              reset()
              setIsCopied(false)
            }}
          >
            restart
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
      <div className="mt-60 px-1 sm:px-4 py-20 rounded-lg ">
        <form
          onSubmit={handleSubmit((data) => {
            createLink(data)
          })}
          className="flex flex-col justify-center space-y-4"
        >
          <label htmlFor="string" className="flex justify-between space-x-4">
            <span className="font-bold text-xl sm:text-4xl">URL:</span>
            <input
              {...register('url', { required: true })}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="font-bold  border-gray-500 focus:border-alternate w-full text-lg sm:text-2xl rounded bg-inherit border-b pb-1 px-2 focus:outline-none focus:bg-inherit"
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
              className={tagClass}
              onChange={(e) => {
                onTagChanged(e)
              }}
            />
            <input
              onClick={randomTag}
              type="button"
              value="Pick"
              className="w-52 ml-4 border-alternate text-alternate hover:grayscale-0  border grayscale transition-all rounded-lg px-2 py-2 hover:border-1"
            />
          </label>
          <input
            value=" Cut This Url"
            type="submit"
            disabled={isUnique.isFetched && !isUnique.data}
            className="disabled:grayscale hover:cursor-pointer  border-alternate text-alternate hover:backdrop-grayscale backdrop-grayscale-0 border  transition-all rounded-lg px-2 py-2 hover:border-1"
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
