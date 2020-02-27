import React, {Component} from 'react';
import {getCashQueues, getCashQueuesNumber, getCashGames} from '../services/InfoDao';
import {add, div, isEmptyObject, isStrNull, logMsg, mul, strNotNull, sub, weiXinShare} from "../utils/utils";
import {Images, MarkDown} from '../components';
import '../css/queue_new.css';
import Marquee from "./Marquee";

const circle_list = [1, 2, 3, 4, 5, 6, 7, 8];
const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const pattern = /^[\u4e00-\u9fa5]{0,}$/;
export default class ManilaQueue extends Component {

    getCountColor = (item, index) => {
        const {cash_queue_members_count} = item;
        if (index === this.props.cash_queue_members.length - 1 && item.transfer_type === 'transfer') {
            return "queue_last2"
        } else if (cash_queue_members_count && cash_queue_members_count > 0) {
            return "queue_all_new_last"
        } else {
            return "queue_all_new_last2"
        }
    }

    getBLen = (str) => {
        const {cash_queue_members} = this.props;
        let cash_length = cash_queue_members.length;
        if (!strNotNull(str)) return 0;
        if (typeof str != "string") {
            str += "";
        }
        let length = str.replace(/[^\x00-\xff]/g, "01").length;
        if(cash_length > 5){
            if (length >= 20) {
                return true
            } else {
                return false
            }
        }else{
            if (length >= 32) {
                return true
            } else {
                return false
            }
        }


    }
    //圆点的颜色
    _color = (small_blind, big_blind) => {
        return '#0baf4d'
    };

