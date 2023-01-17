import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatapp-backend-taupe.vercel.app',
})

export default Api
