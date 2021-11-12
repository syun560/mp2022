import React, { useContext } from 'react'
import { StateContext, DispatchContext } from '../../pages'

const Tuning = () => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    const input = {
        width: '40px'
    }
    
    // レギュラーチューニングにチューニングを反映させる
    const changeTuning = (e:React.ChangeEvent<HTMLInputElement>, i:number):void => {
        const new_tune = state.tuning.map((value:number, index:number)=> {
            if (index===i) return Number(e.target.value)
            else return value
        })
        dispatch({type: 'setTuning', tuning: new_tune})
    }

    const changeCapo = (e:any) => {
        dispatch({type: 'setCapo', capo: Number(e.target.value)})   
    }

    const tuning_option = <>
        {state.tuning.map((x:number, i:number)=>
            <input style={input} type="number" key={i} min={-2} max={2} value={x} onChange={(e)=>changeTuning(e,i)} />
        )}
    </>

    return <div>
        <p>
            <input className='form-check-input' type="checkbox" checked={state.capoFixedFlag}
                onChange={(e)=>{
                    dispatch({ type: 'setCapoFixedFlag', capoFixedFlag: e.target.checked })
                }}/>
            <label className='mx-2'>Capo:</label> 
            <input style={input} type="number" value={state.capo} min={-2} max={12} onChange={(e)=>{changeCapo(e)}} />
        </p>
        <p>
            <input className='form-check-input' type="checkbox" checked={state.tuneFixedFlag}
                onChange={(e)=>dispatch({ type: 'setTuneFixedFlag', tuneFixedFlag: e.target.checked })}/>
            <label className='mx-2'>Tuning:</label>
            {tuning_option}
        </p>
    </div>
}

export default Tuning