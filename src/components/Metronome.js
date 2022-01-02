import { PlayCircleOutline, StopCircleOutlined } from "@mui/icons-material";
import { Grid, Slider, Input, IconButton, TextField } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import useInterval from "../utils/useInterval";
import TapTempo from "./TapTempo";

let audioContext = null;
let notesInQueue = []; // notes that have been put into the web audio and may or may not have been played yet {note, time}
let currentQuarterNote = 0;
let lookahead = 25; // How frequently to call scheduling function (in milliseconds)
let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
let nextNoteTime = 0.0; // when the next note is due

const Metronome = (props) => {
  
  const [tempo, setTempo] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [beats, setBeats] = useState(4);

  const handleSliderChange = (event, newTempo) => {
    setTempo(newTempo);
  };

  const handleInputChange = (event) => {
    setTempo(event.target.value === "" ? "" : Number(event.target.value));
  };

  const calculateTempo = (_tempo) => {
    return _tempo / 250;
  };

  const handleBlur = () => {
    if (tempo < 35) {
      setTempo(35);
    } else if (tempo > 250) {
      setTempo(250);
    }
  };

  const nextNote = useCallback(() => {
    // Advance current note and time by a quarter note (crotchet if you're posh)
    let secondsPerBeat = 60.0 / tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
    nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    currentQuarterNote++; // Advance the beat number, wrap to zero
    if (currentQuarterNote === beats) {
      currentQuarterNote = 0;
    }
  }, [beats, tempo]);

  const scheduleNote = useCallback(
    (beatNumber, time) => {
      // push the note on the queue, even if we're not playing.
      notesInQueue.push({ note: beatNumber, time: time });

      // create an oscillator
      const osc = audioContext.createOscillator();
      const envelope = audioContext.createGain();

      osc.frequency.value = beatNumber % beats === 0 ? 2000 : 1200;
      envelope.gain.value = 1;
      envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
      envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

      osc.connect(envelope);
      envelope.connect(audioContext.destination);

      osc.start(time);
      osc.stop(time + 0.03);
    },
    [beats]
  );

  const scheduler = useCallback(() => {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
      scheduleNote(currentQuarterNote, nextNoteTime);
      nextNote();
    }
  }, [nextNote, scheduleNote]);

  useEffect(() => {
    if (isRunning) {
      if (audioContext == null) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      currentQuarterNote = 0;
      nextNoteTime = audioContext.currentTime + 0.05;

      let intervalId = setInterval(() => scheduler(), lookahead);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isRunning, scheduler]);

  return (
    <Grid sx={{ flexGrow: 1 }} container justifyContent="center" spacing={1}>
      <Grid item lg={12}>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid item alignItems="center">
            <IconButton
              aria-label="start"
              color="primary"
              size="large"
              onClick={() => {
                setIsRunning((r) => !r);
              }}
            >
              {!isRunning ? <PlayCircleOutline sx={{fontSize: '3rem'}}/> : <StopCircleOutlined sx={{fontSize: '3rem'}}/>}
            </IconButton>
          </Grid>
          <Grid item xs={6} md={4} lg={2} alignItems="center">
            <Slider
              size="small"
              scale={calculateTempo}
              value={typeof tempo === "number" ? tempo : 0}
              min={35}
              max={250}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item>
            <TextField
              value={tempo}
              label="BPM"
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              variant="outlined"
              inputProps={{
                step: 1,
                min: 35,
                max: 250,
                type: "number",
                "aria-labelledby": "input-slider"
              }}
            />
          </Grid>
          <Grid item>
            <TapTempo tempo={tempo} setTempo={setTempo} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Metronome;
