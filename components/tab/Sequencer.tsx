import React, { useRef, useEffect, useState, useContext } from 'react'
import { StateContext, DispatchContext, SequencerContext } from '../../pages'

export default function Sequencer () {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)
    const {seqState, seqDispatch} = useContext(SequencerContext)

    const timer = useRef<any>()
    const delayTime = 60 * 1000 / (seqState.bpm * 2)

    // setTimeOutから正しくnowTickを参照するため
    const nowTickRef = useRef(seqState.nowTick)
    nowTickRef.current = seqState.nowTick
    const tickLengthRef = useRef(state.noteDataArray.length)
    tickLengthRef.current = state.noteDataArray.length

    // tickが進むごとに実行される関数
    const proceed = () => {
        if (nowTickRef.current < tickLengthRef.current) {
            play()
            seqDispatch({type: 'nextTick'})
            timer.current = setTimeout(proceed, delayTime )
        }
        else {
            seqDispatch({type: 'stop'})
            clearTimeout(timer.current)
        }
    }

    // タブノートを生成
    const regularTuning = [40, 45, 50, 55, 59, 64]
    const tune = regularTuning.map((value, i)=> state.capo + value + state.tuning[i])

    const play = () => {
        const nowTick = nowTickRef.current   
        // noteDataArrayを参照してピアノ音を鳴らす
        state.noteDataArray[nowTick].forEach(n=>{
            seqDispatch({type: 'NOTE_ON', note: n, channel: 0})
        })
    }
    const stop = () => {
        seqDispatch( {type: 'setIsPlaying', isPlaying: false })
        clearTimeout(timer.current)
    }
    const first = () => {
        seqDispatch({type: 'setNowTick',  nowTick: 0})
    }
    const playToggle = () => {
        if (seqState.isPlaying) {
            stop()
        }
        else {
            seqDispatch( {type: 'setIsPlaying', isPlaying: true })
            timer.current = setTimeout(proceed, delayTime)
        }
    }

    return <span>
        BPM: 
        <input type="number" value={seqState.bpm} min={10} max={300} onChange={(e)=>seqDispatch({type:'setBPM', bpm: Number(e.target.value)})}/>
        <button className="btn btn-secondary mx-1" onClick={first}>
        l＜
        </button>
        <button className="btn btn-primary me-1" onClick={playToggle}>
            {seqState.isPlaying ? 'II' : '▶' }
        </button>
    </span>
}