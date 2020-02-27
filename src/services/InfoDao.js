import api from '../utils/api'
import api2 from '../utils/api2'
import {get,post,get2} from '../utils/fetch'
import {logMsg} from "../utils/utils";

export function getInfoDetail(body, resolved, reject) {
    get(api.info_detail(body),{},ret=>{
        resolved(ret.data)
    },reject)
}

export function getWeiXinSign(payload, resolve, reject) {
    post(api.weixin_js_sign, payload, ret => {
        resolve(ret.data);
    }, reject)
}
/*获取主赛的新闻详情*/
export function getEventDetail(body,resolve, reject) {
    get(api.event_detail(body),{},ret=>{
        resolve(ret.data)
    },reject)
}

/*现金桌排队进程列表*/
export function getCashQueues(body,resolve, reject) {
    get2(api2.cash_queues(body), {from:'h5'}, ret => {
        resolve(ret.data)
    }, reject)
}

/*现金桌排队进程报名人列表*/
export function getCashQueuesNumber(body,resolve, reject) {
    get(api.cash_queues_number(body), {from:'h5'}, ret => {
        resolve(ret.data)
    }, reject)
}
/*现金桌列表*/
export function getCashGames(resolve, reject) {
    get(api.cash_games, {from:'h5'}, ret => {
        resolve(ret.data)
    }, reject)
}
/*获取主赛介绍详情*/
export function getRaceNewDetail(body,resolve, reject) {
    get(api.event_new_info(body),{},ret=>{
        resolve(ret.data)
    },reject)
}
