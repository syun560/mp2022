import React, { useEffect, useState, useCallback } from 'react'
import fingerboard from './fingerboard.png'
import { Finger } from '../tab/type'

interface Props {
    fingering: Finger
}


export default function FingeringTable(props: Props){
    const fret = [1,2,3,4,5,6]
    const form = [...props.fingering.form].reverse()
    const finger = [...props.fingering.finger].reverse()
    const td = {
        // backgroundImage: 'url(' + fingerboard.src + ')',
        // backgroundSize: 'contain',
        // backgroundRepeat: 'no-repeat',
        padding: '0px',
        textAlign: 'center' as const,
        width: '30px',
        height: '1.5em'
    }

    const record = form.map(
        (f,i)=><tr key={i}>
            {fret.map(fr=> fr === f ?
                <td style={td} key={fr} className='table-danger'>{finger[i]}</td>
            :
                <td style={td} key={fr} className=''></td>
            )}
        </tr>
    )

    return <table className='table table-bordered'>
        <tbody>
            {record}
        </tbody>
    </table>
}
