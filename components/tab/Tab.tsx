import React, { useState, useMemo, memo, useEffect, useContext } from 'react'
import { convertData } from './Lib' 
import Graph from './Graph/Graph'
import { DebugNote } from './type'
import { StateContext, DispatchContext } from '../../pages'

const Tab = () => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    useEffect(() => { dispatch({ type:'setNoteDataArray', noteDataArray: convertData(state.noteData, 240, state.channel) })
    },[state.channel])

    const generate = () => {
        const startTime = performance.now()
        
        const endTime = performance.now()
        const t = endTime - startTime

        // 終了
        dispatch({type: 'setGenerateFlag', generateFlag: false})
    }           

    return <Graph />
}

export default memo(Tab)