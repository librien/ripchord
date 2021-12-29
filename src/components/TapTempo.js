/**
 * Taken from https://codepen.io/dxinteractive/pen/bpaMMy
 * https://github.com/dxinteractive/ArduinoTapTempo
 */
import { TouchApp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { letterSpacing } from '@mui/system';
import { useEffect, useState } from 'react';

const millis = function() {
  const d = new Date();
  return d.getTime(); 
};

const totalTapValues = 5;
const msUntilChainReset = 2000;
const skippedTapThresholdLow = 1.75;
const skippedTapThresholdHigh = 2.75;
let sinceResetMS = 0;
let sinceResetMSOld = 0
let resetMS = millis();
let lastTapMS = 0;
let lastTapSkipped = false;
let tapDurations = [0,0,0,0,0];
let tapDurationIndex = 0;
let tapsInChain = 0;
let buttonDown = false;
let buttonDownOld = false;
const TapTempo = (props) => {

  const [beatMS, setBeatMS] = useState(500);

  const getAverageTapDuration = function() {
    let amount = tapsInChain - 1;
    if(amount > totalTapValues) {
      amount = totalTapValues;
    }
    
    let runningTotal = 0;
    for(let i=0; i<amount; i++) {
      runningTotal += tapDurations[i];
    }
    
    return Math.floor(runningTotal / amount);
  };

  const tap = function(ms) {
    
    tapsInChain = tapsInChain + 1;
    if (tapsInChain === 1) {
      lastTapMS = ms;
      return -1;
    }
    
    let duration = ms - lastTapMS;
    
    // detect if last duration was unreasonable
    if (tapsInChain > 1
      && !lastTapSkipped
      && duration > beatMS * skippedTapThresholdLow
      && duration < beatMS * skippedTapThresholdHigh) {
      
      duration = Math.floor(duration * 0.5);
      lastTapSkipped = true;
    } 
    else {
      lastTapSkipped = false;
    }
    
    tapDurations[tapDurationIndex] = duration;
    tapDurationIndex++;
    if(tapDurationIndex === totalTapValues) {
      tapDurationIndex = 0;
    }

    let newBeatMS = getAverageTapDuration();
    
    lastTapMS = ms;
    return newBeatMS;
  };

  const resetTapChain = function(ms) {
    tapsInChain = 0;
    tapDurationIndex = 0;
    resetMS = ms;
    for (let i=0; i<totalTapValues; i++) {
      tapDurations[i] = 0;
    }
  };

  const loop = function() {
    let ms = millis();
    
    // if a tap has occured...
    if (buttonDown && !buttonDownOld) {
      
      // start a new tap chain if last tap was over an amount of beats ago
      if (lastTapMS + msUntilChainReset < ms) {
        resetTapChain(ms);
      }
      
      let newBeatMS = tap(ms);
      if (newBeatMS !== -1) {
        setBeatMS(newBeatMS);
      }
    }
    
    sinceResetMS = ms - resetMS
    
    buttonDownOld = buttonDown;
    sinceResetMSOld = sinceResetMS;
  };

  setInterval(loop,10);

  useEffect(() => {
    let tempo = Math.floor(60000/beatMS);
    if (tempo > 250) {
      tempo = 250;
    }
    else if (tempo < 35) {
      tempo = 35;
    }
    props.setTempo(tempo);
  }, [beatMS]);

  return (
    <Button variant="outlined" onMouseDown={() => buttonDown = true} onMouseUp={() => buttonDown = false} startIcon={<TouchApp />}>
      Tap
    </Button>
  )
}

export default TapTempo;
