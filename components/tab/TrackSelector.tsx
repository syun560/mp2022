import React, { useState } from 'react'
import { NoteDatum } from './type'

interface Props {
    noteData: NoteDatum[]
    channel: number
    setChannel: any
}

export default function TrackSelector (props: Props){
    // チャンネルセレクタ
    // 最後のノートのチャンネルをトラック数とする
    const ch_max = props.noteData[props.noteData.length - 1].channel

    const selector = <select className='form-select' value={props.channel} onChange={(e:any)=>{props.setChannel(Number(e.target.value))}}>
        {(()=> {
            const ch: JSX.Element[] = []
            for (let i = 0; i <= ch_max; i++) {
                const found = props.noteData.filter(n=>n.channel===i)
                ch.push(<option key={i} value={i}>Track: {i} ({found.length} notes)</option>)
            }
            return ch
        })()}
    </select>

    return <div className='mb-2'>
        <span>{selector}</span>
    </div>
}