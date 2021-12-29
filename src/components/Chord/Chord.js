import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { ChordBox } from "vexchords";
import "./Chord.scss";

const ChordDiagram = (props) => {
  const chordRef = useRef(null);
  
  useEffect(() => {
      const chord = new ChordBox(chordRef.current, {
          width: 200,
          height: 240,
          // See the docs for more available options.
          // https://github.com/0xfe/vexchords
      });

      chord.draw({
        chord: props.notes,
        position: props.fretPosition,
        tuning: ['E', 'A', 'D', 'G', 'B', 'e'],
        barres: props.barres ? props.barres : undefined
      });
  });

  return (
    <div className="chord-diagram">
      <div ref={chordRef}></div>
    </div>
  );
};

export default ChordDiagram;