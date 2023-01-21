import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatapp-backend-kwig.onrender.com',
})

export default Api
