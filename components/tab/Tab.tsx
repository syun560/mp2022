import React, { useState, useMemo, memo, useEffect, useContext } from 'react'
import { regularTuning, createFingerForms, fingerMoveCost, convertData } from './Lib' 
import Graph from './Graph/Graph'
import { DebugNote } from './type'
import { StateContext, DispatchContext } from '../../pages'
import { generateTab } from './generateTab'

const Tab = () => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    // コスト情報をあらかじめ保存しておく（1回だけ）
    const fingers = useMemo(createFingerForms, []) // 動的に生成したフォームを取得する
    const mCosts = useMemo(()=>fingerMoveCost(fingers), []) // フォーム移動コストのテーブルを取得する

    // カポ、変則チューニングによる音階を決定する
    const tune = regularTuning.map((value, i)=> state.capo + value + state.tuning[i])

    // デバッグ表示用変数
    const [dn, setDn] = useState<DebugNote[]>([])

    useEffect(() => { generate() },[state.generateFlag])
    useEffect(() => { dispatch({ type:'setNoteDataArray', noteDataArray: convertData(state.noteData, 240, state.channel) })
    },[state.channel])

    const generate = () => {
        const startTime = performance.now()

        // 計算を実行
        const {capo, tuning, tabData, debugNotes} = generateTab(state.noteDataArray, state.w, fingers, mCosts, state.capo, state.capoFixedFlag, state.tuning, state.tuneFixedFlag)
        
        const endTime = performance.now()
        const t = endTime - startTime

        // 計算結果のセット
        dispatch({ type: 'setCapo', capo: capo })
        dispatch({ type: 'setTuning', tuning: tuning })
        dispatch({ type: 'setTabData', tabData: tabData })
        setDn(debugNotes)

        // デバッグ情報
        let recall = 0
        let score = 0

        debugNotes.forEach(d=>{
            recall += d.recall
            score += d.score
        })
        recall /= debugNotes.length
        score /= debugNotes.length    
        
        dispatch({
            type:'setDebugInfo', 
            recall: recall,
            generateTime: t,
            score: score
        })

        // 終了
        dispatch({type: 'setGenerateFlag', generateFlag: false})
    }           

    return <div>
        <Graph 
            tuning={tune}
            fingers={fingers}
            debugNotes={dn}
        />
    </div>
}

export default memo(Tab)