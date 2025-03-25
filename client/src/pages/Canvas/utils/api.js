import axios from 'axios' 

const local_api = 'http://localhost:5000' 
const production_api = ''

const api = axios.create({
    baseURL: local_api,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api