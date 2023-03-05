import { getSession } from 'next-auth/react'
import { performAction } from '@/models/baseModel'

/**
 * Processes the api request passed from the app
 * This is a generic function which processes all of the crud operations
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export default async function handler(req, res) {
  // Get user session from the request headers
  const userSession = await getSession({ req })
  // Fetch the model & action from the query string
  const { model, action } = req.query
  // Fetch the form data
  const data = req.body ? req.body : {}

  // If id is passed in query string then add the id to the form data as well for viewing, editing & deleting
  if (req.query.id) {
    data.id = req.query.id
  }

  // Set a default result object set to error state
  var result = {
    error: true,
    message: 'Something bad happened!'
  }

  // An object for updating the crud operations messages
  var messageArr = {
    create: 'added',
    update: 'updated',
    delete: 'deleted'
  }

  // Pass the parameters to the generic perform action for further processing
  var resData = await performAction(model, action, userSession.jwt, data)
  // Update the message with the correct words based on model & action
  result.message = `${model.slice(0, -1)} has been successfully ${messageArr[action]
    }!`

  // If response is not null then update the result object to success state
  // Also add the returned data under data property as well
  if (resData != undefined) {
    result.error = false
    result.data = resData.data
  }

  // If an error occured then return 400 status response with the result object
  // Otherwise return status 200 with the updated result object
  if (result.error) {
    return res.status(400).json(result)
  } else {
    return res.status(200).json(result)
  }
}