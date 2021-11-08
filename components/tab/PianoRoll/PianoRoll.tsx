import React, { useCallback, createRef, useEffect, memo, useContext } from 'react'
import PianoRollCell from './PianoRollCell'
import { NoteDatum, TimeSignature } from '../type'
import { noteNumberToNoteName, getMinMaxNote } from '../Lib'
import { StateContext, DispatchContext } from '../../../pages'

const PianoRoll = memo(() => {
    console.log('PianoRoll')

    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    // ピアノロールを最適な箇所に自動でスクロールする
    const ref = createRef<HTMLTableCellElement>()
    const scrollToCenter = useCallback(() => {
        console.log('scrolled!')
        ref?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
    }, [ref])

    // スクロールするNote（中心のノート）
    const baseNote = 60

    useEffect(()=>{
        scrollToCenter()
    }, [state.noteData])

    const th = {
        padding: '0px',
        borderRight: '1px black solid',
        position: 'sticky' as const,
        left: 0
    }
    const th_base = {
        ...th,
        borderBottom: '1px black solid'
    }
    const note_name_style = {
        fontSize: '0.5em',
        marginBottom: '-4px',
        marginTop: '-4px',
        hegiht: '8px',
        width: '20px',
    }

    // 現在のチャンネルのnoteDataを取得
    const noteData = state.noteData.filter(f=>f.channel===state.channel)
    
    // 最小値と最大値
    const [minNote, maxNote] = getMinMaxNote(noteData)

    // 分解能（できれば外からpropsで読み込みたい）
    const reso = 240

    // tickの最大値
    let tick_max = state.noteDataArray.length

    // ダミーの数値（Reactのkeyのため必要？）
    const notes:number[] = []
    for (let i = 127; i >= 0; i--) notes.push(i)
    const ticks:number[] = []
    for (let i = 0; i < tick_max; i++) ticks.push(i)

    // ピアノロールに表示するデータの設定
    const cleanData = (nd :NoteDatum, note: number, tick: number):boolean => {
        return nd.note === note && nd.time === tick * reso
    }

    const c_major = [0,2,4,5,7,9,11]

    // ピアノロール生成
    const roll = notes.map((fuga, indexRow) => {
        const note = 127 - indexRow
        if (note < minNote || note > maxNote) return
        else return (
            <tr key={fuga}>
                {/* 音階 */}
                <th style={note % 12 ? th : th_base} ref={note === baseNote ? ref : null} className={c_major.includes(note % 12) ? '': 'table-secondary'}>
                    <div style={note_name_style}>
                        {note % 12 === 0 || note === minNote || note === maxNote ? noteNumberToNoteName(note) : ''}
                    </div>
                </th>

                {ticks.map((tick, indexCol) => (
                    <PianoRollCell timeSignatures={state.timeSignatures} key={tick} note={note} tick={tick} selected={noteData.some((nd)=>cleanData(nd, note, tick))} />
                ))}
            </tr>
        )
    })
    return <>{roll}</>
})

export default PianoRoll