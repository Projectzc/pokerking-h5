/**
 * utils.js
 *
 * @des the file dees
 * @author lorne (2270333671@qq.com)
 * Created at 2018/6/1.
 *
 */
import React from 'react';
import _ from 'lodash'
import moment from 'moment'
import {getWeiXinSign} from '../services/InfoDao';

export const YYYYMMDD = 'YYYY-MM-DD'

let locations = [];//定位城市列表
export function setLocations(arr) {
  locations = arr;
}
export let loginUser = null

let following_ids = [];
export const util = _;

//微信二次分享
export function weiXinShare(url, message) {
    getWeiXinSign(url, data => {
        console.log('WeiXinSignInfo', data)
        window.wx.ready(() => {
            window.wx.onMenuShareTimeline(message);//分享朋友圈
            window.wx.onMenuShareAppMessage(message);//分享给朋友
            window.wx.onMenuShareQQ(message);//分享到QQ
            window.wx.onMenuShareWeibo(message);//分享到腾讯微博
            window.wx.onMenuShareQZone(message);//分享到QQ空间
        });

        window.wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', "onMenuShareQZone"]
        });

    }, err => {

    });
}

export function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}

/**
 * 已关注
 * @param ids
 */
export function setFollowerIds(ids) {
  logMsg('已关注用户IDs:', ids)
  following_ids = ids;
}

/**
 * 是否已关注
 * @param user_id
 */
export function isFollowing(user_id) {
  logMsg('是否关注:', following_ids, following_ids.indexOf(user_id))
  return following_ids.indexOf(user_id) > -1
}

export function logMsg(...msg) {
    // console.log(...msg)
}

export function isLogin() {
  return !isEmpty(global.loginUser)
}

export function getLoginUser() {
  return global.loginUser;
}

/**
 * 时间转化
 * @param date
 * @param format
 * @returns {string}
 */
export function convertDate(date, format) {
  return moment(date).format(format)
}

//UTC 时间转化
export function utcDate(utc, formate) {
    if (strNotNull(utc))
        return moment.unix(utc).format(formate)
}

export function unix_format(timestamp, time_format) {
  return moment.unix(timestamp).format(time_format)
}

/**
 * 时间戳转 YYYY-MM-DD
 * @param {*} timestamp
 */
export function unix(timestamp) {
  return moment.unix(timestamp).format(YYYYMMDD)
}

/**
 * 首页城市
 */
export function getLocations() {
  return locations;
}

export function fileName(path) {
  let index = path.lastIndexOf('/')
  return path.substr(index + 1)
}


export function strNotNull(str) {
    if (str == undefined || str == null || str.length == 0)
        return false;
    else
        return true;
}

export function isEmpty(param) {
  return _.isEmpty(param)
}

export function isStrNull(str) {
  return str === null || str === undefined || str.length < 1;
}

export function getCurrentDate() {
    return moment();
}



export function getUserId() {
    return isEmptyObject(global.loginUser)?'':global.loginUser.user_id
}

/*金额千分转换*/
export function moneyFormat(num) {
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return result;
}



export function getRemainTime(endTime){
    let t = endTime - Date.parse(new Date())
    let seconds = Math.floor((t / 1000) % 60)
    let minutes = Math.floor((t / 1000 / 60) % 60)
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    let days = Math.floor(t / (1000 * 60 * 60 * 24))
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    }
}

/**
 * 乘法精度问题
 * @param num1
 * @param num2
 * @returns {number}
 */
export function mul(num1, num2) {
    let m = 0, s1 = num1.toString(), s2 = num2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

export function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {
    }
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {
    }
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}

export function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

export function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}
export function getWidth(){
    return window.screen.width
}