import React, {Component} from 'react';
import {mul, weiXinShare} from "../utils/utils";
import '../css/Download.css';
import {Images} from '../components';

export default class LoadApp extends Component {
    state = {
        show: false,
        showAndroid: false
    };

    componentDidMount() {

        document.title = "Pokerkinglive";
        //微信二次分享
        const message = {
            title: 'Pokerkinglive',
            desc: 'Pokerkinglive',//分享描述
            link: window.location.href, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: Images.default_img, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接`，默认为空
        };
        const url = {url: window.location.href};
        weiXinShare(url, message);
    };

    toIosApp = () => {
        this.setState({
            show: true
        });

    };
    toAndroidApp = () => {

        let plat = navigator.userAgent;
        if (plat.indexOf('Android') > -1 || plat.indexOf('Adr') > -1) {
            let ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                this.setState({
                    showAndroid: true
                });
            } else {

                this.open_android(`http://cdn-upyun.deshpro.com/deshpro_public/pokerkinglive.apk`);
            }


        }

    };

    open_android = (url) => {
        let a = document.getElementById("android_load");
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.click();
    }


    render() {
        return (
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                {this.state.showAndroid ? <div style={{
                    width: '100%',
                    height: 70,
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    backgroundColor: '#444444'
                }}>
                    <img style={{width: '70%', height: 70, marginRight: 23}} src={Images.safari} alt=""/>
                </div> : null}

                <div className="Download" style={this.state.showAndroid ? {marginTop: 70} : null}>

                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: Number(mul(window.screen.availHeight, 0.272))
                    }}>
                        <a onClick={this.toIosApp}
                           href="itms-services://?action=download-manifest&url=https://cdn-upyun.deshpro.com/deshpro_public/manifest_kings.plist"
                           className="onclick">
                            <img className="iosDownloadImg2" src={Images.iphoneload} alt=""/>
                        </a>
                    </div>

                </div>
            </div>

        )
    }
}