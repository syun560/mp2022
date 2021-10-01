import React, { useEffect, useState, useCallback } from 'react'
import fingerboard from './fingerboard.png'

interface Props {
    fingering: number[]
}


export default function FingeringTable(props: Props){
    const fret = [1,2,3,4,5,6]
    const fingering = [...props.fingering].reverse()
    const td = {
        // backgroundImage: 'url(' + fingerboard.src + ')',
        // backgroundSize: 'contain',
        // backgroundRepeat: 'no-repeat',
    }

    const record = fingering.map(
        (f,i)=><tr key={i}>
            {fret.map(fr=><td style={td} key={fr} className={fr === f ? 'table-danger' :''}></td>)}
        </tr>
    )

    return <table className='table table-bordered'>
        <tbody>
            {record}
        </tbody>
    </table>
}
