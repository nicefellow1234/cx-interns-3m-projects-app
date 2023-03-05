import axios from 'axios'

// Fetch the strapi URL from the environment variables
const strapiUrl = process.env.STRAPI_URL

/**
 * Handles the authentiation of user from strapi
 * 
 * @param {*} params
 * @returns 
 */
export async function signIn({ email, password }) {
  // Send post request to the strapi user authentication api endpoint for authentication
  const res = await axios.post(`${strapiUrl}/api/auth/local`, {
    identifier: email,
    password
  })
  // Return response data
  return res.data
}
