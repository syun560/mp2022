import React, { useState } from 'react'

interface Props {
    selected: boolean
}

export default function PianoRollCell(props: Props) {
    // スタイルを追加
    let td = { 
        width: '50px',
        height: '8px',
        padding: '0px',
        background: '',
        overflow: 'visible'
    }
    if (props.selected) {
        td = {
            ...td,
            background: 'cyan'
        }
    }

    // tick4つごとに区切り線を追加
    // if (tick % 4 == 0){
    //     td = {
    //         ...td,
    //         borderLeft: '2px solid #e7e7e7'
    //     }
    // }

    return <td style={td}></td>
}