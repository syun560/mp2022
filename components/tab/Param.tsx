import React from 'react'

const Param = (props: any) => {
    const oc = (e: any) => {
        props.setW(e.target.value * 1.0)
    }
    const style = {
        width: "500px"
    }

    return <div>
        <label className='my-3'>Difficulty: <strong>({props.w})</strong>&nbsp;</label>
        <input type="range" name="speed" min="0" max="1" step="0.02" value={props.w} onChange={oc} style={style} />
    </div>
}

export default Param