import React, { Component } from 'react';
import './index.scss';
import { Layout } from 'antd';
import Stats from '../../utils/stats';
import clm from 'clmtrackr';

import faceDeformer from '../../utils/fd';
import monkey from '../../assets/ironman.jpg';
import model from '../../utils/model';

const { Header, Content } = Layout;


class Doashboard extends Component {

  componentDidMount() {
    const self = this;
    const canvas   = document.getElementById("drawCanvas");
    const context = canvas.getContext("2d");
    this.context = context;
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      self.video.src = window.URL.createObjectURL(stream);
      self.video.play();
    });
    const ctracker = new clm.tracker();
    this.fd = new faceDeformer();
    this.ctracker = ctracker;
    ctracker.init(model);
    ctracker.start(this.video);
    this.showPerfermence();

    function drawLoop() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      ctracker.draw(canvas);
      var pn = ctracker.getConvergence();
      if (pn < 0.4) {
        requestAnimationFrame(self.drawMaskLoop);
      } else {
        requestAnimationFrame(drawLoop);
      }
    }
    drawLoop();
    this.bindVideoEventListener()
  }

  drawMaskLoop = () => {
    const positions = this.ctracker.getCurrentPosition();
    this.context.clearRect(0, 0, 400, 400);
    if (positions) {
      // draw mask on top of face
      this.fd.draw(positions);
    }
    requestAnimationFrame(this.drawMaskLoop);
  }
  
  bindVideoEventListener() {
    const vid = this.video;
    const webgl_overlay = document.getElementById('webgl');
    vid.onloadedmetadata = () => {
      console.log('onloadedmetadata');
      this.fd.init(webgl_overlay);
      vid.play();
      this.loadMask();
    }
  }

  loadMask() {
    this.ironman = [[54.132994582809886,330.2447406482356],[53.94983737338171,411.6786947731232],[59.50117090734213,485.54290769879117],[69.05631570910228,577.6685769791815],[80.73400747239302,669.2047081882876],[156.52267192878207,721.5706883991684],[224.03761978834723,739.1269072358452],[301.4803537679236,738.2366874355024],[373.4196207112528,736.6185556997145],[445.4373067968218,720.1452812831552],[517.3056114476371,670.5474614197833],[531.7799053755264,574.1779931382804],[540.681172219442,487.967223266098],[542.4032150608897,399.64595333584305],[541.5099369565868,318.2177239885218],[484.00763535360403,311.3318445452918],[436.57616449858205,326.12885038303966],[386.214847801106,333.2043197182652],[344.39911403378784,336.7706741289662],[115.84864343665006,313.35525243241443],[152.60840318917894,322.7145050535586],[201.39783835228144,332.29526724516336],[249.58724826191298,336.53976562323317],[116.48023640991207,348.8633768136441],[167.9642886955806,350.9962302246727],[231.6749647028165,359.48349174177827],[168.11831577303042,375.4865728177492],[170.07462103025938,361.76575290725043],[480.7831200700384,348.57719399476593],[423.78106882269736,353.08381522791285],[369.5853199174605,360.3348770905004],[429.2517105029677,374.978498189726],[428.4672557696136,361.0310278167258],[298,363],[253.70821429640165,456.1515630753871],[232.81854206254127,493.52915431030885],[250.27449264190767,519.2760705851281],[294.9905749783811,522.6580485667231],[340.00710866420684,520.8077271147647],[357.28424845402884,493.1349774295837],[336.03221275387335,457.7253897416814],[296,407],[270.69780042635847,507.2277260957476],[320.8265507066314,506.90809731554305],[219.49207600124322,603.6108989555861],[236.4148918469843,589.8509195222699],[267.0123175575189,590.2653879517876],[302.37639394449644,589.4456339021824],[337.18338067155105,591.0755705685021],[366.9537080661368,591.1696362146871],[383.17030058050824,601.5027761622135],[366.07822563380967,614.8268645173376],[336.20759244137867,615.427540755917],[304.12597029775543,615.4777558918809],[270.01910167830954,615.9331065732697],[240.4271869365151,614.9063722445486],[255.5183417994636,603.9175341052295],[302.81892822034536,605.4895650711086],[350.74058301633727,604.2225054756758],[350.6655959742464,603.528118265738],[303.78446463916174,604.3090513544694],[256.409865954666,603.8790201634539],[298.25175247557996,482.7822436696597],[141.22182216936852,346.4270057321846],[206.31948949078424,356.7387529836485],[202.39427275621864,368.9872676086593],[136.2964448024117,368.67555898584044],[454.78000220898934,348.3276075895992],[398.6821272555564,355.2080431875895],[398.9194910642594,369.6579535284187],[466.01878775359233,368.7792910743897]];
    this.fd.load(this.monkey, this.ironman, model);
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
      <Layout className="dashboard">
        <Header>JS_VIDEO__FACE</Header>
        <Content className="flex-col-center">
          <div className="video-wrapper" ref={ref => this.videoWrapper = ref}>
            <video width="400" height="400" autoPlay ref={ref => this.video = ref} loop playsInline/>
            <canvas id="drawCanvas" width="400" height="400"></canvas>
            <canvas id="webgl" width="400" height="400"></canvas>
          </div>
          <div className="mask-wrapper">
            <img ref={ref => this.monkey = ref} src={monkey} alt=""/>
          </div>  
        </Content>
      </Layout>
    );
  }
}

export default Doashboard;
