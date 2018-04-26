import React, { Component } from 'react';
import './index.less';
import { Layout } from 'antd';
import Stats from '../../utils/stats';

import monkey from '../../assets/ironman.jpg';
import '../../libs/brf_wasm/BRFv4_JS_TK190218_v4.0.5_trial.js';

const { Header, Content } = Layout;


class AsmVideo extends Component {

  componentDidMount() {
    const self = this;
    const canvas   = document.getElementById("drawCanvas");
    const context = canvas.getContext("2d");
    this.context = context;
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      self.asmvideo.src = window.URL.createObjectURL(stream);
      self.asmvideo.play();
      waitForSDK();
      trackFaces();
    });
   
    this.showPerfermence();

    this.bindVideoEventListener()
  }


  bindVideoEventListener() {
    const vid = this.asmvideo;
    vid.onloadedmetadata = () => {
      console.log('onloadedmetadata');
      vid.play();
    }
  }

  showPerfermence() {
    const stats = new Stats();
    stats.showPanel( 2 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.videoWrapper.appendChild( stats.dom );
    function animate() {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate); 
    document.addEventListener('clmtrackrIteration', function(event) {
      stats.update();
    }, false);
  }

  render() {
    return (
      <Layout className="asmboard">
        <Header>ASM_VIDEO__FACE</Header>
        <Content className="flex-col-center">
          <div className="video-wrapper" ref={ref => this.videoWrapper = ref}>
            <video width="400" height="400" autoPlay ref={ref => this.asmvideo = ref} loop playsInline/>
            <canvas id="drawCanvas" width="400" height="400"></canvas>
          </div>
          <div className="mask-wrapper">
            <img ref={ref => this.monkey = ref} src={monkey} alt=""/>
          </div>  
        </Content>
      </Layout>
    );
  }
}

export default AsmVideo;
