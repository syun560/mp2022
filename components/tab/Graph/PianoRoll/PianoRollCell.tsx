import React from 'react'
import { TimeSignature } from '../../type'

interface Props {
    selected: boolean
    tabSelected: boolean
    note: number
    tick: number
    timeSignatures: TimeSignature[]
}

export default function PianoRollCell(props: Props) {
    // スタイルを追加
    let td = { 
        width: '50px',
        height: '8px',
        padding: '0px',
        background: '',
        borderBottom: '0px black solid',
        borderLeft: '',
        overflow: 'visible'
    }

    // Cメジャー・スケール
    const c_major = [0,2,4,5,7,9,11]

    // アボイドノートは色を変える
    if (!c_major.includes(props.note % 12)) {
        td = { ...td, background: '#e8faff'}
    }

    // ノートに色を付ける
    if (props.selected) td = { ...td, background: 'orange' }
    if (props.tabSelected) td = {...td, background: 'cyan' }
    if (props.note % 12 === 0) td = {...td, borderBottom: '1px black solid'}

    // ネガティブマージン（はみ出すマージン）のテスト
    const test = {
        marginRight: '20px',
        marginTop: '-10px' 
    }

    // tick4つごとに区切り線を追加
    if (props.tick % 2 === 0) td = { ...td, borderLeft: '1px solid #e7e7e7' }
    if (props.tick % 8 === 0) td = { ...td, borderLeft: '1px solid #111' }

    return <td style={td}>
        <div style={test}></div>
    </td>
}