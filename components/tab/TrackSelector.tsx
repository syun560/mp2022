import React, { useContext } from 'react'
import { NoteDatum } from './type'
import { StateContext, DispatchContext } from '../../pages'

export default function TrackSelector (){
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    // チャンネルセレクタ
    // 最後のノートのチャンネルをトラック数とする
    let ch_max = 0
    if(state.noteData.length > 0) ch_max = [...state.noteData].sort((a,b)=>{
        if(a.channel<b.channel) return 1;
        if(a.channel>b.channel) return -1;
        return 0;})[0].channel

    const selector = <select className='form-select' size={3} value={state.channel}
        onChange={(e:any)=>{dispatch({type: 'setChannel', channel: Number(e.target.value)})}}>
        {(()=> {
            const ch: JSX.Element[] = []
            for (let i = 0; i <= ch_max; i++) {
                const found = state.noteData.filter(n=>n.channel===i)
                ch.push(<option key={i} value={i}>Track: {i} ({found.length} notes)</option>)
            }
            return ch
        })()}
    </select>

    return <div className='mb-2'>
        <span>{selector}</span>
    </div>
}