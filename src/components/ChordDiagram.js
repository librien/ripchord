import { useEffect, useState } from 'react';
import Chord from '@tombatossals/react-chords/lib/Chord'

const ChordDiagram = (props) => {
  const [chord, setChord] = useState();

  useEffect(() => {
    setChord(props.chord);
  }, [props.chord]);

  /*const chord = {
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    //fingers: ['E', 'A', 'D', 'G', 'B', 'E'],
    barres: [1],
    capo: false,
  }*/
  const instrument = {
      strings: 6,
      fretsOnChord: 4,
      name: 'Guitar',
      keys: [],
      tunings: {
          standard: ['E', 'A', 'D', 'G', 'B', 'e']
      }
  }
  const lite = false // defaults to false if omitted
  return (
    <>
      {chord && <Chord
          chord={props.chord}
          instrument={instrument}
      />}
    </>
  )
}

export default ChordDiagram;