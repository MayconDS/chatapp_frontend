import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatapp-6qeg.onrender.com',
})

export default Api
