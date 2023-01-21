import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatapp-op54.onrender.com',
})

export default Api
