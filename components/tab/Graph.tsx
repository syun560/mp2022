import React, { useEffect, useState } from 'react'
import { Finger } from './type'

interface Props {
    originalData :number[][]
    forms: Finger[]
    points: number[][]
}

export default function Graph(props: Props) {

    const chord = ['F', 'G', 'C']
    const div = {
        overflow: 'auto'
    }
    const table = {
        fontSize: '10pt',
    }


    return <div style={div}>
        <table style={table} className='table table-bordered'>
        <thead>
            <tr>
                <th>#</th>
                {props.originalData.map((d,i)=><th key={i}>[{d.join()}]</th>)}
            </tr>
        </thead>
        <tbody>
            {props.forms.map((c, j)=><tr key={j}>
                <th>{c.name}</th>
                {props.points.map((d,i)=><td key={i} className={d[j] > 1.0 ? 'table-danger': ''}>{d[j]?.toFixed(1)}</td>)}            
            </tr>)}
        </tbody>
    </table>
    </div>
}
