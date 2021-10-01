import React, { useState } from 'react'

import Tab from './tab/Tab'
import MidiIn from './tab/MidiIn'
import PianoRoll from './tab/PianoRoll/PianoRoll'
import Param from './tab/Param'
import Tuning from './tab/Tuning'
import { noteNumberToNoteName } from './tab/Lib'
import { NoteDatum } from './tab/type'

const originalData2: NoteDatum[] = [
    { note: 64, time: 0,    duration: 0.25 },
    { note: 63, time: 0.25, duration: 0.25 },
    { note: 64, time: 0.5,  duration: 0.25 },
    { note: 63, time: 0.75, duration: 0.25 },
    { note: 64, time: 1,    duration: 0.25 },
    { note: 59, time: 1.25, duration: 0.25 },
    { note: 62, time: 1.5,  duration: 0.25 },
    { note: 60, time: 1.75, duration: 0.25 },
    { note: 45, time: 2,    duration: 1    },
    { note: 52, time: 2,    duration: 1    },
    { note: 57, time: 2,    duration: 1    },
    { note: 52, time: 3,    duration: 0.25 },
    { note: 57, time: 3.25, duration: 0.25 },
    { note: 40, time: 3.5,  duration: 0.75 },
    { note: 56, time: 3.5,  duration: 0.75 },
    { note: 59, time: 3.5,  duration: 0.75 },
]

const originalData = [
    [64],
    [63],
    [64],
    [63],
    [64],
    [59],
    [62],
    [60],
    [45, 52, 57],
    [52],
    [57],
    [40,56,59],
    [52],
    [56],
    [59],
    [45, 57, 60],
    [52],
    [64],
    [63],
    [64],
    [63],
    [64],
    [59],
    [62],
    [60],
    [45, 52, 57],
    [52],
    [57],
    [40,56,59],
    [52],
    [60],
    [59],
    [45, 52, 57],
    [59],
    [60],
    [62]
]

const App = () => {
    const [w, setW] = useState(0.8)
    const [noteData, setNoteData] = useState<NoteDatum[]>(originalData2)
    const [tuning, setTuning] = useState<number[]>([40, 45, 50, 55, 59, 64])

    return <div className="container">
        <div className="bg-light my-3 p-3">
            <MidiIn noteData={noteData} setNoteData={setNoteData} />
            <PianoRoll noteData={noteData} />

            <Param w={w} setW={setW} />
            
            <Tuning setTuning={setTuning} />
    
            {/* tuning: {tuning.map(value => noteNumberToNoteName(value))} */}
        </div>

        <hr />
        <br />
        <Tab w={w} noteData={noteData} tuning={tuning} />

    </div>
}

export default App
