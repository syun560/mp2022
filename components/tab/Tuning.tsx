import React, { useState } from 'react'

interface Props {
    capo: number
    setCapo: any
    tuning: number[]
    setTuning: any
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
            <input style={input} type="number" key={i} min={-12} max={12} value={x} onChange={(e)=>changeTuning(e,i)} />
        )}
    </>

    return <div>
        <p>
            <span className='me-2'>Capo: <input style={input} type="number" value={props.capo} min={-2} max={12} onChange={(e)=>{changeCapo(e)}} /></span>
            <span className='me-2'>Tuning: {tuning_option}</span>
        </p>
    </div>
}

export default Tuning