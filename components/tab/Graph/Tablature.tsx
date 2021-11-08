import React, { useContext } from 'react'
import { noteNumberToNoteName } from '../Lib' 
import fingerboard from './fingerboard2.png'
import { TimeSignature } from '../type'
import { StateContext, DispatchContext } from '../../../pages'

type Props = {
    tuning: number[]
}

export default function Tablature(props: Props) {
    console.log('Tablature')
    
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    const fixedRow = {
        position: 'sticky' as const,
        left: 0,
        fontSize: '0.8em',
        marginBottom: '-4px',
        marginTop: '-4px',
    }
    
    // 1拍ごとの線
    const beatBar = {
        borderRight: '1px solid black'
    }
    const tdStyle = (tick: number) => {
        // タブ譜の背景（弦の画像を表示する）
        let res = {
            backgroundImage: 'url(' + fingerboard.src + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '0px',
            textAlign: 'center' as const,
            fontSize: '16pt',
            marginBottom: '-4px',
            marginTop: '-4px',
        
            borderLeft: ''
        }
        if (tick %8 === 0) res = { ...res, borderLeft: '1px solid black' }
        return res
    }
    const spanStyle = {
        backgroundColor: 'white'
    }
    
    // タブ譜を同時に表示する
    const tab = <>{[5,4,3,2,1,0].map(s=><tr key={s}>
        <th style={fixedRow} className='table-secondary'>{noteNumberToNoteName(props.tuning[s])}</th>
        {state.tabData.map((t, i)=><td key={i} style={tdStyle(i)}>
            <span style={spanStyle}>
                {t[s]!==-1 ? t[s]: ''}
            </span>
        </td>)}
    </tr>)}</>

    return tab
}
