import React from 'react';
import alarmSound from './security-alarm-80493.mp3'; // Import your alarm sound file
import { Button } from '@mui/material';
class AlarmButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false
    };
    this.audio = new Audio(alarmSound);
  }

  handleClick = () => {
    if (!this.state.playing) {
      // Play the alarm sound
      this.audio.play();
      this.setState({ playing: true });

      // Stop the alarm sound after 10 seconds
      setTimeout(() => {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.setState({ playing: false });
      }, 5000); // Change 10000 to the duration you want in milliseconds (e.g., 10 seconds)
    }
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClick} style={{
          margin: "20px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "red",
          color: "black",
          fontWeight: "bold",
        
        }}>Start Alarm</Button>
      </div>
    );
  }
}

export default AlarmButton;
