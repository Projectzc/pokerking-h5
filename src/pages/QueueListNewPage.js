import React, {Component} from 'react';
import {getCashQueues, getCashQueuesNumber, getCashGames} from '../services/InfoDao';
import {add, div, isEmptyObject, isStrNull, logMsg, mul, strNotNull, sub, weiXinShare} from "../utils/utils";
import {Images, MarkDown} from '../components';
import '../css/queue_new.css';
import Marquee from "./Marquee";
import QueueMaNiLa from "./QueueMaNiLa";
import ManilaQueue from "./ManilaQueue";

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const HEIGHT = window.screen.height;
const WIDTH = window.screen.width;
const colorArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

const circle_list = [1, 2, 3, 4, 5, 6, 7, 8];

const pattern = /^[\u4e00-\u9fa5]{0,}$/;

export default class QueueListPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cash_games: [],
            cash_queues: [],
            all_cash_queues: [],
            cash_queue_members: [],
            cash_vip: {small_blind: '', big_blind: ""},
            notice_id: 0,
            marquee_name: 10,
            table_type: ''
        }

    }

    componentWillMount() {
        clearInterval(this.intervalId);

    }

    componentDidMount() {

        getCashGames(data => {
            logMsg("现金桌", data)
            this.setState({
                cash_games: data.items,
                table_type: data.items[0].table_type
            })
            this.getlist(data.items[0].id)
            this.intervalId = setInterval(() => {
                this.getlist(data.items[0].id);
            }, 8000)

        })
    };

    getlist = (id) => {
        getCashQueues({cash_game_id: id}, data => {
            let queues = data.queues;
            let table_type = data.table_type;
            let vip = {small_blind: '', big_blind: ""};
            //
            let marquee_length = !isEmptyObject(queues) && queues.length < 5 ? 15 : 10;
            //
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
            //
            this.setState({
                cash_queues: queues,
                all_cash_queues: newTables,
                cash_vip: vip,
                marquee_name: marquee_length

            });

        });
    }
    // getlist = (id) => {
    //     getCashQueues({cash_game_id: id}, data => {
    //
    //         let queues = data.ordinary_queues;
    //         let hight_limit = data.high_limit_queues;
    //         let transfer = data.transfer_request_queues;
    //         let vip = {small_blind: '', big_blind: ""};
    //
    //         if (!isEmptyObject(hight_limit) && hight_limit.status) {
    //             queues.push(hight_limit);
    //         }
    //         if (!isEmptyObject(transfer) && transfer.status) {
    //             transfer.transfer_type = 'transfer'
    //             queues.push(transfer);
    //         }
    //         logMsg('ordinary_queues', data)
    //         let marquee_length = !isEmptyObject(queues) && queues.length < 5 ? 15 : 10;
    //
    //         let cash_queues1 = data.tables;
    //         let top_content = [{id: 9}, {id: 10}, {id: 7}, {id: 8}, {id: 5}, {id: 6}, {id: 3}, {id: 4}, {id: 1}, {id: 2}];
    //         let newTables = top_content.map(item => {
    //             cash_queues1.forEach(x => {
    //                 if (parseInt(x.table_no) === 11) {
    //                     vip = {small_blind: x.small_blind, big_blind: x.big_blind, no: 11};
    //                 } else if (parseInt(x.table_no) === item.id) {
    //                     item.info = x
    //                 }
    //             })
    //             return item
    //         })
    //
    //         let members = [];
    //         let valid = 0
    //         queues.forEach((item, index, arr) => {
    //
    //             if (item.status === undefined || item.status) {
    //                 valid++
    //                 getCashQueuesNumber({cash_game_id: item.cash_game_id, cash_queue_id: item.id}, data2 => {
    //
    //                     item.cash_items = data2.items
    //                     members.push(data2.items)
    //
    //                     if (valid === members.length) {
    //
    //                         this.setState({
    //                             cash_queue_members: arr
    //                         })
    //                     }
    //                 });
    //             }
    //
    //         });
    //
    //
    //         this.setState({
    //             cash_queues: queues,
    //             all_cash_queues: newTables,
    //             cash_vip: vip,
    //             high_limit: hight_limit,
    //             marquee_name: marquee_length
    //
    //         });
    //
    //     });
    // };

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

    getCircle = (length) => {
        if (length === 6) {
            return "div_6ths"
        }
        if (length === 5) {
            return "div_5ths"
        } else if (length === 4) {
            return "col-md-3 col-lg-3"
        } else if (length < 4) {
            return "col-md-3 col-lg-3"
        }
    }

    showSpan = (item) => {
        if (item === 1 || item === 5 || item === 10) {
            return "number_span_new"
        } else {
            return "number_span_hidden"
        }
    };

    //最左边圈圈的颜色
    getImg = (small_blind, big_blind) => {

        let bg_img = Images.AVAILABLE;

        if (!strNotNull(small_blind) || !strNotNull(big_blind)) {
            bg_img = Images.AVAILABLE
        } else if (small_blind === 50 && big_blind === 100) {
            bg_img = Images.NLH510
        } else if (small_blind === 100 && big_blind === 200) {
            bg_img = Images.NLH1020
        } else if (small_blind === 300 && big_blind === 600) {
            bg_img = Images.NLH36
        } else if (small_blind === 1000 && big_blind === 2000) {
            bg_img = Images.NLH24
        } else if (small_blind === 2000 && big_blind === 4000) {
            bg_img = Images.NLH12
        } else if (small_blind === 5000 && big_blind === 10000) {
            bg_img = Images.PLO5010
        } else if (small_blind === 10000 && big_blind === 20000) {
            bg_img = Images.PLO1020
        }

        return bg_img

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
    changeMember = () => {
        this.setState({
            cash_queue_members: []
        })
    }
    changeId = (value, table_type) => {

        this.setState({
            notice_id: value,
            table_type: table_type
        })
    }

    refreshLoop = (id) => {
        this.intervalId && clearInterval(this.intervalId)
        this.getlist(id)
        this.intervalId = setInterval(() => {
            this.getlist(id)
        }, 5000)
    }


    render() {
        const {table_type, all_cash_queues, cash_queues, cash_queue_members, cash_games, cash_vip, notice_id, marquee_name} = this.state;
        let class_name = this.getCircle(cash_queues.length);

        if (table_type === 'Asia') {
            return <ManilaQueue
                cash_queue_members={cash_queue_members}
                class_name={class_name}
                cash_queues={cash_queues}
                marquee_name={marquee_name}
                refreshLoop={this.refreshLoop}
                showSpan={this.showSpan}
                cash_games={cash_games}
                font_size={this.font_size}
                get_cash={this.get_cash}
                changeMember={this.changeMember}
                notice_id={notice_id}
                changeId={this.changeId}/>
        } else {
            return (
                <div className="container-fluid queue_body_new">
                    <div className="row" style={{height: '100%'}}>
                        <div className="col-sm-2 col-md-2 col-lg-2 left_div_new">
                            <div className="left_div_top">
                                <img className="img-responsive center-block pukewang_new" src={Images.pukewang}/>
                                <div className="left_line_new"/>
                                <span className="left_span_new1" style={{marginTop: 8}}>TABLE PREVIEW</span>
                                <div className="left_line_new"/>
                                <img className="img_bottom" src={Images.bottom}/>
                            </div>

                            <div className="left_circle_new">
                                <div className="only_circle">
                                    {strNotNull(cash_vip.small_blind) && strNotNull(cash_vip.big_blind) ?
                                        <div className="circle_vip_new">
                                            <img src={this.getImg(cash_vip.small_blind, cash_vip.big_blind)}
                                                 className="AVAILABLE"/>
                                            <span className="circle_span_new">V1</span>
                                        </div> :
                                        <div className="circle_vip_new_none">
                                            <img src={Images.AVAILABLE} className="AVAILABLE"/>
                                            <span className="circle_span_new2">V1</span>
                                        </div>}

                                    <div className="circle_div_new">

                                        {!isEmptyObject(all_cash_queues) && all_cash_queues.map((item, index, arr) => {

                                            if (item.info && strNotNull(item.info.small_blind) && strNotNull(item.info.big_blind)) {
                                                let bg_img = this.getImg(item.info.small_blind, item.info.big_blind)
                                                return (
                                                    <div className="circle_new" key={index}>
                                                        <img src={bg_img}
                                                             className="AVAILABLE"/>
                                                        <span
                                                            className="circle_span_new">{item.id === 10 ? item.id : `0${item.id}`}</span>

                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div className="circle_new_none" key={index}>
                                                        <img src={Images.AVAILABLE} className="AVAILABLE"/>
                                                        <span className="circle_span_new2">{item.id}</span>

                                                    </div>
                                                )
                                            }

                                        })}
                                    </div>
                                </div>


                                <div className="title_div">

                                    <div className="left_line2" style={{marginTop: 20}}/>
                                    <span className="left_span_new" style={{marginTop: 10}}>NOTICE</span>
                                    <div className="left_line2"/>
                                    <img className="img_bottom" src={Images.bottom}/>
                                    <div style={{height: 20}}/>
                                    <span
                                        className="title_spans">{!isEmptyObject(cash_games[notice_id]) ? cash_games[notice_id].notice : ''}</span>
                                </div>

                            </div>

                            <select id="dropdown"
                                    ref={(input) => this.menu = input}
                                    value={notice_id}
                                    onChange={(event) => {

                                        let selectItem = cash_games[event.target.value]
                                        this.changeId(event.target.value, selectItem.table_type)

                                        this.refreshLoop(selectItem.id)
                                        this.setState({
                                            cash_queue_members: []
                                        })


                                    }}>
                                {cash_games.map((item, index) => {
                                    return <option key={index}
                                                   id={index}
                                                   value={index}>{item.name}</option>
                                })}
                            </select>
                        </div>


                        <div className="col-sm-10 col-md-10 col-lg-10">

                            <div className="row" style={{height: '100%', marginRight: 0, marginLeft: 0}}>
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

                                                <div className="queue_new" key={index}>

                                                    <div className="right_top_div">
                                                        {strNotNull(navigation) ?
                                                            <div className="big_circle_new" key={index}>
                                                                <img src={navigation} className="navigation_img"/>
                                                            </div> :
                                                            <div className="big_circle_new" key={index}>
                                                                {strNotNull(buy_in) ?
                                                                    <span
                                                                        className={`big_money_span_new ${this.font_size('HKD')}`}>{`${buy_in} (HKD)`}</span> : null}
                                                                <span
                                                                    className={`big_circle_span_new ${this.font_size("NL")}`}>{this.get_cash(small_blind, big_blind)} NL</span>
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
                                                            if (member_index < 11) {
                                                                let scrollLeg = pattern.test(member_item.nickname)?5:10
                                                                return <div className="number_name_div_new"
                                                                            key={member_index}>
                                                                    {index !== 0 && (member_index === 0 || member_index === 4 || member_index === 9) ?
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
                                                                    {index !== cash_queues.length - 1 && (member_index === 0 || member_index === 4 || member_index === 9) ?
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
                                                        <div className="number_div_left">
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
                        </div>
                    </div>
                </div>
            )
        }
    }

    getCountColor = (item, index) => {
        const {cash_queue_members_count} = item;
        if (index === this.state.cash_queue_members.length - 1 && item.transfer_type === 'transfer') {
            return "queue_last2"
        } else if (cash_queue_members_count && cash_queue_members_count > 0) {
            return "queue_all_new_last"
        } else {
            return "queue_all_new_last2"
        }
    }

    getBLen = (str) => {
        const {cash_queue_members} = this.state;
        let cash_length = cash_queue_members.length;
        if (!strNotNull(str)) return 0;
        if (typeof str != "string") {
            str += "";
        }
        let length = str.replace(/[^\x00-\xff]/g, "01").length;
        if (cash_length > 5) {
            if (length >= 20) {
                return true
            } else {
                return false
            }
        } else {
            if (length >= 32) {
                return true
            } else {
                return false
            }
        }


    }

}