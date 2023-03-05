import { getSession } from 'next-auth/react'
import { useState } from 'react'
import { performAction } from '@/models/baseModel'
import Link from 'next/link'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Router from 'next/router'
import axios from 'axios'
import ProjectModal from '@/components/ProjectModal'
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

  // If user is logged in then show the dashboard page
  // If not then redirect the user to the signin page for login
  if (userSession) {
    // Fetch the projects from strapi using the generic function
    const projects = await performAction(
      'projects',
      'find',
      userSession.jwt,
      null,
      {
        populate: '*'
      }
    )

    // Pass the fetched projects & user session object under props to the component
    return {
      props: {
        userSession,
        projects
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
 * Our default dashboard page component function
 * 
 * @param {*} props
 * @returns 
 */
export default function Dashboard({ userSession, projects }) {
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

  // Handles our record data submission for further processing
  const handleEditRecordData = (e, id = null) => {
    // If an id is passed in there that means we are editing a new record
    if (id) {
      // Checks whether we already have an edit record currently being edited
      // Also checks whether we are editing the current record or a new one
      // If the record is a new one i.e. the id does not match with the one stored 
      // So make sure to take a new empty object for storing new edit record data
      var data = editRecordData && editRecordData.id == id ? editRecordData : {}
      // Add the id to the data
      data.id = id
    }
    // An event which is pased upon change in dom element i.e. an input changes
    if (e) {
      // Check if we are already editing a record then use that record
      var data = editRecordData ? editRecordData : {}
      // Take the event target element attribute name and also it's value
      // And store it into the data object
      data[e.target.getAttribute('name')] = e.target.value
    }
    // At last update the edit record data state hook varibale with the newly updated edit record data
    setEditRecordData(data)
  }

  // Submits projects adding
  // The project record data is passed in the data parameter
  const submitProjectAdd = async (data) => {
    // Send a post request to our process action API route for further processing
    const result = await axios.post(
      `/api/processAction?model=projects&action=create`,
      {
        data
      }
    )
    // Hide the popup modal now
    toggleModalState()
    // Reload the dashboard to show the updated projects
    Router.replace(`/dashboard`)
    // Set the message upon successful project adding
    setMessage(result.data.message)
    // Hide the message after 3 seconds
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  // Submits project editing
  const submitProjectEdit = async (id) => {
    // Send a post request to our process action API route for further processing
    const result = await axios.post(
      `/api/processAction?model=projects&action=update&id=${id}`,
      {
        data: editRecordData
      }
    )
    // Set the edit record data state hook variable to null 
    // upon everytime project editing form submission
    setEditRecordData(null)
    // Redirect the user to dashboard
    Router.replace('/dashboard')
    // Set the message upon successful project editing
    setMessage(result.data.message)
    // Hide the message after 3 seconds
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  return (
    <div>
      <Head>
        <title>Projects App - Dashboard</title>
      </Head>
      <Navbar userSession={userSession} />
      <div className='py-10 bg-gray-100 min-h-screen'>
        <div className='max-w-screen-2xl mx-auto px-6'>
          <button
            onClick={() => toggleModalState(true)}
            className='inline-flex items-center py-2.5 px-10 mb-2 text-sm font-medium text-center text-white bg-fuchsia-600 rounded-lg focus:ring-4 hover:bg-fuchsia-900'
          >
            Add Project
          </button>
          <div
            className={`flex p-4 text-sm text-green-800 border ${message ? '' : 'invisible'
              } border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800`}
            role='alert'
          >
            <span className='font-medium mr-1'>Success!</span> {message}.
          </div>
        </div>
        <div className='mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {projects.data.map((project) => (
            <article
              className='rounded-xl flex flex-col h-full bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300'
              key={project.id}
            >
              <div className='relative space-x-1.5 rounded-lg bg-blue-500 text-white duration-100 hover:bg-blue-600'>
                <span className='text-lg absolute top-1 left-4'>
                  {editRecordData && editRecordData.id == project.id ? (
                    <input
                      type='text'
                      name='abbreviation'
                      size='1'
                      className='bg-blue-500 text-lg'
                      onChange={(e) => {
                        handleEditRecordData(e)
                      }}
                      defaultValue={project.attributes.abbreviation}
                    />
                  ) : (
                    project.attributes.abbreviation
                  )}
                </span>
                <div className='flex items-center h-40'>
                  <h2 className='mx-auto text-2xl text-center'>
                    {editRecordData && editRecordData.id == project.id ? (
                      <textarea
                        type='text'
                        name='title'
                        className='bg-blue-500 w-full text-center'
                        onChange={(e) => {
                          handleEditRecordData(e)
                        }}
                        defaultValue={project.attributes.title}
                      ></textarea>
                    ) : (
                      project.attributes.title
                    )}
                  </h2>
                </div>
              </div>
              <div className='mt-1 p-2 flex flex-col h-full'>
                <p className='mt-1 text-sm text-slate-400'>
                  {editRecordData && editRecordData.id == project.id ? (
                    <textarea
                      type='text'
                      rows='5'
                      name='description'
                      className='w-full'
                      onChange={(e) => {
                        handleEditRecordData(e)
                      }}
                      defaultValue={project.attributes.description}
                    ></textarea>
                  ) : (
                    project.attributes.description
                  )}
                </p>
                <div className='flex items-end h-full'>
                  <div className='w-full'>
                    <div className='mt-3 flex items-end justify-between'>
                      <p className='text-lg font-bold text-blue-500'>
                        {project.attributes.tasks.data.length} Tasks
                      </p>
                      <div className='flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600'>
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className='text-sm'
                        >
                          View Tasks
                        </Link>
                      </div>
                    </div>
                    <div className='flex mt-4 space-x-2 text-sm'>
                      <button
                        type='button'
                        onClick={() => {
                          editRecordData && editRecordData.id == project.id
                            ? submitProjectEdit(project.id)
                            : handleEditRecordData(null, project.id)
                        }}
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
                        <span className='justify-center'>
                          {editRecordData && editRecordData.id == project.id
                            ? 'Apply'
                            : 'Edit'}
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          editRecordData && editRecordData.id == project.id
                            ? setEditRecordData(null)
                            : handleDeleteRecord('projects', project.id, '/dashboard', setMessage)
                        }
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
                        <span className='justify-center'>
                          {editRecordData && editRecordData.id == project.id
                            ? 'Cancel'
                            : 'Delete'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ProjectModal
        modalState={modalState}
        toggleModalState={(state) => toggleModalState(state)}
        setFormData={(data) => submitProjectAdd(data)}
      />
    </div>
  )
}
