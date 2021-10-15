import React, { useState } from 'react'
import { NoteDatum } from './type'
import { noteNumberToNoteName } from './Lib'

interface Props {
    noteData: NoteDatum[]
    channel: number
}

export default function EventList (props: Props){
    const noteData = props.noteData.filter(f=>f.channel===props.channel)

    const list = noteData.map((n, i)=><tr key={i}>
        {/* <td>{n.channel}</td> */}
        <td>{n.time}</td>
        <td>{n.note + ' [' + noteNumberToNoteName(n.note) + ']'}</td>
        <td>{n.duration.toFixed(1)}</td>
    </tr>)

    const box = {
        height: '275px',
        overflow: 'auto',
    }

    const debug_info = <p>
        Notes: {noteData.length} min: {noteNumberToNoteName([...noteData].sort((a,b)=>a.note < b.note ? -1 : 1)[0]?.note)}
    </p>

    return <div style={box}>
        {debug_info}
        <table className="table table-sm">
            <thead><tr>
                {/* <th>ch</th> */}
                <th>Time</th>
                <th>Note</th>
                <th>Dur</th>
            </tr></thead>
            <tbody>
                {list}
            </tbody>
        </table>
    </div>
}