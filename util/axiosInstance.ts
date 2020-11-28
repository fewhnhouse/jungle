import axios from 'axios'

const authInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_TAIGA_API_URL,
})

const publicInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_TAIGA_API_URL,
})

authInstance.interceptors.request.use(
    function (config) {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth-token')
            config.headers.Authorization = token && `Bearer ${token}`
            // Do something before request is sent
            return { ...config }
        } else {
            return config
        }
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

// Add a response interceptor
authInstance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response
    },
    function (error) {
        if (error?.response?.status === 401) {
            localStorage.clear()
        }
        console.error(error)
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
    }
)

export { authInstance, publicInstance }
