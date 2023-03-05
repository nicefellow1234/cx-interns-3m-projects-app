import axios from 'axios'
import Router from 'next/router'

/**
 * Generic function for handling records deletion
 * @param {*} model 
 * @param {*} id 
 * @param {*} redirect 
 * @param {*} setMessage 
 */
export async function handleDeleteRecord(model, id, redirect, setMessage) {
    // Send post request to our process api endpoint for further processing
    const result = await axios.post(`/api/processAction?model=${model}&action=delete&id=${id}`)
    // Redirect the user to the redirect route passed under the redirect parameter
    Router.replace(redirect)
    // Set the message to the message resturned from the api request
    setMessage(result.data.message)
    // Hide the message after 3 seconds
    setTimeout(() => {
        setMessage(null)
    }, 3000)
}