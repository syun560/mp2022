import React, { useState } from 'react'

interface Props {
    capo: number
    setCapo: any
    capoFixedFlag: boolean
    setCapoFixedFlag: any

    tuning: number[]
    setTuning: any
    tuneFixedFlag: boolean
    setTuneFixedFlag: any
}

const Tuning = (props: Props) => {
    const input = {
        width: '40px'
    }

    // レギュラーチューニングにチューニングを反映させる
    const changeTuning = (e:React.ChangeEvent<HTMLInputElement>, i:number):void => {
        const new_tune = props.tuning.map((value:number, index:number)=> {
            if (index===i) return Number(e.target.value)
            else return value
        })
        props.setTuning(new_tune)
    }

    const changeCapo = (e:any) => {
        const new_capo = Number(e.target.value)
        props.setCapo(new_capo)
    }

    const tuning_option = <>
        {props.tuning.map((x:number, i:number)=>
            <input style={input} type="number" key={i} min={-2} max={2} value={x} onChange={(e)=>changeTuning(e,i)} />
        )}
    </>

    return <div>
        <p>
            <input className='form-check-input' type="checkbox" checked={props.capoFixedFlag} onChange={(e)=>props.setCapoFixedFlag(e.target.checked)} />
            <label className='me-2'>Capo:</label> 
            <input style={input} type="number" value={props.capo} min={-2} max={12} onChange={(e)=>{changeCapo(e)}} />
        </p>
        <p>
            <input className='form-check-input' type="checkbox" checked={props.tuneFixedFlag} onChange={(e)=>props.setTuneFixedFlag(e.target.checked)}/>
            <label className='me-2'>Tuning:</label>
            {tuning_option}
        </p>
    </div>
}

export default Tuning