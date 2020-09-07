import React, { Component, useRef, useEffect } from 'react';
import $ from 'jquery';
import './App.css';
import ReactInputPosition, { MOUSE_ACTIVATION, TOUCH_ACTIVATION } from "react-input-position";
import io from 'socket.io-client';
 
const socket = io('http://localhost:41000');

const X_AXIS_DIFF = 1; //4;//1961.5;
const Y_AXIS_DIFF = 1; //1961.5;
const SWIPE_SENSITIVITY = 80;

class Screen extends Component {

  swipe = {
    from: {
      x : 0,
      y : 0
    },
    to: {
      x : 0,
      y : 0
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', event => {
      event.preventDefault();

      if(event.keyCode === 224) return;

      socket.emit('key', { key: event.key });
      console.log('event ', event)
    })
  }

  render() {
    return (
      <img

        onMouseDown={e => {
          this.swipe.from.x = e.screenX * X_AXIS_DIFF;
          this.swipe.from.y = e.screenY * Y_AXIS_DIFF;
        }}
        
        onMouseUp={e => {
          this.swipe.to.x = e.screenX * X_AXIS_DIFF;
          this.swipe.to.y = e.screenY * Y_AXIS_DIFF;
          
          let average = this.swipe.from.y - this.swipe.to.y;

          average = average > 0 ? average : average * -1;

          if(average < SWIPE_SENSITIVITY) return;

          socket.emit('swipe', this.swipe );
        }}
  
        onClick={(e) => {

          let average = this.swipe.from.y - this.swipe.to.y;
          average = average > 0 ? average : average * -1;
          
          if(!(average < SWIPE_SENSITIVITY)) return;

          socket.emit('tap', { x: this.props.activePosition.x * X_AXIS_DIFF, y: this.props.activePosition.y * Y_AXIS_DIFF });
        }}
      
      style={{ width: '240px', height: '400px' }}
      src={`data:image/jpeg;base64,${this.props.data}`} />
    )
  }
  
}

class App extends Component {

  state = {
    data: null
  }

  componentDidMount() {
    socket.on('data', (data) => {
      this.setState({ data });
    });
  }

  componentWillUnmount() {
    socket.off('data')
  }

  render() {
    const  {width, height} = ( document.getElementById('emulator') || { getClientRects: () => [{ width: '', height: '' }]} ).getClientRects()[0];

    return (
          <div id="parent" style={{
            width: `${width}px`,
            height: `${height}px`
          }}  >
            <ReactInputPosition
              touchActivationMethod={TOUCH_ACTIVATION.DOUBLE_TAP}
            >
              <Screen data={this.state.data} />
            </ReactInputPosition>
            <div>
              <button onClick={(e) => {
                e.preventDefault();
                socket.emit('key', { key: 'Back' });
              }} > Back</button>
              <button onClick={(e) => {
                e.preventDefault();
                socket.emit('key', { key: 'Home' });
              }} > Home</button>
            </div>
          </div>
    );
  }
 
}

export default App;
