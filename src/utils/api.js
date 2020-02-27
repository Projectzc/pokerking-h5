import {getUserId, isEmptyObject} from "../utils/utils";

const api = {
    //内部测试
    dev: 'http://192.168.2.10:3000/v1/',
    //test分支用来发布版本  test_ci_at用来跑自动化测试
    test: 'http://test.pokerking_api.deshpro.com/v1',
    //production 用来发布正式生产环境
    production: 'http://api.pokerkinglive.com/v1',
    info_detail:info_detail,//获取热门资讯详情
    weixin_js_sign:'weixin_js_sign',
    event_detail:event_detail,//获取主赛的新闻详情
    event_new_info:event_new_info,//获取主赛介绍详情
    cash_queues:cash_queues,//现金桌排队进程列表
    cash_queues_number:cash_queues_number,//现金桌排队进程报名人列表
    cash_games:"cash_games",//现金桌列表

}

function event_new_info(body) {
    const {id} = body;
    return `main_events/${id}`;
}

function cash_queues_number(body){
    const {cash_game_id,cash_queue_id} = body;
    return `cash_games/${cash_game_id}/cash_queues/${cash_queue_id}/cash_queue_members`;
}


function cash_queues(body){
    const {cash_game_id} = body;
    return `cash_games/${cash_game_id}/cash_queues`;
}

function info_detail(body){
    const {id} = body;
    return `infos/${id}`;
}

function event_detail(body){
    const {event_id,id} = body;
    return `main_events/${event_id}/infos/${id}`;
}

export default api