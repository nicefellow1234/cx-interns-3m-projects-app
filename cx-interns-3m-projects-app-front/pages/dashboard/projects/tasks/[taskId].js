import { getSession } from 'next-auth/react'
import { useState } from 'react'
import { performAction } from '@/models/baseModel'
import axios from 'axios'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import moment from 'moment/moment'
import Router from 'next/router'
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
  // Fetch the taskId slug from the query string available under ctx context param
  const { taskId } = ctx.query
  // If user is logged in then show the task view page
  // If not then redirect the user to the signin page for login
  if (userSession) {
    // Fetch the task from strapi using the generic function
    const task = await performAction('tasks', 'findOne', userSession.jwt, {
      id: taskId
    })
    // Fetch the comments from strapi using the generic function
    const comments = await performAction(
      'comments',
      'find',
      userSession.jwt,
      null,
      {
        populate: '*',
        'filters[task][id][$eq]': taskId,
        sort: 'createdAt:desc'
      }
    )

    // Pass the user session, task & comments under props to the component
    return {
      props: {
        userSession,
        task,
        comments
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
 * Our default task view page component function
 * 
 * @param {*} props
 * @returns 
 */
export default function TaskView({ userSession, task, comments }) {
  // message state hook variable to track our app state messages
  const [message, setMessage] = useState(null)
  // Edit record data state hook variable to store our record edit object
  const [editRecordData, setEditRecordData] = useState(null)

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

  // Submits comments adding
  // The comments record data is passed in the data parameter under form event
  const submitCommentAdd = async (e) => {
    // Avoid submitting data to the url which reloads the page
    e.preventDefault()
    // Set message to null upon every time form submission
    setMessage(null)
    // Send a post request to our process action API route for further processing
    const res = await axios.post(
      '/api/processAction?model=comments&action=create',
      {
        data: {
          text: e.target.comment.value,
          task: task.data.id,
          user: userSession.user.id
        }
      }
    )
    // Set the comment field to null for a new comment
    e.target.comment.value = ''
    // Reload the tasks view page to show the updated comments
    Router.replace(`/dashboard/projects/tasks/${task.data.id}`)
    // Set the message upon successful comment adding
    setMessage(res.data.message)
    // Hide the message after 3 seconds
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  // Submits comment editing
  const submitCommentEdit = async (taskId, commentId) => {
    // Send a post request to our process action API route for further processing
    const result = await axios.post(
      `/api/processAction?model=comments&action=update&id=${commentId}`,
      {
        data: editRecordData
      }
    )
    // Set the edit record data state hook variable to null 
    // upon everytime comment editing form submission
    setEditRecordData(null)
    // Reload the tasks view page to show the updated comments
    Router.replace(`/dashboard/projects/tasks/${taskId}`)
    // Set the message upon successful comment editing
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
      <div className='py-5 bg-gray-100'>
        <div
          className={`flex p-4 max-w-2xl mx-auto mb-2 text-sm text-green-800 border ${message ? '' : 'invisible'
            } border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800`}
          role='alert'
        >
          <span className='font-medium mr-1'>Success!</span> {message}.
        </div>
        <div className='max-w-2xl mx-auto px-4'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-lg lg:text-2xl font-bold text-gray-900 dark:text-white'>
              {task.data.attributes.title}
            </h2>
          </div>
          <form className='mb-6' onSubmit={submitCommentAdd}>
            <div className='py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
              <textarea
                id='comment'
                name='comment'
                rows='3'
                className='px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800'
                placeholder='Write a comment...'
                required
              ></textarea>
            </div>
            <button
              type='submit'
              className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-indigo-600 rounded-lg focus:ring-4 hover:bg-indigo-700'
            >
              Post comment
            </button>
          </form>
          {comments.data.map((comment) => (
            <article
              className='p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-900'
              key={comment.id}
            >
              <footer className='flex justify-between items-center mb-2'>
                <div className='flex items-center'>
                  <p className='inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white'>
                    <img
                      className='mr-2 w-6 h-6 rounded-full'
                      src='https://cdn-icons-png.flaticon.com/512/1946/1946429.png'
                    />
                    {comment.attributes.user.data.attributes.username}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {moment(comment.attributes.createdAt)
                      .utc()
                      .format('MMM. D, YYYY hh:mm A')}
                  </p>
                </div>
                <div className='flex space-x-2 text-xs'>
                  <button
                    onClick={() => editRecordData && editRecordData.id == comment.id ? submitCommentEdit(task.data.id, comment.id) : handleEditRecordData(null, comment.id)}
                    type='button'
                    className='w-full flex items-center justify-center px-3 py-1 font-medium text-center text-white bg-green-500 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800'
                  >
                    <svg
                      class='w-6 h-4'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                      />
                    </svg>
                    {editRecordData && editRecordData.id == comment.id ? 'Apply' : 'Edit'}
                  </button>
                  <button
                    onClick={() => editRecordData && editRecordData.id == comment.id ? setEditRecordData(null) : handleDeleteRecord('comments', comment.id, `/dashboard/projects/tasks/${task.data.id}`, setMessage)}
                    type='button'
                    className='w-full flex items-center justify-center px-3 py-1 font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
                  >
                    <svg
                      class='w-6 h-5'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    {editRecordData && editRecordData.id == comment.id ? 'Cancel' : 'Delete'}
                  </button>
                </div>
              </footer>
              <p className='text-gray-500 dark:text-gray-400'>
                {editRecordData && editRecordData.id == comment.id ? <textarea className='w-full' name='text' rows="3" onChange={handleEditRecordData} defaultValue={comment.attributes.text}></textarea> : comment.attributes.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
