import React, { useCallback, createRef, useEffect } from 'react'
import PianoRollCell from './PianoRollCell'
import { NoteDatum } from '../type'

interface Props {
    noteData: NoteDatum[]
    channel: number
    setChannel: any
}

export default function PianoRoll (props: Props){
    // ピアノロールを最適な箇所に自動でスクロールする
    const ref = createRef<HTMLTableCellElement>()
    const scrollToCenter = useCallback(() => {
        console.log('scrolled!')
        ref?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
    }, [ref])

    // スクロールするNote
    const baseNote = 60

    useEffect(()=>{
        scrollToCenter()
    }, [props.noteData])

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
        return nd.note === note && nd.time === tick/reso && nd.channel === props.channel
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

    return <div>
        Ch: {selector}
        <div style={box}>
            <table className="table table-bordered table-sm"><tbody>
                {roll}
            </tbody></table>
        </div>
    </div>
}