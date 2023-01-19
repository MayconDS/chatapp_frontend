import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://chatapp-50bm.onrender.com',
})

export default Api
