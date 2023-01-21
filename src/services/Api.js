import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatapp-xjmu.onrender.com',
})

export default Api
