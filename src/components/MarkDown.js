import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './MarkDown.css';
import {isEmptyObject} from "../utils/utils";


class MarkDown extends Component {

    componentDidMount(){
        let frag = document.getElementById('introduceGame');
        let result = [].map.call(frag.querySelectorAll('img'), function(img){ return img });
        console.log('result',result);
        let Images = [];
        !isEmptyObject(result) && result.map((img,index)=>{
            if(img.alt && img.alt === 'MACAUHIKE'){
                result[index].className = 'macauhike_img'
                img.style.cssText=`width: ${img.naturalWidth};height: ${img.naturalHeight};`
            }else{
                result[index].className = 'macauhike_img2'
            }
        })

    }


    render() {
        const {description} = this.props;
        let text = description.replace(/\n/g, "<br/>");
        return (
            <div style={{width: '100%', height: '100%', paddingTop: 10}}>
                <div id="introduceGame" className="introduceGame" dangerouslySetInnerHTML={{__html: text}}/>

            </div>

        );
    }

}


const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden'

    }
}

export default withRouter(MarkDown);