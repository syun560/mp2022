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

    const selector = <select value={props.channel} onChange={(e:any)=>{props.setChannel(Number(e.target.value))}}>
        {(()=> {
            const ch: JSX.Element[] = []
            for (let i = 0; i <= ch_max; i++) {
                ch.push(<option key={i}>{i}</option>)
            }
            return ch
        })()}
    </select>

    return <span className='me-2'>Track: {selector}</span>
}