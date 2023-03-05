import axios from 'axios'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Router from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

/**
 * Our default signup page component function
 * 
 * @param {*} props
 * @returns 
 */
export default function Signup() {
  // message state hook variable to track our app state messages
  const [message, setMessage] = useState(null)

  // Handles the user signup form submission
  const handleSubmit = async (e) => {
    // Avoid submitting data to the url which reloads the page
    e.preventDefault()

    // Set message to null upon every time form submission
    setMessage(null)

    // Our data object to store all values from the form
    // This object is to be passed onto strapi later for signup
    const data = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value
    }

    // This try catch block sends the above signup form data 
    // to our register api route for further processing
    try {
      // Send a post request to the register api route using axios
      const result = await axios.post('/api/register', data)

      // Use the returned user data above to Auto login the user after successful registration
      const res = await signIn('credentials', {
        redirect: false,
        ...data
      })
      // If login is successful then redirect the user to dashboard
      if (res.ok) {
        Router.replace('/dashboard')
        return
      }

      // setMessage({
      //   status: 1,
      //   text: "You have successfully created an account!",
      // });
    } catch (error) {
      // If an error occurs then we show the user the error
      // Update the message state upon failed account registration
      setMessage({ status: 0, text: error.response.data.message })
    }
  }

  return (
    <div>
      <Head>
        <title>Projects App - Sign Up</title>
      </Head>
      <section className='bg-gray-50 dark:bg-gray-900'>
        <div className='flex flex-col justify-center items-center px-6 mx-auto md:h-screen lg:py-0'>
          <a
            className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'
            href='#'
          >
            <img
              alt='logo'
              className='w-8 h-8 mr-2'
              src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg'
            />
            Projects App
          </a>
          <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
                Register your account
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
                {/* <div>
                          <input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" id="first-name" name="first-name" placeholder="First name" required="" type="text" />
                       </div>
                       <div>
                          <input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" id="last-name" name="last-name" placeholder="Last name" required="" type="text" />
                       </div> */}
                <div>
                  <input
                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    id='username'
                    name='username'
                    placeholder='Username'
                    required=''
                    type='text'
                  />
                </div>
                <div>
                  <input
                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    id='email-address'
                    name='email'
                    placeholder='Email address'
                    required=''
                    type='email'
                  />
                </div>
                <div>
                  <input
                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    id='password'
                    name='password'
                    placeholder='••••••••'
                    required=''
                    type='password'
                  />
                </div>
                <button
                  className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  type='submit'
                >
                  Sign up
                </button>
                <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                  Already have an account? &nbsp;
                  <Link
                    href='/signin'
                    className='font-medium text-primary-600 hover:underline dark:text-primary-500'
                  >
                    Sign in
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
