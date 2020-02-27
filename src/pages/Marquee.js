/**
 *作者：lorne
 *时间：2019/5/9
 *功能：
 */

import React, {Component} from 'react';
import '../css/marquee.css'
import {logMsg} from "../utils/utils";

export default class Marquee extends Component {

    onMarquee = (id)=>{

        let container = this.marquee,
            original = container.getElementsByTagName("dt")[0],
            clone = container.getElementsByTagName("dd")[0],
            speed = 30;
        clone.innerHTML=original.innerHTML;
        let rolling = function(){
            if(container.scrollLeft == clone.offsetLeft){
                container.scrollLeft = 0;
                // container.scrollLeft -= clone.scrollLeft;
            }else{
                container.scrollLeft++;
            }
        }
        var timer = setInterval(rolling,speed)//设置定时器
        container.onmouseover=function() {clearInterval(timer)}//鼠标移到marquee上时，清除定时器，停止滚动
        container.onmouseout=function() {timer=setInterval(rolling,speed)}//鼠标移开时重设定时器
    }

    componentDidMount(){
        this.onMarquee('marquee')
    }


    render(){
        return <div id="marquee" style={this.props.styles}
                    ref={ref => this.marquee = ref}>
            <dl>
                <dt>
                    {this.props.children}
                </dt>
                <dd></dd>
            </dl>
        </div>
    }
}