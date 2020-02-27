import React, {Component} from 'react';
import {getCashQueues, getCashQueuesNumber, getCashGames} from '../services/InfoDao';
import {add, div, isEmptyObject, isStrNull, logMsg, mul, strNotNull, sub, weiXinShare} from "../utils/utils";
import {Images, MarkDown} from '../components';
import '../css/queue_manila.css';
import Marquee from "./Marquee";

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const HEIGHT = window.screen.height;
const WIDTH = window.screen.width;
const colorArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

const circle_list = [1, 2, 3, 4, 5, 6, 7, 8];

export default class QueueMaNiLa extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cash_games: [],
            cash_queues: [],
            all_cash_queues: [],
            cash_queue_members: [],
            cash_vip: {small_blind: '', big_blind: ""},
            high_limit: {},
            notice_id: 0,
            marquee_name: 10
        }

    }

    componentWillMount() {
        clearInterval(this.intervalId);

    }

    componentDidMount() {
        this.forceUpdate();
        const {cash_table} = this.props.location.state;
        this.getlist(cash_table.id)
    };


    getlist = (id) => {
        getCashQueues({cash_game_id: id}, data => {

            let queues = data.ordinary_queues;
            let hight_limit = data.high_limit_queues;
            let transfer = data.transfer_request_queues;
            let vip = {small_blind: '', big_blind: ""};

            if (!isEmptyObject(hight_limit) && hight_limit.status) {
                queues.push(hight_limit);
            }
            if (!isEmptyObject(transfer) && transfer.status) {
                transfer.transfer_type = 'transfer'
                queues.push(transfer);
            }
            logMsg('ordinary_queues', data)
            let marquee_length = !isEmptyObject(queues) && queues.length < 5 ? 15 : 10;

            let cash_queues1 = data.tables;
            let top_content = [{id: 9}, {id: 10}, {id: 7}, {id: 8}, {id: 5}, {id: 6}, {id: 3}, {id: 4}, {id: 1}, {id: 2}];
            let newTables = top_content.map(item => {
                cash_queues1.forEach(x => {
                    if (parseInt(x.table_no) === 11) {
                        vip = {small_blind: x.small_blind, big_blind: x.big_blind, no: 11};
                    } else if (parseInt(x.table_no) === item.id) {
                        item.info = x
                    }
                })
                return item
            })

            let members = [];
            let valid = 0
            queues.forEach((item, index, arr) => {

                if (item.status === undefined || item.status) {
                    valid++
                    getCashQueuesNumber({cash_game_id: item.cash_game_id, cash_queue_id: item.id}, data2 => {

                        item.cash_items = data2.items
                        members.push(data2.items)

                        if (valid === members.length) {

                            this.setState({
                                cash_queue_members: arr
                            })
                        }
                    });
                }

            });


            this.setState({
                cash_queues: queues,
                all_cash_queues: newTables,
                cash_vip: vip,
                high_limit: hight_limit,
                marquee_name: marquee_length

            });

        });
    };

    getRandomColor = () => {
        let color = "";
        for (let i = 0; i < 6; i++) {
            color += colorArr[Math.floor(Math.random() * 15)];
        }
        if (color !== '4CB564' && color !== 'C14C33' && color !== '717171' && color !== '4A90E2'
            && color !== 'D8A655' && color !== '942CEF' && color !== '893505') {
            return `#${color}`
        } else {
            return this.getRandomColor();
        }
    };

    //圆点的颜色
    _color = (small_blind, big_blind) => {
        if (small_blind === 50 && big_blind === 100) {
            return '#0baf4d'
        } else if (small_blind === 100 && big_blind === 200) {
            return '#ed1c24'
        } else if (small_blind === 300 && big_blind === 600) {
            return '#0072bc'
        } else if (small_blind === 1000 && big_blind === 2000) {
            return '#f7941d'
        } else if (small_blind === 2000 && big_blind === 4000) {
            return '#ffffff'
        } else if (small_blind === 5000 && big_blind === 10000) {
            return '#8dc63f'
        } else if (small_blind === 10000 && big_blind === 20000) {
            return '#ed145b'
        }
    };


    get_cash = (small_blind, big_blind, id) => {
        if (id === 11) {
            return "v1"
        }
        else if (isStrNull(small_blind) || isStrNull(big_blind)) {
            return ``
        } else if (small_blind >= 1000) {
            return `${small_blind / 1000}K/${big_blind / 1000}K`
        } else if (big_blind >= 1000) {
            return `${small_blind}/${big_blind / 1000}K`
        } else {
            return `${small_blind}/${big_blind}`
        }

    }

    getCircle = (length, status) => {
        if (length === 6) {
            if (status) {
                return "div_6ths"
            } else {
                return "div_5ths"
            }
        }
        if (length === 5) {
            if (status) {
                return "div_5ths"
            } else {
                return "div_5ths"
            }
        } else if (length === 4) {
            if (status) {
                return "col-md-3 col-lg-3"
            } else {
                return "col-md-3 col-lg-3"
            }
        } else if (length < 4) {
            return "col-md-3 col-lg-3"
        }
    }

    showSpan = (item) => {
        if (item === 1 || item === 4 || item === 9) {
            return "number_span_manila"
        } else {
            return "number_span_hidden"
        }
    };

    font_size = (type) => {
        const {cash_queues} = this.state;
        let length = cash_queues.length;
        if (type === 'HKD') {
            if (length > 4) {
                return "font_size5"
            } else if (length === 4) {
                return "font_size4"
            } else if (length === 3) {
                return "font_size3"
            } else if (length === 2) {
                return "font_size2"
            } else if (length === 1) {
                return "font_size1"
            }
        } else if (type === 'NL') {
            if (length > 4) {
                return "font_size_big5"
            } else if (length === 4) {
                return "font_size_big4"
            } else if (length === 3) {
                return "font_size_big3"
            } else if (length === 2) {
                return "font_size_big2"
            } else if (length === 1) {
                return "font_size_big1"
            }
        }

    }

    render() {
        const {all_cash_queues, cash_queues, cash_queue_members, cash_games, cash_vip, high_limit, notice_id, marquee_name} = this.state;
        let class_name = this.getCircle(cash_queues.length, high_limit.status);

        return (
            <div className="queue_body_manila">
                <div className="top_bar_div">

                    <img src={Images.manila_left}/>
                    <img className="middle_img" src={Images.middle_img}/>
                    <img src={Images.minila_right}/>
                </div>

                <div className="line"/>
                <div className="middle_div">
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
                            <div className="item_view" style={{width: div(WIDTH, cash_queue_members.length)}}
                                 key={index}>
                                <div className="item_left_view">
                                    <div className="img_div">
                                        <img src={navigation}
                                             className="navigation_Image"/>
                                    </div>
                                    <div className="notice_div">
                                        {strNotNull(item.notice) && this.getBLen(item.notice) ?
                                            <Marquee>
                                                <span
                                                    className="monila_span">{item.notice} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                            </Marquee> :
                                            <span className="monila_span">{item.notice}</span>
                                        }
                                    </div>
                                    <div className="circle_manila_div">
                                        {circle_list.map((circle_item, index) => {
                                            if (table_numbers >= circle_item) {
                                                return <div
                                                    className={cash_queues.length > 4 ? "circle_item_small_manila" : "circle_item_manila"}
                                                    style={{backgroundColor: this._color(small_blind, big_blind)}}
                                                    key={index}/>
                                            } else {
                                                return <div
                                                    className={cash_queues.length > 4 ? "circle_item_small_manila" : "circle_item_manila"}
                                                    key={index}/>
                                            }
                                        })}
                                    </div>


                                    <div className="queue_div_manila">
                                        {name_list.map((member_item, member_index) => {
                                            if (member_index < 9) {

                                                return <div className="number_name_div_manila"
                                                            key={member_index}>
                                                    {index !== 0 && (member_index === 0 || member_index === 3 || member_index === 8) ?
                                                        <img className="left_img_manila" src={Images.right}/> :
                                                        <div className="none_img_manila"/>}

                                                    <div className="middle_name_manila">
                                                        {member_item.nickname.length < marquee_name ?
                                                            <span className="name_span_manila"
                                                                  key={member_index}>{member_item.nickname}</span> :

                                                            <Marquee>
                                                                            <span className="name_span_manila"
                                                                                  key={member_index}>{member_item.nickname}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                            </Marquee>
                                                        }

                                                    </div>
                                                    {index !== cash_queues.length - 1 && (member_index === 0 || member_index === 3 || member_index === 8) ?
                                                        <img className="right_img_manila" src={Images.left}/> :
                                                        <div className="none_img_manila"/>}
                                                </div>
                                            }
                                        })}
                                        <div style={{display: 'flex', flex: 1}}/>

                                        <div className="bottom_text_div_manila">

                                            <span className="queue_all_manila">{`Total Count`}</span>
                                            <span className="opopp">|</span>
                                            <span
                                                className={this.getCountColor(item, index)}>{item.cash_queue_members_count}</span>
                                        </div>
                                    </div>
                                </div>
                                {index === cash_queue_members.length - 1 ?
                                    <div className="item_right_member"/> :
                                    <div className="item_right_member">
                                        <div className="img_div"/>
                                        <div className="notice_div"/>
                                        <div className="circle_manila_div"/>

                                        <div className="number_div_manila">
                                            {list.map((list_item, item_index) => {
                                                return <div className="numbers" key={item_index}>
                                                            <span className={this.showSpan(list_item)}
                                                                  key={item_index}>{list_item}</span>

                                                </div>
                                            })}
                                            <div style={{display: 'flex', flex: 1}}/>

                                            <div className="bottom_manila"/>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    getCountColor = (item, index) => {
        const {cash_queue_members_count} = item;
        if (index === this.state.cash_queue_members.length - 1 && item.transfer_type === 'transfer') {
            return "queue_last"
        } else if (cash_queue_members_count && cash_queue_members_count > 0) {
            return "queue_all_manila_last"
        } else {
            return "queue_all_manila_last2"
        }
    }

    getBLen = (str) => {
        if (!strNotNull(str)) return 0;
        if (typeof str != "string") {
            str += "";
        }
        let length = str.replace(/[^\x00-\xff]/g, "01").length;
        if (length >= 32) {
            return true
        } else {
            return false
        }

    }

}