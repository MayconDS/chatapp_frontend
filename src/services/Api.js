import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatapp-zmlc.onrender.com',
})

export default Api
