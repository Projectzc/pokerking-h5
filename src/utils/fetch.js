/**
 * fetch.js
 *
 * @des the file dees
 * @author lorne (2270333671@qq.com)
 * Created at 2018/6/1.
 *
 */

import {create, SERVER_ERROR, TIMEOUT_ERROR, NETWORK_ERROR} from 'apisauce';
import api from './api'
import api2 from './api2'
import {isStrNull, logMsg} from "../utils/utils";


function basic_api() {
    const api_env = process.env.REACT_APP_KKAPI_ENV
    if (api_env === 'dev') return api.dev

    if (api_env === 'test') return api.test

    return api.production
}

function basic_api2() {
    const api_env = process.env.REACT_APP_KKAPI_ENV
    if (api_env === 'dev') return api2.dev

    if (api_env === 'test') return api2.test

    return api2.production
}

// define the api
const client = create({
  baseURL: basic_api(),
  timeout: 20000
});
export function getLang(){
  let lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
  console.log('语言',lang)
  if(/zh/.test(lang)){
    if(/zh-[cn|CN]/.test(lang)){
      return 'zh'
    }else{
      return 'tc'
    }
  }
  return 'en'
}



client.setHeader('X-LANG', 'zh')

export function setLang(lang) {
  logMsg('X-LANG',lang)
  if(lang){
    client.setHeader("X-LANG", lang);
  }
}
//cash_queue特定的v2
const client2 = create({
  baseURL: basic_api2(),
  timeout: 20000
});

client2.addMonitor(response => {
    const {url} = response.config;
    logMsg('响应' + url, response)
})

client2.addRequestTransform(request => {
    logMsg('请求' + request.url, request)
})

client.addMonitor(response => {
    const {url} = response.config;
    logMsg('响应' + url, response)
})

client.addRequestTransform(request => {
    logMsg('请求' + request.url, request)
})

export function getBaseUrl(){
    return client.getBaseURL();
}


export function get2(url, body, resolve, reject) {
    return client2.get(url, body).then(res => {
        handle(res, resolve, reject)
    }).catch(err => {
        errReject(err)
    })
}


export function setToken(access_token) {
    if(isStrNull(access_token)){
        delete client.headers['x-access-token']
    }else{
        client.setHeader('x-access-token', access_token)
    }

}


export function get(url, body, resolve, reject) {
 return client.get(url, body).then(res => {
    handle(res, resolve, reject)
  }).catch(err => {
    errReject(err)
  })
}

export function put(url, body, resolve, reject) {
  client.put(url, body).then(res => {
    handle(res, resolve, reject)
  }).catch(err => {
    errReject(err)
  })
}

export function del(url, body, resolve, reject) {
  client.delete(url, body).then(res => {
    handle(res, resolve, reject)
  }).catch(err => {
    errReject(err)
  })
}


export function post(url, body, resolve, reject) {
  client.post(url, body).then(res => {
    handle(res, resolve, reject)
  }).catch(err => {
    errReject(err)
  })
}

function handle(res, resolve, reject) {
  const {ok, status, data} = res;
  if (ok && status === 200 && data.code === 0) {
    resolve && resolve(data)
  } else {
    if (data && !isStrNull(data.msg)) {
      reject && reject(data.msg);
    }

    errReject(res)
  }
}


function errReject(res) {
  logMsg('错误', res)
  const {status, problem, data, ok} = res;
  if (status === 401) {

  } else {

  }
}


