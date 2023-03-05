import axios from 'axios'

/**
 * Handles strapi user registraion api processing
 * 
 * @param {*} req 
 * @param {*} res 
 */
export default async function handler(req, res) {
  // Try catch block
  try {
    // Send the user registration data to strapi api for registration
    const result = await axios.post(
      `${process.env.STRAPI_URL}/api/auth/local/register`,
      req.body
    )
    // If user is registered successful then return 200 status with the user registered data
    res.status(200).json(result.data)
  } catch (error) {
    // Otherwise return the error with error status code returned from strapi api
    res.status(error.response.data.error.status).json(error.response.data.error)
  }
}