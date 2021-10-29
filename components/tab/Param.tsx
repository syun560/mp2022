import React from 'react'

interface Props {
    w: number
    setW: any
}

const Param = (props: Props) => {
    const oc = (e: any) => {
        props.setW(e.target.value * 1.0)
    }
    const style = {
        width: "100%"
    }

    return <div>
        <label className='my-3'>Difficulty: <strong>({props.w})</strong>&nbsp;</label>
        <input type="range" name="speed" min="0" max="1" step="0.02" value={props.w} onChange={oc} style={style} />
    </div>
}

export default Param