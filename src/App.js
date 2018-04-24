import React, { Component } from 'react';
import './App.css';
import { Layout } from 'antd';
import Stats from './utils/stats';
import clm from 'clmtrackr';
import 'antd/dist/antd.css';


const { Header, Content } = Layout;


class App extends Component {

  componentDidMount() {
    const self = this;
    navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(function(stream) {
      const url = URL.createObjectURL(stream);
      self.video.src = url;
      const ctracker = new clm.tracker();
      ctracker.init();
      ctracker.start(self.video);
      var canvasInput = document.getElementById('drawCanvas');
      var cc = canvasInput.getContext('2d');
      function drawLoop() {
        requestAnimationFrame(drawLoop);
        cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
        ctracker.draw(canvasInput);
      }
      drawLoop();
    }, function(err) {
      throw err
    });
    this.showPerfermence();
    console.log(clm);
    
  }

  showPerfermence() {
    const stats = new Stats();
    stats.showPanel( 2 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.videoWrapper.appendChild( stats.dom );
    function animate() {
      stats.begin();
      stats.end();
      requestAnimationFrame( animate );
    }
    requestAnimationFrame( animate ); 
  }

  render() {
    return (
      <Layout className="App">
        <Header>VIDEO__FACE</Header>
        <Content className="flex-col-center">
          <div className="video-wrapper" ref={ref => this.videoWrapper = ref}>
            <video autoPlay ref={ref => this.video = ref} loop playsInline/>
            <canvas id="drawCanvas" width="400" height="400"></canvas>
          </div>  
        </Content>
      </Layout>
    );
  }
}

export default App;
