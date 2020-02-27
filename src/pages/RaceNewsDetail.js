import React, { Component } from 'react';
import {getRaceNewDetail} from '../services/InfoDao';
import {isEmptyObject,strNotNull,weiXinShare} from "../utils/utils";
import {Images,MarkDown} from '../components'

export default class RaceNewsDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            event: {}
        }
    }

    componentDidMount() {


        const {id} = this.props.match.params;

        getRaceNewDetail({id: id}, data => {
            console.log("RaceNews:", data);
            this.setState({
                event: data.event
            });

            const {name, logo} = data.event;
            document.title = name;

            const message = {
                title: name,
                desc: 'Kings Live',//分享描述
                link: window.location.href, // 分享链接，该链接域名必须与当前企业的可信域名一致
                imgUrl: isEmptyObject(logo) ? Images.empty_img : logo, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            };
            const url = {url: window.location.href};
            console.log("message:", message);
            // weiXinShare(url, message);

        }, err => {

        });

    };

    render() {
        const {info} = this.state;
        if(isEmptyObject(info)){
            return <div/>
        }
        return (
            <div>
                {strNotNull(info.description) ? <MarkDown description={info.description}/> : null}
            </div>
        );
    }
}

