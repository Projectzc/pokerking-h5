/**
 *作者：lorne
 *时间：2019/4/25
 *功能：
 */

import React, {Component} from 'react';
import '../css/demo.css'


export  default class DemoHome extends Component{

    render(){
        return <div className="body container-fluid">
            <div className="row headNav">
                <div className="btn_P col-md-1">按钮</div>

            </div>

            <div className="row con">
                <div className="col-md-3 menu">
                    目录
                </div>

                <div className="col-md-9 content">
                    内容
                    <div className="row list">
                        <div className="col-md-3 item">


                        </div>

                        <div className="col-md-3 item">

                        </div>

                    </div>
                </div>

            </div>

        </div>
    }
}

