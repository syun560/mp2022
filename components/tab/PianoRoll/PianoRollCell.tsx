import React, { useState } from 'react'

interface Props {
    selected: boolean
    note: number
}

export default function PianoRollCell(props: Props) {
    // スタイルを追加
    let td = { 
        width: '50px',
        height: '8px',
        padding: '0px',
        background: '',
        borderBottom: '0px black solid',
        overflow: 'visible'
    }
    if (props.selected) td = { ...td, background: 'cyan' }
    if (props.note % 12 === 0) td = {...td, borderBottom: '1px black solid'}

    // ネガティブマージン（はみ出すマージン）のテスト
    const test = {
        marginRight: '20px',
        marginTop: '-10px' 
    }

    // Cメジャー・スケール
    const c_major = [0,2,4,5,7,9,11]

    // tick4つごとに区切り線を追加
    // if (tick % 4 == 0){
    //     td = {
    //         ...td,
    //         borderLeft: '2px solid #e7e7e7'
    //     }
    // }

    return <td style={td} className={c_major.includes(props.note % 12) ? '': 'table-secondary'}>
        <div style={test}></div>
    </td>
}