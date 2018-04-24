import React, { Component } from 'react';
import './App.css';
import { Layout } from 'antd';
import Stats from './utils/stats';
import clm from './utils/c';
import 'antd/dist/antd.css';


const { Header, Content } = Layout;


class App extends Component {

  componentDidMount() {
    const self = this;
    navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(function(stream) {
      const url = URL.createObjectURL(stream);
      self.video.src = url;
    }, function(err) {
      throw err
    });
    var ctracker = new clm.tracker();
      ctracker.init();
      ctracker.start(this.video);
    this.showPerfermence();
    function positionLoop() {
      requestAnimationFrame(positionLoop);
      var positions = ctracker.getCurrentPosition();
      // do something with the positions ...
      // print the positions
      var positionString = "";
      if (positions) {
        for (var p = 0;p < 10;p++) {
          positionString += "featurepoint "+p+" : ["+positions[p][0].toFixed(2)+","+positions[p][1].toFixed(2)+"]<br/>";
        }
        document.getElementById('positions').innerHTML = positionString;
      }
    }
    positionLoop();

    var canvasInput = document.getElementById('drawCanvas');
    var cc = canvasInput.getContext('2d');
    function drawLoop() {
      requestAnimationFrame(drawLoop);
      cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
      ctracker.draw(canvasInput);
    }
    drawLoop();

    this.video.onloadedmetadata = () => {
      this.video.play();
    }
    this.video.onresize = () => {
     
    }
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
    document.addEventListener('clmtrackrIteration', function(event) {
      stats.update();
    }, false);
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
