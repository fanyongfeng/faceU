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
    // navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    //   self.asmvideo.src = window.URL.createObjectURL(stream);
    //   self.asmvideo.play();
    //   const resolution	= new brfv4.Rectangle(0, 0, 400, 300);
		// 	const brfManager	= new brfv4.BRFManager();
		// 	brfManager.init(resolution, resolution, "com.tastenkunst.brfv4.js.examples.minimal.webcam");
    //   function trackFaces() {
    //     context.setTransform(-1.0, 0, 0, 1, resolution.width, 0); // mirrored for draw of video
    //     context.drawImage(self.asmvideo, 0, 0, resolution.width, resolution.height);
    //     context.setTransform( 1.0, 0, 0, 1, 0, 0); // unmirrored for draw of results
    //     brfManager.update(context.getImageData(0, 0, resolution.width, resolution.height).data);
    //     var faces = brfManager.getFaces();
    //     for(var i = 0; i < faces.length; i++) {
    //       var face = faces[i];
    //       if(		face.state === brfv4.BRFState.FACE_TRACKING_START ||
    //           face.state === brfv4.BRFState.FACE_TRACKING) {
    //         context.strokeStyle="#00a0ff";
    //         for(var k = 0; k < face.vertices.length; k += 2) {
    //           context.beginPath();
    //           context.arc(face.vertices[k], face.vertices[k + 1], 2, 0, 2 * Math.PI);
    //           context.stroke();
    //         }
    //       }
    //     }
    //     requestAnimationFrame(trackFaces);
    //   }
    //   trackFaces();
    // });
    
   
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
