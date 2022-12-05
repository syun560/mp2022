import React, { memo, useContext } from 'react'
import PianoRoll from './PianoRoll/PianoRoll'
import { Conductor } from './Conductor'
import { StateContext } from '../../../pages'


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
                <Conductor tickLength={state.noteDataArray.length} />
	    	    <PianoRoll />

            </tbody>
        </table>
    </div>
}

export default memo(Graph)