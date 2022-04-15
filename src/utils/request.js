import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import Vue from 'vue';

axios.defaults.withCredentials = true

function getBaseUrl() {
  return Vue.prototype.BASE_URL
}

// create an axios instance
const service = axios.create({
    baseURL: getBaseUrl(),
    timeout: 5000
})

service.interceptors.request.use(config => {
    return config
}, err => {
    console.log(err);
})

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