    render() {
        const {cash_queue_members, class_name, cash_queues, marquee_name, cash_games, notice_id} = this.props;
        return (
            <div className="container-fluid queue_body_new">
                <div className="row" style={{height: '100%'}}>
                    <div className="col-sm-12 col-md-12 col-lg-12">

                        <div className="row" style={{height: '8%', marginRight: 0, marginLeft: 10, marginTop: 20}}>
                            <div className="col-md-12 col-lg-12 top_bar_div2">
                                <img src={Images.manila_left}/>
                                {/*<img className="middle_img" src={Images.middle_img}/>*/}
                                {/*<img src={Images.minila_right}/>*/}
                            </div>
                            <div className="line2"/>
                        </div>

                        <div className="row" style={{height: '92%', marginRight: 0, marginLeft: 10}}>
                            <div className="col-md-12 col-lg-12 queue_bottom_new">

                                {!isEmptyObject(cash_queue_members) && cash_queue_members.map((item, index) => {
                                    const {small_blind, big_blind, buy_in, table_numbers, cash_items, navigation} = item;
                                    let name_list = cash_items;
                                    if (isEmptyObject(cash_items) || cash_items.length < 10) {
                                        let length = sub(10, cash_items.length);
                                        for (let i = 0; i < length; i++) {
                                            name_list.push({nickname: ""})
                                        }
                                    }
                                    return (
                                        <div className={`${class_name} item_div_new`} key={index}>

                                            <div className="queue_new2" key={index}>

                                                <div className="right_top_div">
                                                    {strNotNull(navigation) ?
                                                        <div className="big_circle_new" key={index}>
                                                            <img src={navigation} className="navigation_img"/>
                                                        </div> :
                                                        <div className="big_circle_new" key={index}>
                                                            {strNotNull(buy_in) ?
                                                                <span
                                                                    className={`big_money_span_new ${this.props.font_size('HKD')}`}>{`${buy_in} (HKD)`}</span> : null}
                                                            <span
                                                                className={`big_circle_span_new ${this.props.font_size("NL")}`}>{this.props.get_cash(small_blind, big_blind)} NL</span>
                                                        </div>
                                                    }


                                                    <div style={{width: '85%', height: 25, textAlign: 'center'}}>
                                                        {strNotNull(item.notice) && this.getBLen(item.notice) ?
                                                            <Marquee>
                                                            <span
                                                                className="remark_span">{item.notice} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                            </Marquee> :
                                                            <span className="remark_span">{item.notice}</span>
                                                        }
                                                    </div>


                                                    <div className="span_line_n"/>
                                                    <div className="top_text_div">
                                                        {circle_list.map((circle_item, index) => {
                                                            if (table_numbers >= circle_item) {
                                                                return <div
                                                                    className={cash_queues.length > 4 ? "circle_item_small" : "circle_item"}
                                                                    style={{backgroundColor: this._color(small_blind, big_blind)}}
                                                                    key={index}/>
                                                            } else {
                                                                return <div
                                                                    className={cash_queues.length > 4 ? "circle_item_small" : "circle_item"}
                                                                    key={index}/>
                                                            }
                                                        })}
                                                    </div>

                                                </div>

                                                <div className="queue_number_div_new">
                                                    {name_list.map((member_item, member_index) => {
                                                        if (member_index < 10) {
                                                            let scrollLeg = pattern.test(member_item.nickname)?5:10

                                                            return <div className="number_name_div_new"
                                                                        key={member_index}>
                                                                {index !== 0 && (member_index === 0 || member_index === 3 || member_index === 8) ?
                                                                    <img className="left_img" src={Images.right}/> :
                                                                    <div className="none_img"/>}

                                                                <div className="middle_name">
                                                                    {member_item.nickname.length < scrollLeg ?
                                                                        <span className="name_span_new"
                                                                              key={member_index}>{member_item.nickname}</span> :

                                                                        <Marquee>
                                                                            <span className="name_span_new"
                                                                                  key={member_index}>{member_item.nickname}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                                        </Marquee>
                                                                    }

                                                                </div>
                                                                {index !== cash_queues.length - 1 && (member_index === 0 || member_index === 3 || member_index === 8) ?
                                                                    <img className="right_img" src={Images.left}/> :
                                                                    <div className="none_img"/>}
                                                            </div>
                                                        }
                                                    })}

                                                    <div style={{display: 'flex', flex: 1}}/>

                                                    <div className="bottom_text_div_new">

                                                        <span className="queue_all_new">{`Total Count：`}</span>
                                                        <span
                                                            className={this.getCountColor(item, index)}>{item.cash_queue_members_count}</span>
                                                    </div>

                                                </div>

                                            </div>

                                            {index === cash_queues.length - 1 ? <div
                                                    className={cash_queues.length > 4 ? "list_div_new_more" : "list_div_new"}>
                                                    <div className="span_line_1"/>
                                                    <div className="number_div_left"/>
                                                </div> :
                                                <div
                                                    className={cash_queues.length > 4 ? "list_div_new_more" : "list_div_new"}>
                                                    <div className="span_line_1"/>
                                                    <div className="number_div_left2">
                                                        {list.map((list_item, item_index) => {
                                                            return <div className="number_div_new" key={item_index}>
                                                            <span className={this.showSpan(list_item)}
                                                                  key={item_index}>{list_item}</span>

                                                            </div>
                                                        })}
                                                    </div>

                                                </div>
                                            }


                                        </div>
                                    )
                                })}

                            </div>

                        </div>
                        <div className="row" style={{position: 'absolute', bottom: 0, width:'100%',height: 50}}>
                            <div className="col-sm-12 col-md-12 col-lg-12" style={{
                                marginLeft: 30,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <select id="dropdown2"
                                        ref={(input) => this.menu = input}
                                        value={notice_id}
                                        onChange={(event) => {
                                            let selectItem = cash_games[event.target.value]

                                            this.props.changeId(event.target.value, selectItem.table_type)

                                            this.props.refreshLoop(selectItem.id)


                                            // this.props.changeMember()

                                        }}>
                                    {cash_games.map((item, index) => {
                                        return <option key={index}
                                                       id={index}
                                                       value={index}>{item.name}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    showSpan = (item) => {
        if (item === 1 || item === 4 || item === 9) {
            return "number_span_new"
        } else {
            return "number_span_hidden"
        }
    };
}