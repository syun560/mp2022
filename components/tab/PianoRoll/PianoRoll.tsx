import React, { useCallback, createRef, useEffect, memo } from 'react'
import PianoRollCell from './PianoRollCell'
import { NoteDatum } from '../type'
import { noteNumberToNoteName, getMinMaxNote } from '../Lib'

interface Props {
    noteData: NoteDatum[]
    channel: number
    setChannel: any
}

const PianoRoll = memo((props: Props) => {
    console.log('PianoRoll')

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
    }, [props.noteData])

    const th = {
        padding: '0px',
        borderRight: '4px black solid',
        position: 'sticky' as const,
        left: 0
    }
    const note_name_style = {
        fontSize: '0.5em',
        marginBottom: '-4px',
        marginTop: '-4px',
        hegiht: '8px',
        width: '20px',
    }

    // 現在のチャンネルのnoteDataを取得
    const noteData = props.noteData.filter(f=>f.channel===props.channel)
    
    // 最小値と最大値
    const [minNote, maxNote] = getMinMaxNote(noteData)

    // tickの最大値

    // ダミーの数値（Reactのkeyのため必要？）
    const notes:number[] = []
    for (let i = 127; i >= 0; i--) notes.push(i)
    const ticks:number[] = []
    for (let i = 0; i < 128; i++) ticks.push(i)

    // ピアノロールに表示するデータの設定
    const cleanData = (nd :NoteDatum, note: number, tick: number):boolean => {
        const reso = 240
        return nd.note === note && nd.time === tick * reso
    }

    // ピアノロール生成
    const roll = notes.map((fuga, indexRow) => {
        const note = 127 - indexRow
        if (note < minNote || note > maxNote) return
        else return (
            <tr key={fuga}>
                {/* 音階 */}
                <th style={th} ref={note === baseNote ? ref : null}>
                    <div style={note_name_style}>
                        {note % 12 === 0 ? noteNumberToNoteName(note) : ''}
                    </div>
                </th>

                {ticks.map((tick, indexCol) => (
                    <PianoRollCell key={tick} selected={noteData.some((nd)=>cleanData(nd, note, tick))} />
                ))}
            </tr>
        )
    })

    // チャンネルセレクタ
    // 最後のノートのチャンネルをトラック数とする
    const ch_max = noteData[noteData.length - 1].channel
    const selector = <select value={props.channel} onChange={(e:any)=>{props.setChannel(Number(e.target.value))}}>
        {(()=> {
            const ch: JSX.Element[] = []
            for (let i = 0; i <= ch_max; i++) {
                ch.push(<option key={i}>{i}</option>)
            }
            return ch
        })()}
    </select>

    // return <div>
    //     <span className='me-2'>Track: {selector}</span>
    //     <div style={box}>
    //         <table className="table table-bordered table-sm"><tbody>
    //             {roll}
    //         </tbody></table>
    //     </div>
    // </div>
    return <>{roll}</>
})

export default PianoRoll