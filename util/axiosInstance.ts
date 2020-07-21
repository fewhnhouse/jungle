import axios from 'axios'

const authInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_TAIGA_API_URL,
})

export default authInstance
