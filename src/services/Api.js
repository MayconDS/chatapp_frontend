import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatapp-j3pi.onrender.com',
})

export default Api
