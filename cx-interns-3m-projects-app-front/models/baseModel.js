import axios from 'axios'

/**
 * Generic function to perform all of our crud operations through strapi api
 * 
 * @param {*} method 
 * @param {*} url 
 * @param {*} token 
 * @param {*} params 
 * @returns 
 */
export async function processApiRequest(method, url, token, params = null) {
  // Create a config object to store our config for axios
  // Pass the user jwt token as well for authentication
  // Use the strapi url from the environment variables
  let config = {
    method,
    url: process.env.STRAPI_URL + url,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // If params are passed then add those to the config object under data property
  if (params) {
    config.data = {
      data: params
    }
  }

  // Send a request through axios to strapi api for further processing
  const res = await axios.request(config)
  // try catch block
  try {
    // Return successful response data
    return res.data
  } catch (error) {
    // Return error response data
    return error.response.data
  }
}

export async function performAction(
  model,
  action,
  token,
  params,
  queryParams = null
) {
  // An object for matching our actions to the method required for api request
  var methods = {
    find: 'get',
    findOne: 'get',
    create: 'post',
    update: 'put',
    delete: 'delete'
  }

  // An object for generating api endpoint for crud operations for strapi
  var endpointUrls = {
    find: `/api/${model}`,
    findOne: `/api/${model}/${params ? params.id : ''}`,
    create: `/api/${model}`,
    update: `/api/${model}/${params ? params.id : ''}`,
    delete: `/api/${model}/${params ? params.id : ''}`
  }

  // If query params are passed then add those the endpoint url as query string
  if (queryParams) {
    var endpointUrl =
      endpointUrls[action] + '?' + new URLSearchParams(queryParams).toString()
  } else {
    var endpointUrl = endpointUrls[action]
  }

  // Pass the data to the process api request function for final processing
  return await processApiRequest(
    methods[action],
    endpointUrl,
    token,
    params ? params.data : null
  )
}
