import React, { memo } from 'react'
import { Finger } from './type'
import { noteNumberToNoteName } from './Lib' 
import PianoRoll from './PianoRoll/PianoRoll'
import { NoteDatum } from './type'

interface Props {
    tabData: number[][]
    tuning: number[]
    noteDataArray :number[][]
    fingers: Finger[]
    
    // デバッグ情報表示のため
    correctForms: number[]
    points: number[][]

    // ピアノロール表示のため
    noteData: NoteDatum[]
    channel: number
}

export const Graph = memo((props: Props) => {
    console.log('Graph')
    // console.log(props.tabData)

    const chord = ['F', 'G', 'C']
    const div = {
        overflow: 'auto'
    }
    const table = {
        fontSize: '10pt',
    }
    const fixedRow = {
        position: 'sticky' as const,
        left: 0
    }

    // 運指を表示する
    const correctForm = <tr>
        <th style={fixedRow}>Fingering</th>
        {props.correctForms.map((d,i)=>{
            if(d === -1) return <td key={i}></td>
            const name = props.fingers[d].name
            return <td key={i}>
                {name !== 'None' ? name : ''}
            </td>
            }
        )}            
    </tr>

    // タブ譜を同時に表示する
    const tab = <>{[5,4,3,2,1,0].map(s=><tr className='table-warning' key={s}>
        <th style={fixedRow}>{noteNumberToNoteName(props.tuning[s])}</th>
        {props.tabData.map(t=><td>{t[s]!==-1 ? t[s]: ''}</td>)}
    </tr>)}</>

    // 音ごとの再現率を表示する
    const recall = <tr className='table-secondary'>
        <th style={fixedRow}>recall</th>
        {props.noteDataArray.map((n, i)=>{
            const r = props.tabData[i]?.filter(t=>t>-1).length / n.length
            return <td key={i} className={r < 1.0 ? 'table-danger' : ''}>
                {!Number.isNaN(r) ? r.toFixed(2) : ''}
            </td>
        })}
    </tr>

    const allTable = props.fingers.map((c, j)=><tr key={j}>
        <th>{c.name}</th>
        {props.points.map((d,i)=><td key={i} className={d[j] > 1.0 ? 'table-danger': ''}>{d[j]?.toFixed(1)}</td>)}            
    </tr>)

    return <div style={div} className='bar'>
        <table style={table} className='table table-bordered'>
        <tbody>
		    <PianoRoll noteData={props.noteData} noteDataArray={props.noteDataArray} channel={props.channel} />
            {correctForm}
            {tab}
            {recall}
        </tbody>
    </table>
    </div>
})

export default Graph