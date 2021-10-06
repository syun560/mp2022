import React, { useState } from 'react'

interface Props {
    setTuning: any
}

const Tuning = (props: Props) => {
    const input = {
        width: '40px'
    }

    const [tune, setTune] = useState<number[]>([0,0,0,0,0,0])
    const [capo, setCapo] = useState<number>(0)
    
    // レギュラーチューニング
    const regularTuning = [40, 45, 50, 55, 59, 64]

    // レギュラーチューニングにチューニングを反映させる
    const changeTuning = (e:React.ChangeEvent<HTMLInputElement>, i:number):void => {
        const new_tune = tune.map((value:number, index:number)=> {
            if (index===i) return Number(e.target.value)
            else return value
        })
        setTune(new_tune)

        props.setTuning(regularTuning.map((value, index) => capo + value + new_tune[index]))
    }

    const changeCapo = (e:any) => {
        const new_capo = Number(e.target.value)
        setCapo(new_capo)
        props.setTuning(regularTuning.map((value, index) => new_capo + value + tune[index]))
    }

    const tuning_option = <>
        {tune.map((x:number, i:number)=>
            <input style={input} type="number" key={i} min={-12} max={12} value={x} onChange={(e)=>changeTuning(e,i)} />
        )}
    </>

    return <div>
        <p>
            <span className='me-2'>Capo: <input style={input} type="number" value={capo} min={-2} max={12} onChange={(e)=>{changeCapo(e)}} /></span>
            <span className='me-2'>Tuning: {tuning_option}</span>
        </p>
    </div>
}

export default Tuning