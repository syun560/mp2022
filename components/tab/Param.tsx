import React, { useContext } from 'react'
import { StateContext, DispatchContext } from '../../pages'

const Param = () => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    const oc = (e: any) => {
        dispatch({type: 'setW', w: Number(e.target.value) })
    }
    const style = {
        width: "100%"
    }

    return <div>
        <label className='my-3'>Difficulty: <strong>({state.w})</strong>&nbsp;</label>
        <input type="range" name="speed" min="0" max="1" step="0.02" value={state.w} onChange={oc} style={style} />
    </div>
}

export default Param