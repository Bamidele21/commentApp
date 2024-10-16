
import axios from "axios"

const api = axios.create ({
    baseURL: 'http://localhost:3000',
    withCredentials: true
})
function makeRequests(url, options) {
    return api(url, options)
    .then(res => res.data)
    .catch(error => Promise.reject(error?.response?.data?.message??
        "An Error occurred"
    ))


}

export default makeRequests