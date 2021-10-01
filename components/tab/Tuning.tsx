import React, { useState } from 'react'

const Tuning = (props:any) => {
    const [tune, setTune] = useState<number[]>([0,0,0,0,0,0])
    const [capo, setCapo] = useState<number>(0)
    
    const regularTuning = [40, 45, 50, 55, 59, 64]

    const changeTuning = (e:React.ChangeEvent<HTMLInputElement>, i:number):void => {
        const new_tune = tune.map((value:number, index:number)=> {
            if (index===i) return Number(e.target.value)
            else return value
        })
        setTune(new_tune)
        // console.log(tune)

        props.setTuning(regularTuning.map((value, index) => value + new_tune[index]))
    }

    const tuning_option = <>
        {tune.map((x:number, i:number)=>
            <input type="number" key={i} size={5} min={-12} max={12} value={x} onChange={(e)=>changeTuning(e,i)} />
        )}
    </>

    return <div>
        <p>
            {/* Capo: <input type="number" value={capo} min={0} max={12} onChange={(e)=>{setCapo(Number(e.target.value))}} /> */}
            Tuning: {tuning_option}
        </p>
    </div>
}

export default Tuning