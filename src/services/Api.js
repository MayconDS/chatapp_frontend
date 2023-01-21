import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatapp-backend-0c25.onrender.com',
})

export default Api
