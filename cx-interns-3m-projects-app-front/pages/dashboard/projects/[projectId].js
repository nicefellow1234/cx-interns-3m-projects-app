import { getSession } from 'next-auth/react'
import React, { useState } from 'react'
import { performAction } from '@/models/baseModel'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import TaskModal from '@/components/TaskModal'
import { handleDeleteRecord } from '@/services/common'

/**
 * Server side props function runs on serverside
 * Checks whether the user is logged in or not and takes appropriate action
 * 
 * @param {*} ctx
 * @returns 
 */
export async function getServerSideProps(ctx) {
  // Get user session from the request headers
  const userSession = await getSession(ctx)
  // Fetch the projectId slug from the query string available under ctx context param
  const { projectId } = ctx.query
  // If user is logged in then show the projects page
  // If not then redirect the user to the signin page for login
  if (userSession) {
    // Fetch the project from strapi using the generic function
    const project = await performAction(
      'projects',
      'findOne',
      userSession.jwt,
      {
        id: projectId
      }
    )
    // Fetch the categories from strapi using the generic function
    const categories = await performAction(
      'categories',
      'find',
      userSession.jwt
    )
    // Fetch the project tasks from strapi using the generic function
    const tasks = await performAction('tasks', 'find', userSession.jwt, null, {
      populate: '*',
      'filters[project][id][$eq]': projectId
    })

    // Pass the user session, project, categories & tasks under props to the component
    return {
      props: {
        userSession,
        project: project.data,
        categories,
        tasks
      }
    }
  } else {
    return {
      redirect: {
        destination: '/signin'
      }
    }
  }
}

/**
 * Our default projects view page component function
 * 
 * @param {*} props
 * @returns 
 */
export default function ProjectView({
  userSession,
  project,
  categories,
  tasks
}) {
  // message state hook variable to track our app state messages
  const [message, setMessage] = useState(null)
  // Edit record data state hook variable to store our record edit object
  const [editRecordData, setEditRecordData] = useState(null)
  // Modal state hook variable to track our popup modal state
  const [modalState, setModalState] = useState({
    modalHide: true,
    modalVisible: false
  })

  // Function to toggle the popup modal state
  // Stored an object here to preserve the modal transition animation
  const toggleModalState = (state = false) => {
    // If state set to true then set the visibility to 0 
    // But hide the modal after 0.2 seconds to show the transition animation
    // OR VICE VERSA
    if (state) {
      setModalState({ modalHide: false, modalVisible: false })
      setTimeout(() => setModalState({ modalHide: false, modalVisible: true }), 200)
    } else {
      setModalState({ modalHide: false, modalVisible: false })
      setTimeout(() => setModalState({ modalHide: true, modalVisible: false }), 300)
    }
  }

  // Submits tasks adding
  // The task record data is passed in the data parameter
  const submitTaskAdd = async (data) => {
    // Send a post request to our process action API route for further processing
    const result = await axios.post(
      `/api/processAction?model=tasks&action=create`,
      {
        data
      }
    )
    // Hide the popup modal now
    toggleModalState()
    // Redirect the user to projects view page
    Router.replace(`/dashboard/projects/${data.project}`)
    // Set the message upon successful task adding
    setMessage(result.data.message)
    // Hide the message after 3 seconds
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  // Submits tasks editing
  const submitTaskEdit = async (data) => {
    // Send a post request to our process action API route for further processing
    const result = await axios.post(
      `/api/processAction?model=tasks&action=update&id=${data.id}`,
      {
        data
      }
    )
    // Set the edit record data state hook variable to null 
    // upon everytime task editing form submission
    setEditRecordData(null)
    // Hide the popup modal now
    toggleModalState()
    // Redirect the user to dashboard
    Router.replace(`/dashboard/projects/${data.project}`)
    // Set the message upon successful task editing
    setMessage(result.data.message)
    // Hide the message after 3 seconds
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  return (
    <div>
      <Head>
        <title>Projects App - Project - Tasks</title>
      </Head>
      <Navbar userSession={userSession} />
      <div className='py-10 bg-gray-100 min-h-screen'>
        <div className='max-w-screen-2xl mx-auto px-6'>
          <button
            onClick={() => {
              toggleModalState(true)
              setEditRecordData(null)
            }}
            className='inline-flex items-center py-2.5 px-10 mb-2 text-sm font-medium text-center text-white bg-fuchsia-600 rounded-lg focus:ring-4 hover:bg-fuchsia-900'
          >
            Add Task
          </button>
          <div
            className={`flex p-4 text-sm text-green-800 border ${message ? '' : 'invisible'
              } border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800`}
            role='alert'
          >
            <span className='font-medium mr-1'>Success!</span> {message}.
          </div>
        </div>
        <div className='mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-6 py-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
          {categories.data.map((category) => (
            <article
              className='rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300'
              key={category.id}
            >
              <div className='relative flex items-center h-14 space-x-1.5 rounded-lg bg-blue-500 text-white duration-100 hover:bg-blue-600 mb-5'>
                <h2 className='mx-auto text-1xl'>{category.attributes.name}</h2>
              </div>
              {tasks.data.map((task) => (
                <React.Fragment key={task.id}>
                  {task.attributes.category.data.id == category.id ? (
                    <div
                      className='mt-1 rounded-xl bg-pink-500 text-white text-sm p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300'
                    >
                      <Link href={`/dashboard/projects/tasks/${task.id}`}>
                        {task.attributes.title}
                      </Link>
                      <div className='flex mt-4 space-x-2'>
                        <button
                          onClick={() => {
                            toggleModalState(true)
                            setEditRecordData(task)
                            console.log(task)
                          }}
                          type='button'
                          className='w-full h-8 flex items-center justify-center px-3 py-2 font-medium text-center text-white bg-pink-400 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800'
                        >
                          <svg
                            className='w-4 h-4 mr-2'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                            />
                          </svg>
                          <span className='justify-center'>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRecord('tasks', task.id, `/dashboard/projects/${project.id}`, setMessage)}
                          type='button'
                          className='w-full h-8 flex items-center justify-center px-3 py-2 font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
                        >
                          <svg
                            className='w-5 h-5 mr-2'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                          </svg>
                          <span className='justify-center'>Delete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ))}
            </article>
          ))}
        </div>
      </div>
      <TaskModal
        modalState={modalState}
        editRecordData={editRecordData}
        toggleModalState={(state) => toggleModalState(state)}
        formRenderData={{ categories: categories.data }}
        relationData={{ project: project.id }}
        setFormData={(data) => editRecordData ? submitTaskEdit(data) : submitTaskAdd(data)}
      />
    </div>
  )
}