import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatapp-backend-992c.onrender.com',
})

export default Api
