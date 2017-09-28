import axios from 'axios'
import SlackError from './slack-error'

const slackAxiosClient = axios.create({
  baseURL: 'https://slack.com/api',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
  },
  transformRequest: [
    data =>
      Object.keys(data)
        .map(k => [k, data[k]])
        .map(([k, v]) => `${k}=${v}`)
        .join('&'),
  ],
})

const apiToken = process.env.NODE_SLACKAPI_TOKEN

export function api(method: string, data?: object): Promise<any> {
  return slackAxiosClient
    .post(`/${method}`, Object.assign({ token: apiToken }, data || {}))
    .then(r => {
      const res = r.data
      if (res.ok) {
        delete res.ok
        return res
      } else {
        return Promise.reject(new SlackError(res.error))
      }
    })
}
