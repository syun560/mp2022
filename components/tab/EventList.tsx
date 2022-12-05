import React, { useState, memo } from 'react'
import { NoteDatum } from './type'
import { noteNumberToNoteName } from './Lib'

interface Props {
    noteData: NoteDatum[]
    channel: number
}

const EventList = (props: Props) => {
    const noteData = props.noteData.filter(f=>f.channel===props.channel)

    const list = noteData.map((n, i)=><tr key={i}>
        {/* <td>{n.channel}</td> */}
        <td>{n.time/480}</td>
        <td>{n.note + ' [' + noteNumberToNoteName(n.note) + ']'}</td>
        <td>{(n.duration/480).toFixed(2)}</td>
    </tr>)

    const box = {
        height: '275px',
        overflow: 'auto',
    }
    const th = {
        position: 'sticky' as const,
        top: 0,
        zIndex: 1
    }

    return <div style={box} className='bar'>
        <table className="table table-sm">
            <thead><tr>
                {/* <th>ch</th> */}
                <th style={th} className='table-secondary'>Time</th>
                <th style={th} className='table-secondary'>Note</th>
                <th style={th} className='table-secondary'>Dur</th>
            </tr></thead>
            <tbody>
                {list}
            </tbody>
        </table>
    </div>
}

export default memo(EventList)