import React, { useContext } from 'react'

import { NoteDatum, TimeSignature } from '../../type'
import { StateContext, DispatchContext } from '../../../../pages'

interface Props {
    selected: boolean
    note: number
    tick: number
    timeSignatures: TimeSignature[]
}

export default function PianoRollCell(props: Props) {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    // スタイルを追加
    let td = { 
        minWidth: '50px',
        width: '50px',
        height: '30px',
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
    if (props.note % 12 === 0) td = {...td, borderBottom: '1px black solid'}

    // width200%ではみ出せる
    let cell = {
        // width: '200%',
        width: '100%',
        height: '100%', // これを指定しないと空Divのときにwidthが効かない
        fontSize: '1px',
        background: '',
    }

    if (props.selected) cell = { ...cell, background: 'orange' }

    const doClick = () => {
        //alert("うんち")
        // 今クリックした場所の情報を表示する
    
        // notedataを登録する。
        const tmpNote:NoteDatum = {
            channel: state.channel,
            note: props.note,
            time: 240*props.tick,
            duration: 240
        }


        dispatch({type: 'addNoteData', note: tmpNote })
    }

    // tick4つごとに区切り線を追加
    // 拍子はa/bで表される
    //let a = props.timeSignatures[0].timeSignature[0]
    //let b = props.timeSignatures[0].timeSignature[1]

    //if (a === 3) a *= 2

    if (props.tick % 4 === 0) td = { ...td, borderLeft: '1px solid #e7e7e7' }
    if (props.tick % 8 === 0) td = { ...td, borderLeft: '1px solid #111' }

    return <td style={td} onClick={doClick}>
        <div style={cell}></div>
    </td>
}