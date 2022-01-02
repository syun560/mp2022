import { DebugNote, Finger } from './type'
import { tunes, regularTuning } from './Lib'
import { solveShortestPath } from './solveShortestPath'

type Res = {
    capo: number,
    tuning: number[],
    tabData: number[][],
    debugNotes: DebugNote[],
}

export const generateTab = (
    noteDataArray: number[][],
    w: number,
    fingers: Finger[],
    mCosts: number[][],
    capo: number,
    capoFixedFlag: boolean,
    tuning: number[],
    tuneFixedFlag: boolean
) => {
    // 結果を返す
    let res: Res = {
        capo: 1,
        tuning: [0,0,0,0,0,0],
        tabData: [[1,1,1,1,1]],
        debugNotes: []
    }

    // 各調弦によるスコアを比較するための変数
    let maxScore = 0

    // カポ、変則調弦のイテレーションのための変数
    const capo_itr = [0,1,2,3,4,5,6,7,8,9,10,11,12]
    const tune_itr = tunes

    // 変則調弦、カポによるイテレーション（12(変則調弦)*12(カポ)=144くらい？）
    tune_itr.forEach(anno_tune=>{
    capo_itr.forEach(c=>{
        if (capoFixedFlag && capo !== c) return
        if (tuneFixedFlag && JSON.stringify(anno_tune) !== JSON.stringify(tuning)) return

        // 利用可能な音高列を現在のチューニングとフォームから計算しておく
        const formNotes: number[][] = []
        fingers.forEach(finger => {
            formNotes.push(
                finger.form.map((n, index) => {
                    if (n === -1) return -1 // -1のときは使えない
                    return n + regularTuning[index] + c + anno_tune[index]
                })
            )
        })
        
        // 最短経路を計算し、タブデータを求める
        const {score, tabData, debugNotes} = solveShortestPath(formNotes, noteDataArray, w, fingers, mCosts)

        console.log('capo:' + c + ' tuning:[' + anno_tune + '] score: ' + score.toFixed(1))

        // タブ譜を確定する
        if (score > maxScore) {
            maxScore = score
            res = {
                capo: c,
                tuning: anno_tune,
                tabData: tabData,
                debugNotes,
            }
        }
    })
    })

    console.log('generateTab!!!!!!!!!!!!')

    return res
}