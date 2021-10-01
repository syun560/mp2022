import React, { useState, useCallback, createRef, useEffect } from 'react'
import PianoRollCell from './PianoRollCell'
import { NoteDatum } from '../type'
import { noteNumberToNoteName } from '../Lib'

interface Props {
    noteData: NoteDatum[]
}

export default function PianoRoll (props: Props){
    const ref = createRef<HTMLTableCellElement>()
    const scrollToCenter = useCallback(() => {
        ref?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
    }, [ref])
    const baseNote = 60

    useEffect(()=>{
        scrollToCenter()
    }, [])

    // div全体（スクロールできる）
    const box = {
        height: '250px',
        overflow: 'auto',
    }
    const th = {
        fontSize: '0.1em',
        hegiht: '8px',
        width: '20px',
        padding: '0px',
    }
    
    // ダミーの数値（Reactのkeyのため必要？）
    const notes:number[] = []
    for (let i = 127; i >= 0; i--) {
        notes.push(i)
    }
    const ticks:number[] = []
    for (let i = 1; i <= 32; i++) {
        ticks.push(i)
    }

    // ピアノロール用にデータクレンジング
    const cleanData = (nd :NoteDatum, note: number, tick: number):boolean => {
        const reso = 4
        return nd.note === note && nd.time === tick/reso
    }

    // ピアノロール生成
    const roll = notes.map((fuga, indexRow) => {
        const note = 127 - indexRow
        return (
            <tr key={fuga}>
                {/* 音階 */}
                <th style={th} ref={note === baseNote ? ref : null}>{/*note % 12 === 0 ? noteNumberToNoteName(note) + note/12: ''*/}</th>

                {ticks.map((tick, indexCol) => (
                    <PianoRollCell key={tick} selected={props.noteData.some((nd)=>cleanData(nd, note, tick))} />
                ))}
            </tr>
        )
    })

    return <div>
        <div style={box}>
            <table className="table table-bordered table-sm"><tbody>
                {roll}
            </tbody></table>
        </div>
    </div>
}