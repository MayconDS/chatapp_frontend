import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatappbackend-production-45fa.up.railway.app',
})

export default Api
