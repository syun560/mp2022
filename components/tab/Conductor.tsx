import React, { useState, useEffect } from 'react'
import * as Tone from "tone";

interface Props {
    tickLength: number
    isPlaying: boolean
}

export default function Conductor (props: Props){
    console.log("conductor")
    const [nowTick, setNowTick] = useState(0)
    const [synth, setSynth] = useState<Tone.Synth>()
    
    useEffect(()=>{
        setSynth(new Tone.Synth().toDestination())
    }, [])

    const tdStyle = {
        borderBottom: '1px solid black'
    }

    const cells = (()=> {
        const res: JSX.Element[] = []
        for (let tick = 0; tick <= props.tickLength; tick++) {
            res.push(<td key={tick} style={tdStyle} className={nowTick === tick ? 'table-danger' : ''}>
                {tick % 8 === 0 ? tick / 8 : ''}
            </td>)
        }
        return res
    })()

    const test = () => {
        synth?.triggerAttackRelease("C4", "8n")
    }

    return <tr>
        <th style={tdStyle} onClick={test}></th>
        {cells}
    </tr>
}