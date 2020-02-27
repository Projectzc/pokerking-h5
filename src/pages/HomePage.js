import React, {Component} from 'react';
import {getCashQueues, getCashQueuesNumber, getCashGames} from '../services/InfoDao';
import {add, div, isEmptyObject, isStrNull, logMsg, mul, strNotNull, weiXinShare} from "../utils/utils";
import {Images, MarkDown} from '../components';
import '../css/home.css';

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const HEIGHT = window.screen.height;
const WIDTH = window.screen.width;
const colorArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
const top_content = [{id: 9}, {id: 10}, {id: 7}, {id: 8}, {id: 5}, {id: 6}, {id: 3}, {id: 4}, {id: 1}, {id: 2}];

export default class EventDetail extends Component {


    constructor(props) {
        super(props);
        this.state = {
            cash_games: [],
            cash_queues: [],
            all_cash_queues: [],
            cash_queue_members: [],
            cash_vip: {small_blind: '', big_blind: ""},
            high_limit: {}
        }


    }

    componentWillMount() {
        clearInterval(this.intervalId);
    }

    componentDidMount() {

        getCashGames(data => {
            logMsg("现金桌", data);
            this.setState({
                cash_games: data.items
            })
            this.getlist(data.items[0].id)
            this.intervalId = setInterval(() => {
                this.getlist(data.items[0].id)
            }, 5000)


        })

    };

