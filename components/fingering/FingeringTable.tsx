import React, { useEffect, useState, useCallback } from 'react'
import fingerboard from './fingerboard.png'
import { Finger } from '../tab/type'

interface Props {
    fingering: Finger
}

export default function FingeringTable(props: Props){
    const fret = [1,2,3,4,5,6,7,8,9,10,11,12]
    const form = [...props.fingering.form].reverse()
    const finger = [...props.fingering.finger].reverse()
    const td = {
        backgroundImage: 'url(' + fingerboard.src + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '0px',
        textAlign: 'center' as const,
        width: '30px',
        height: '1.5em'
    }
    const first_td = {
        padding: '0px',
        borderRight: '4px black double',
        textAlign: 'center' as const,
        width: '10px',
        height: '1.5em'
    }
    const fret_number_td = {
        padding: '0px',
        textAlign: 'center' as const,
        height: '1.5em'
    }

    const finger_color = [
        'bg-secondary',
        'bg-danger',
        'bg-success',
        'bg-info',
        'bg-secondary',
    ]

    // 開始フレットを決める
    const start_fret = 0
    const fret_number = <tr style={fret_number_td}>
        <td></td>
        {fret.map(f=><td key={f}>{f}</td>)}
    </tr>

    const record = form.map(
        (f,i)=><tr key={i}>
            <td style={first_td}>{f === 0 ? '○' : f === -1 ? '✕' : ''}</td>
            {fret.map(fr=> 
                <td style={td} className='shadow-sm' key={fr}>{fr === f ? <span className={'badge rounded-pill ' + finger_color[finger[i]]}>{finger[i]}</span> : ''}</td>
            )}
        </tr>
    )

    return <table className='table table-borderless'>
        <tbody>
            {record}
            {fret_number}
        </tbody>
    </table>
}
