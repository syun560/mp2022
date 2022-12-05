import React, { useContext, useRef, createRef, useState, useEffect } from 'react'
import { SequencerContext, StateContext } from '../../../pages'

interface Props {
    tickLength: number
}

export function Conductor (props: Props){
    const {seqState, seqDispatch} = useContext(SequencerContext)
    const state = useContext(StateContext)

    // ピアノロールを最適な箇所に自動でスクロールする
    // refをtickLengthぶん作ってみる
    const refs = useRef<React.RefObject<HTMLTableCellElement>[]>([])
    for (let i = 0; i < props.tickLength; i++) {
        refs.current[i] = (createRef<HTMLTableCellElement>())
    }
    const scrollToCenter = (i: number) => {
        // console.log(refs.current[i])
        // if (refs.current[i])console.log('scrolled!')
        if (i < props.tickLength)
            refs.current[i].current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            })
    }
    const doClick = (tick: number) => {
        seqDispatch({type: 'setNowTick', nowTick: tick})
    }
    
    // いい感じのところでスクロールする。
    useEffect(()=> {
        if (seqState.nowTick % 20 === 0 && seqState.isPlaying) scrollToCenter(seqState.nowTick + 10)
    }, [seqState.nowTick, seqState.isPlaying])
    
    let a = state.timeSignatures[0].timeSignature[0] * 2
    if (a === 6) a *= 2
    
    const tdStyle = (tick: number) => {
        let res = {
            padding: 0,
            fontSize: '1em',
            borderBottom: '1px solid black',
            borderLeft: ''
        }
        if (tick % a === 0) res = { ...res, borderLeft: '1px solid black' }
        return res
    }

    const cells = (()=> {
        const res: JSX.Element[] = []
        for (let tick = 0; tick <= props.tickLength; tick++) {
            res.push(
                <td key={tick} style={tdStyle(tick)} ref={refs.current[tick]}
                    className={seqState.nowTick - 1 === tick ? 'table-danger' : ''}
                    onClick={()=>doClick(tick)} >
                    {tick % a === 0 ? tick / a : ''}
                </td>
            )
        }
        return res
    })()

    return <tr>
        <th style={tdStyle(1)} className={seqState.nowTick === 0 ? 'table-danger' : ''}></th>
        {cells}
    </tr>
}