    getlist = (id) => {
        getCashQueues({cash_game_id: id}, data => {

            let queues = data.ordinary_queues;
            let hight_limit = data.high_limit_queues;
            let vip = {small_blind: '', big_blind: ""};

            if (!isEmptyObject(hight_limit) && hight_limit.status) {
                queues.push(hight_limit);
            }
            logMsg('ordinary_queues', queues)


            let cash_queues1 = data.tables;
            let newTables = top_content.map(item => {
                cash_queues1.forEach(x => {
                    if (parseInt(x.table_no) === 11) {
                        vip = {small_blind: x.small_blind, big_blind: x.big_blind};
                    }
                    else if (parseInt(x.table_no) === item.id)
                        item.info = x
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
                high_limit: hight_limit

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


    _color = (small_blind, big_blind) => {
        if (isStrNull(small_blind) || isStrNull(big_blind)) {
            return '#1C1E23'
        } else if (small_blind === 50 && big_blind === 100) {
            return '#4CB564'
        } else if (small_blind === 100 && big_blind === 200) {
            return '#C14C33'
        } else if (small_blind === 25 && big_blind === 50) {
            return '#717171'
        } else if (small_blind === 300 && big_blind === 600) {
            return '#4A90E2'
        } else if (small_blind === 1000 && big_blind === 2000) {
            return '#D8A655'
        } else if (small_blind === 2000 && big_blind === 4000) {
            return '#942CEF'
        } else if (small_blind === 5000 && big_blind === 10000) {
            return '#893505'
        }
    };


    get_cash = (small_blind, big_blind) => {
        if (isStrNull(small_blind) || isStrNull(big_blind)) {
            return ``
        } else if (small_blind >= 1000) {
            return `${small_blind / 1000}K/${big_blind / 1000}K`
        } else if (big_blind >= 1000) {
            return `${small_blind}/${big_blind / 1000}K`
        } else {
            return `${small_blind}/${big_blind}`
        }


    }

    getHeight = (float) => {
        return Number(mul(HEIGHT, float))
    };
    getWidth = (float) => {
        return Number(mul(WIDTH, float))
    };

    render() {
        const {all_cash_queues, cash_queues, cash_queue_members, cash_games, cash_vip, high_limit} = this.state;

        let length = cash_queues.length;
        let div_width = this.getWidth(0.1083);
        let right_width = div(230, length);
        let all_div = add(div_width, right_width) + 54;
        return (
            <div className="home_div">
                <div className="left_div" style={{width: '17%'}}>
                    <img className="pukewang_img" style={{
                        marginTop: this.getHeight(0.056),
                        height: this.getHeight(0.11),
                        width: this.getWidth(0.14)
                    }} src={Images.pukewang}/>
                    <div className="left_line"/>

                    <span className="left_span">TABLE &nbsp; PREVIEW</span>
                    <div className="left_line"/>

                    <div className="content_circle" style={{
                        height: this.getHeight(0.50),
                        width: this.getWidth(0.145)
                    }}>
                        <div className="circle_vip"
                             style={{
                                 height: this.getHeight(0.05),
                                 width: this.getWidth(0.069),
                                 backgroundColor: this._color(cash_vip.small_blind, cash_vip.big_blind),
                                 marginTop: this.getHeight(0.01)
                             }}>
                            <span
                                className="circle_span">{this.get_cash(cash_vip.small_blind, cash_vip.big_blind)}</span>
                        </div>
                        <div className="circle_div">

                            {!isEmptyObject(all_cash_queues) && all_cash_queues.map((item, index, arr) => {
                                return (
                                    <div className="circle" key={index}
                                         style={{
                                             height: this.getHeight(0.05),
                                             width: this.getWidth(0.069),
                                             backgroundColor: item.info ? this._color(item.info.small_blind, item.info.big_blind) : this._color('', ''),
                                             marginTop: this.getHeight(0.01)
                                         }}>
                                        {item.info ? <span
                                            className="circle_span">{this.get_cash(item.info.small_blind, item.info.big_blind)}</span> : null}

                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <select id="dropdown" ref={(input) => this.menu = input}
                            onChange={() => {
                                clearInterval(this.intervalId);
                                this.getlist(this.menu.value)
                                this.intervalId = setInterval(() => {
                                    this.getlist(this.menu.value)
                                }, 5000)
                                this.setState({
                                    cash_queue_members: []
                                })


                            }}>
                        {cash_games.map((item, index) => {
                            return <option key={index} value={item.id}>{item.name}</option>
                        })}
                    </select>

                </div>

                <div className="right_div" style={{width: '83%'}}>
                    <div className="top_div" style={{height: this.getHeight(0.20), marginTop: this.getHeight(0.0463)}}>
                        <div className="top_div_content">

                            {!isEmptyObject(cash_queues) && cash_queues.map((item, index) => {
                                const {small_blind, big_blind, buy_in} = item;
                                if (index === cash_queues.length - 1 && high_limit.status) {
                                    return <div className="err2" style={{width: all_div}}>
                                        <div style={{width: right_width}}/>
                                        <div className="big_circle_last" style={{
                                            height: this.getHeight(0.092),
                                            width: this.getWidth(0.1083),
                                            paddingLeft: 27,
                                            paddingRight: 27,
                                            paddingTop: 10,
                                            paddingBottom: 10
                                        }}>
                                        </div>


                                    </div>
                                }
                                return (
                                    <div className="err2" style={{width: all_div}}>
                                        <div style={{width: right_width}}/>
                                        <div className="big_circle" key={index} style={{
                                            height: this.getHeight(0.089),
                                            width: this.getWidth(0.1083) + 54,
                                            paddingTop: 10,
                                            paddingBottom: 10
                                        }}>
                                            {strNotNull(buy_in) ?
                                                <span className="big_money_span">{`${buy_in} (HKD)`}</span>: null}

                                            <span
                                                className="big_circle_span">{this.get_cash(small_blind, big_blind)} NL</span>
                                        </div>


                                    </div>

                                )
                            })}

                            {!high_limit.status ? <div className="err2" style={{width: all_div}}>
                                <div style={{width: right_width}}/>
                                <div className="big_circle_last" style={{
                                    height: this.getHeight(0.089),
                                    width: this.getWidth(0.1083),
                                    paddingLeft: 27,
                                    paddingRight: 27,
                                    paddingTop: 10,
                                    paddingBottom: 10
                                }}>
                                </div>


                            </div> : null}
                        </div>
                    </div>

                    <div className="queue_div2">
                        <div className="queue_div" style={{marginTop: this.getHeight(0.0185)}}>
                            {!isEmptyObject(cash_queue_members) && cash_queue_members.map((item, index) => {

                                return (
                                    <div className="queue_list" key={index} style={{width: all_div}}>
                                        <div className="list_div" style={{
                                            width: right_width

                                        }}>
                                            {list.map((item, index) => {
                                                return <div className="number_div">
                                                    <span className="number_span" key={index}>{item}</span>
                                                </div>
                                            })}
                                        </div>

                                        <div className="queue" style={{
                                            width: add(this.getWidth(0.1083),54)
                                        }} key={index}>
                                            <div className="top_text_div">

                                                <span
                                                    className="text1">{`${item.table_no}(${item.table_people})`}</span>
                                            </div>
                                            <div className="queue_number_div"
                                                 style={{
                                                     width: add(this.getWidth(0.1083),54)
                                                 }}>
                                                {item.cash_items && item.cash_items.map((member_item, member_index) => {
                                                    if (member_index < 11) {

                                                        return <div className="number_name_div">
                                                            <span
                                                                className={member_item.nickname.length >= 6 ? "name_span1" : "name_span"}
                                                                key={member_index}>{member_item.nickname}</span>
                                                        </div>

                                                    }
                                                })}
                                                <div style={{display: 'flex', flex: 1}}/>
                                            </div>

                                            <div className="bottom_text_div" style={{
                                                width: add(this.getWidth(0.1083),54)
                                            }}>

                                                <span
                                                    className="queue_all">{`Total Count：${item.cash_items.length}`}</span>
                                            </div>
                                        </div>


                                    </div>
                                )
                            })}
                            {!high_limit.status ? <div className="queue_list" style={{width: all_div}}>
                                <div className="list_div" style={{width: right_width}}>
                                    {list.map((item, index) => {
                                        return <div className="number_div">
                                            <span className="number_span" key={index}>{item}</span>
                                        </div>
                                    })}
                                </div>

                                <div className="queue" style={{
                                    width: add(this.getWidth(0.1083),54)
                                }}>
                                    <div className="top_text_div">

                                        <span className="text1">0</span>
                                    </div>
                                    <div className="queue_number_div"
                                         style={{
                                             width: add(this.getWidth(0.1083),54)
                                         }}>

                                        <div style={{display: 'flex', flex: 1}}/>

                                    </div>
                                    <div className="bottom_text_div" style={{
                                        width: add(this.getWidth(0.1083),54)
                                    }}>

                                                <span
                                                    className="queue_all">{`Total Count：0`}</span>
                                    </div>
                                </div>

                            </div> : null}

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}