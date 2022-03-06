import React, { useContext } from 'react'
import { noteNumberToNoteName } from '../Lib' 
import fingerboard from './fingerboard2.png'
import { StateContext } from '../../../pages'

type Props = {
    tuning: number[]
}

export default function Tablature(props: Props) {
    const state = useContext(StateContext)

    let fixedRow = {
        position: 'sticky' as const,
        left: 0,
        fontSize: '0.8em',
        marginBottom: '-4px',
        marginTop: '-4px',
        background: ''
    }

    // 弦ごとに色を設定
    const stringColor = [
        '#f7bfff',
        '#c1bfff',
        '#a2f3f5',
        '#bfffd0',
        '#ecffbf',
        '#ffd5bf',
    ]
    const th = stringColor.map(s=>{
        return {
            ...fixedRow,
            background: s
        }
    })

    
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
        let a = state.timeSignatures[0].timeSignature[0] * 2
        if (a === 6) a *= 2
        if (tick % a === 0) res = { ...res, borderLeft: '1px solid black' }
        return res
    }
    const spanStyle = {
        backgroundColor: 'white'
    }
    
    // タブ譜を同時に表示する
    const tab = <>{[5,4,3,2,1,0].map(s=><tr key={s}>
        <th style={th[s]} className='table-secondary'>{noteNumberToNoteName(props.tuning[s])}</th>
        {state.tabData.map((t, i)=><td key={i} style={tdStyle(i)}>
            <span style={spanStyle}>
                {t[s]!==-1 ? t[s]: ''}
            </span>
        </td>)}
    </tr>)}</>

    return tab
}
