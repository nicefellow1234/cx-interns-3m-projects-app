import Router from 'next/router'
import { useSession, getSession, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'

/**
 * Server side props function runs on serverside
 * Checks whether the user is logged in or not and takes appropriate action
 * 
 * @param {*} param 
 * @returns 
 */
export async function getServerSideProps({ req }) {
  // Get user session from the request headers
  const session = await getSession({ req })

  // If user is logged in then redirect to dashboard
  // If not then show the signin page for login
  if (session) {
    return {
      redirect: {
        destination: '/dashboard'
      },
      props: {}
    }
  } else {
    return {
      props: {}
    }
  }
}

/**
 * Our default signin page component function
 * 
 * @param {*} props
 * @returns 
 */
export default function Signin() {
  // message state hook variable to track our app state messages
  const [message, setMessage] = useState(null)

  // Handles the user login form submission
  const handleSubmit = async (e) => {
    // Avoid submitting data to the url which reloads the page
    e.preventDefault()

    // Set message to null upon every time form submission
    setMessage(null)

    // Sign in function provided by Next Auth package
    // The first parameter string is provider 
    // while the second parameter object is config params & form data
    const result = await signIn('credentials', {
      redirect: false,
      email: e.target.email.value,
      password: e.target.password.value
    })
    // If user is logged in then redirect to dashboard
    // If not then set the message state varibale to show user a message
    if (result.ok) {
      Router.replace('/dashboard')
    } else {
      setMessage({ status: 0, text: result.error })
    }
  }

  return (
    <div>
      <Head>
        <title>Projects App - Sign In</title>
      </Head>
      <section className='bg-gray-50 dark:bg-gray-900'>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
          <a
            href='#'
            className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'
          >
            <img
              className='w-8 h-8 mr-2'
              src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg'
              alt='logo'
            />
            Projects App
          </a>
          <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
                Sign in to your account
              </h1>
              {message ? (
                <div
                  className={`flex items-center ${message.status ? 'bg-blue-500' : 'bg-red-500'
                    } text-white text-sm font-bold px-4 py-3`}
                  role='alert'
                >
                  <p>{message.text}</p>
                </div>
              ) : (
                ''
              )}
              <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor='identifier'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Your email
                  </label>
                  <input
                    type='text'
                    name='email'
                    id='email'
                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Email Address or Username'
                    required='required'
                  />
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    id='password'
                    placeholder='••••••••'
                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    required='required'
                  />
                </div>
                {/* <div className='flex items-center justify-between'>
                  <div className='flex items-start'>
                    <div className='flex items-center h-5'>
                      <input
                        id='remember'
                        aria-describedby='remember'
                        type='checkbox'
                        className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800'
                        required=''
                      />
                    </div>
                    <div className='ml-3 text-sm'>
                      <label
                        htmlFor='remember'
                        className='text-gray-500 dark:text-gray-300'
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href='#'
                    className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'
                  >
                    Forgot password?
                  </a>
                </div> */}
                <button
                  className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  type='submit'
                >
                  Sign in
                </button>
                <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                  Don’t have an account yet? &nbsp;
                  <Link
                    href='/signup'
                    className='font-medium text-primary-600 hover:underline dark:text-primary-500'
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
