import React, { memo, useContext, useState } from 'react'
import { Finger } from '../type'
import PianoRoll from './PianoRoll/PianoRoll'
import { DebugNote } from '../type'
import { Conductor } from './Conductor'
import { StateContext, DispatchContext } from '../../../pages'


const Graph = () => {
    const state = useContext(StateContext)

    const div = {
        overflow: 'auto'
    }
    const table = {
        fontSize: '10pt',
    }
   

    return <div style={div} className='bar'>
        <table style={table} className='table table-borderless'>
        <tbody>

		    <PianoRoll />
            <Conductor tickLength={state.noteDataArray.length} />

        </tbody>
    </table>
    </div>
}

export default memo(Graph)