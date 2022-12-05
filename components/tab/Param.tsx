import React, { useContext } from 'react'
import { StateContext, DispatchContext } from '../../pages'

// 入力パラメータ
const Param = () => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    const oc = (e: any) => {
        dispatch({type: 'setTempo', tempo: Number(e.target.value) })
    }
    const style = {
        width: "100%"
    }

    return <div>
        <label className='my-3'>Tempo: <strong>{state.tempo}</strong></label>
        <input type="range" name="speed" min="10" max="120" step="1" value={state.tempo} onChange={oc} style={style} />

        <select className="form-select" aria-label="Default select example">
            <option selected>Open this select menu</option>
            <option value="1">C major</option>
            <option value="2">D major</option>
            <option value="3">A minor</option>
        </select>
    </div>
}

export default Param