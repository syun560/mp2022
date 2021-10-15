import React, { useState, useEffect } from 'react'
import { createFingerForms} from './Lib' 
import Graph from './Graph'
import { NoteDatum } from './type'
import ASCIITab from './ASCIITab'

interface Props {
    w: number
    noteData: NoteDatum[]
    tuning: number[]
    channel: number
}

// 入力MIDIデータを2次元配列の形に変換する
const convertData = (nd: NoteDatum[], reso:number, channel: number):number[][] => {
    const res:number[][] = []

    // 指定されたチャンネルのものを取り出す
    const found = nd.filter(n=>n.channel===channel)

    // もし無かったらそのままリターン
    if (found.length < 1) return res

    const end = found[found.length - 1].time
    // const end = 5

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
    // console.log(props.noteData)
    const noteData = convertData(props.noteData, 0.25, props.channel)
    const noteLength = getNoteLength(noteData)

    // グラフ表示用
    const fingers = createFingerForms() // 動的に生成したフォームを取得する
    const [points, setPoints] = useState<number[][]>([[2,2],[2,2]])
    const [correctForms, setCorrectForms] = useState<number[]>([])
    
    // デバッグ
    const [generate, setGenerate] = useState(true)
    const [exectime, setExecTime] = useState('')
    const [hitCount, setHitCount] = useState(0)
    
    // 2次元Tabデータ
    const [tabData, setTabData] = useState<number[][]>([])
    const tmpTabData:number[][] = []

    // 再現度、スコア
    const [score, setScore] = useState(0)
    const [recall, setRecall] = useState(0)

    useEffect(() => {
        generateTab()
    },[])

    const generateTab = () => {
        const startTime = performance.now()

        // 利用可能な音高列を現在のチューニングとフォームから計算する（わかりずらいのでここで計算しなくても良い？）
        const notes: number[][] = []
        fingers.forEach(finger => {
            notes.push(
                finger.form.map((n, index) => {
                    if (n === -1) return -1
                    return n + props.tuning[index]
                })
            )
        })

        // スコア（グラフ）表示用変数
        const tmpPoints: number[][] = []
        let tmpPoint: number[] = []
        let hit_cnt = 0
        let tmpScore = 0

        const tmpCorrectForms: number[] = []
        
        // 入力音高列をイテレーションする(100itr)
        noteData.forEach((d:number[]) => {            
            
            let point_max: number = 0.0
            let form_number: number = -1
            let finger: number[] = [0, 0, 0, 0, 0, 0]// コードから押さえない音を抜かした押さえ方を作る（便宜的に）
            tmpPoint = []
            
            // 配列が0のときはスキップする
            if (d.length > 0) {
                // 利用可能なフォーム（音高列）のイテレーション (100itr)
                notes.forEach((n:number[], formIndex:number) => {

                    let tmp_finger = [0, 0, 0, 0, 0, 0] // フィンガリング（ならす:1 ならさない:0）
                    // 鳴らす音の数
                    let ring_cnt = 0
                    
                    // 利用可能なフォーム（音後列）の弦ごとのイテレーション（6iter）
                    n.forEach((nn:number, strIndex:number) => {

                        // 利用可能な音高列で表現できる音があればカウント(1~6iter)
                        d.forEach(dd => {
                            if (dd === nn) { // 同じ音の場合音を鳴らす
                                tmp_finger[strIndex] = 1 // そのフォームで鳴らすべき弦を1とする（それ以外はゼロ）
                                ring_cnt++
                            }
                        })
                    })

                    // 再現度（鳴らす音の数/元の音の数）
                    const rep = ring_cnt / d.length
                    
                    // 押弦コスト
                    const cp = fingers[formIndex].cost
                    
                    // 難易度（大きいほど簡単）
                    const easiness = 1.0 / (1.0 + cp)
                    
                    // ポイント（高いほどより適している）
                    const point = props.w*rep + (1.0-props.w)* easiness
                    tmpPoint.push(point)

                    // ポイントが高いものを選択する（配列にまとめてからMath関数を使えばいいかも）
                    if (point > point_max) {
                        point_max = point
                        tmpScore += point
                        finger = tmp_finger
                        form_number = formIndex
                    }
                })
            }
            
            // -------フォーム確定-------------

            // 再現できていれば
            if (form_number !== -1) {
                // 選択されたポイントを+1.0点する
                tmpPoint[form_number] += 1.0

                // カウント
                hit_cnt += finger.filter(f=>f>0).length
            }
            tmpPoints.push(tmpPoint)
            
            // 正しいフォームを記録する
            tmpCorrectForms.push(form_number)

            // 用意したフォームで再現可能な音高であれば、tabDataに追加
            const fingering: number[] = finger.map((f, index) => {
                if (f !== 0 && form_number !== -1) return fingers[form_number].form[index]
                else return -1
            })

            tmpTabData.push(fingering)
        })

        // -------タブデータ完成----------
        setTabData(tmpTabData)
        setPoints(tmpPoints)
        setCorrectForms(tmpCorrectForms)
        setScore(tmpScore)
        setHitCount(hit_cnt)
        setRecall(hit_cnt/noteLength)

        // 実行時間計測
        const endTime = performance.now()
        const t = (endTime - startTime).toFixed(2) + ' ms'
        setExecTime(t)
    }

    const geButton = () => {
        setGenerate(true)
        generateTab()
    }

    const debugInfo = <>
        <p>Recall: {recall.toFixed(2)}  ({hitCount}/{noteLength}), Score: {score.toFixed(2)}</p>
        <p>{ exectime + ' (' + noteLength + ' notes, ' + fingers.length + ' fingers)' }</p>
    </>

    return <div>
        <div className='text-center'>
            <button onClick={geButton} className="btn btn-lg btn-success mb-3">Generate Tablature</button>
        </div>

        <hr />
        <div className={generate ? 'visible' : 'invisible'}>
            { debugInfo }
            <Graph tabData={tabData} tuning={props.tuning} noteData={noteData} fingers={fingers} correctForms={correctForms} points={points} />
            <ASCIITab tabData={tabData} tuning={props.tuning} />
        </div>

    </div>
}

export default Tab