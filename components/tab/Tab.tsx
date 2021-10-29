import React, { useState, useEffect } from 'react'
import { createFingerForms, fingerMoveCost } from './Lib' 
import Graph from './Graph'
import { NoteDatum, DebugNote } from './type'

interface Props {
    channel: number
    noteData: NoteDatum[]    
    w: number

    capo: number
    setCapo: any
    capoFixedFlag: boolean
    
    tuning: number[]
    setTuning: any
    tuneFixedFlag: boolean

    generateFlag: boolean
    setGenerateFlag: any

    setDebugText: any
}

// 入力MIDIデータを2次元配列の形に変換する
const convertData = (nd: NoteDatum[], reso:number, channel: number):number[][] => {
    const res:number[][] = []

    // 指定されたチャンネルのNotesを取り出す
    const found = nd.filter(n=>n.channel===channel)

    // もし無かったらそのままリターン
    if (found.length < 1) return res

    const end = found[found.length - 1].time

    for (let i = 0; i <= end; i += reso) {
        res.push(found.filter(n=>n.time === i).map(x=>x.note))
    }
    return res
}

const getNoteLength = (noteData: number[][]) => {
    let length = 0
    noteData.forEach(n => {
        length += n.length
    })
    return length
}

const Tab = (props: Props) => {
    console.log('Tab components')
    const noteDataArray = convertData(props.noteData, 240, props.channel)
    const noteLength = getNoteLength(noteDataArray)
    
    const fingers = createFingerForms() // 動的に生成したフォームを取得する
    const mCosts = fingerMoveCost(fingers) // フォーム移動コストのテーブルを取得する

    // 2次元Tabデータ
    const [tabData, setTabData] = useState<number[][]>([])
    let tmpTabData:number[][] = []

    // カポ、変則チューニングによる音階を決定する
    const regularTuning = [40, 45, 50, 55, 59, 64]
    const tune = regularTuning.map((value, i)=> props.capo + value + props.tuning[i])

    // デバッグ
    const [debugNotes, setDebugNotes] = useState<DebugNote[]>([])
    const [exectime, setExecTime] = useState('') // 実行時間
    const [hitCount, setHitCount] = useState(0) // ヒットカウント

    useEffect(() => {
        generateTab()
    },[props.generateFlag])
    
    // カポ、変則調弦のイテレーションのための変数
    const capo_itr = [0,1,2,3,4,5,6,7,8,9,10,11,12]
    const tune_itr = [
        [0,0,0,0,0,0],
        [-1,0,0,0,0,0],
        [0,-1,0,0,0,0],
        [0,0,-1,0,0,0],
        [0,0,0,-1,0,0],
        [0,0,0,0,-1,0],
        [0,0,0,0,0,-1],
        [-2,0,0,0,0,0],
        [0,-2,0,0,0,0],
        [0,0,-2,0,0,0],
        [0,0,0,-2,0,0],
        [0,0,0,0,-2,0],
        [0,0,0,0,0,-2],
        [0,0,2,0,0,0]
    ]

    const generateTab = () => {
        const startTime = performance.now()

        // 各調弦によるスコアを比較するための変数
        let maxScore = 0

        // 変則調弦、カポによるイテレーション（12(変則調弦)*12(カポ)=144くらい？）
        tune_itr.forEach(anno_tune=>{
        capo_itr.forEach(capo=>{
            if (props.capoFixedFlag && capo !== props.capo) return
            if (props.tuneFixedFlag && JSON.stringify(anno_tune) !== JSON.stringify(props.tuning)) return

            // 利用可能な音高列を現在のチューニングとフォームから計算する（わかりずらいのでここで計算しなくても良い？）
            const formNotes: number[][] = []
            fingers.forEach(finger => {
                formNotes.push(
                    finger.form.map((n, index) => {
                        if (n === -1) return -1 // -1のときは使えない
                        return n + regularTuning[index] + capo + anno_tune[index]
                    })
                )
            })

            tmpTabData = []

            // スコア（グラフ）表示用変数
            const tmpDebugNotes: DebugNote[] = []

            let hit_cnt = 0
            let tmpScore = 0

            // 前のフォームを覚えておく変数
            let prevFormIndex = 0

            
            // 入力音高列をイテレーションする(100itr)
            noteDataArray.forEach((nd:number[]) => {            
                
                let point_max: number = 0.0
                let form_number: number = -1
                let finger: number[] = [0, 0, 0, 0, 0, 0]// コードから押さえない音を抜かした押さえ方を作る（便宜的に）
                let tmpDebugNote: DebugNote = {
                    correctForm: 0,
                    score: 1.0,
                    recall: 1.0,
                    cp: 0,
                    cc: 0,
                    cost: 1.0,
                }

                // 配列が0のときはスキップする
                if (nd.length > 0) {
                    // 利用可能なフォーム（音高列）のイテレーション (100itr)
                    formNotes.forEach((fn:number[], formIndex:number) => {

                        let tmp_finger = [0, 0, 0, 0, 0, 0] // フィンガリング（ならす:1 ならさない:0）
                        // 鳴らす音の数
                        let ring_cnt = 0
                        
                        // 利用可能なフォーム（音後列）の弦ごとのイテレーション（6iter）
                        fn.forEach((nn:number, strIndex:number) => {
                            // 利用可能な音高列で表現できる音があればカウント(1~6iter)
                            nd.forEach(dd => {
                                if (dd === nn) { // 同じ音の場合音を鳴らす
                                    tmp_finger[strIndex] = 1 // そのフォームで鳴らすべき弦を1とする（それ以外はゼロ）
                                    ring_cnt++
                                }
                            })
                        })
                        
                        let recall = ring_cnt / nd.length　// 再現度（鳴らす音の数/元の音の数）
                        if (recall > 1.0) recall = 1.0 // 暫定的な処置（できれば重複して数えないようにしたい。）
                        const cp = fingers[formIndex].cost　// 押弦コスト
                        let cc = 0
                        if(mCosts.length>0 && prevFormIndex !== -1) cc = mCosts[prevFormIndex][formIndex] // フォーム変更コスト
                        const easiness = 1.0 / (1.0 + cp + cc)　// 難易度（大きいほど簡単）
                        
                        // ポイント（高いほどより適している）
                        const point = props.w*recall + (1.0-props.w)* easiness

                        // ポイントが高いものを選択する（配列にまとめてからMath関数を使えばいいかも）
                        if (point > point_max) {
                            point_max = point
                            tmpDebugNote = {
                                score: point,
                                correctForm: formIndex,
                                recall,
                                cp,
                                cc,
                                cost: easiness
                            }
                            finger = tmp_finger // 実際に押さえる指の配列
                            form_number = formIndex
                        }
                    })
                }
                
                // -------フォーム確定-------------

                // 再現できていれば
                if (form_number !== -1) {
                    // ヒットカウントを追加
                    hit_cnt += finger.filter(f=>f>0).length
                }
                
                // 正しいフォームを記録する
                tmpDebugNotes.push(tmpDebugNote)
                tmpScore += point_max
                prevFormIndex = form_number

                // 用意したフォームで再現可能な音高であれば、tabDataに追加
                const fingering: number[] = finger.map((f, index) => {
                    if (f !== 0 && form_number !== -1) return fingers[form_number].form[index]
                    else return -1
                })

                tmpTabData.push(fingering)
            })

            // -------タブデータ完成----------
            // 各チューニングで、一番スコアが高いカポに決定する
            if (tmpScore > maxScore) {
                console.log('capo:' + capo)
                console.log('score' + tmpScore)
                maxScore = tmpScore
                props.setCapo(capo)
                props.setTuning(anno_tune)
                setTabData(tmpTabData)

                // デバッグ表示用変数
                setDebugNotes(tmpDebugNotes)

                setHitCount(hit_cnt)
            }
        })
        })
        
        // 実行時間計測
        const endTime = performance.now()
        const t = (endTime - startTime).toFixed(2) + ' ms'
        setExecTime(t)
        
        // デバッグ情報
        let recall = 0
        let score = 0
        // ここ違うかも
        debugNotes.forEach(d=>{
            recall += d.recall
            score += d.score
        })
        recall /= debugNotes.length
        score /= debugNotes.length    
        
        const debugInfo = <p>
            Recall: {recall.toFixed(2)}<br/>
            Score: {score.toFixed(2)}<br/>
            Time: { exectime + ' (' + noteLength + ' notes, ' + fingers.length + ' fingers)' }
        </p>
        props.setDebugText(debugInfo)
        
        // 終了
        props.setGenerateFlag(false)
    }


    return <div>
        <div>
            <Graph 
                tabData={tabData}
                tuning={tune}
                noteData={props.noteData} noteDataArray={noteDataArray}
                fingers={fingers}
                debugNotes={debugNotes}
                channel={props.channel}
                />
            {/* <ASCIITab tabData={tabData} tuning={tune} /> */}
        </div>
    </div>
}

export default Tab