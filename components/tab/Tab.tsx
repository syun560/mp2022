import React, { useState,useEffect } from 'react'
import { noteNumberToNoteName, createFingerForms} from './Lib' 
import Graph from './Graph'
import { NoteDatum } from './type'

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

    // alert(nd.length-1)
    const end = found[found.length - 1].time
    // const end = 3

    for (let i=0; i<end; i+=reso) {
        res.push(found.filter(n=>n.time === i).map(x=>x.note))
    }
    return res
}

const Tab = (props: Props) => {
    console.log(props.noteData)
    const noteData = convertData(props.noteData, 0.25, props.channel)

    const fingers = createFingerForms() // 動的に生成したフォームを取得する
    const tabData: number[][] = []
    const [tab, setTab] = useState(<></>)
    const [points, setPoints] = useState<number[][]>([[2,2],[2,2]])

    const [generate, setGenerate] = useState(true)
    const [exectime, setExecTime] = useState('')


    useEffect(() => {
        generateTab()
    },[])

    const generateTab = () => {
        const startTime = performance.now()

        // 利用可能な音高列を現在のチューニングとフォームから計算する
        const notes: number[][] = []
        fingers.forEach(finger => {
            notes.push(
                finger.form.map((n, index) => n + props.tuning[index])
            )
        })
        // console.log('available notes-----')
        // console.log(notes)

        // 入力音高列をイテレーションする
        const tmpPoints: number[][] = []
        let tmpPoint: number[] = []

        // console.log('iteration-----')
        noteData.forEach((d:number[]) => {

            // 1分解能ごとに音響再現度を検討
            // 再現度を計算し、最大のフォームを選択
            
            let point_max: number = 0.0
            let form_number: number = -1
            let finger_cnt2: number = 0 // デバッグ表示のための変数（ロジックに不要）
            let finger: number[] = [0, 0, 0, 0, 0, 0]// コードから押さえない音を抜かした押さえ方を作る（便宜的に）
            tmpPoint = []

            // 利用可能なフォーム（音高列）のイテレーション
            notes.forEach((n:number[], formIndex:number) => {

                let tmp_finger = [0, 0, 0, 0, 0, 0] // フィンガリング
                // 押さえる指の数（開放弦はカウントしない）
                let finger_cnt = 0
                // 鳴らす音の数
                let ring_cnt = 0
                
                // 利用可能なフォーム（音後列）の弦ごとのイテレーション
                n.forEach((nn:number, strIndex:number) => {
                    // 利用可能な音高列で表現できる音があればカウント
                    d.forEach(dd => {
                        if (dd === nn) { // 同じ音の場合音を鳴らす
                            tmp_finger[strIndex] = 1 // そのフォームで鳴らすべき弦を1とする（それ以外はゼロ）
                            ring_cnt += 1
                            if(fingers[formIndex].form[strIndex] > 0) finger_cnt += 1
                        }
                    })
                })

                // 再現度（鳴らすおとの数/元の音の数）
                const rep = ring_cnt / d.length
                
                // 押弦コスト
                const cp = finger_cnt
                
                // 難易度（大きいほど簡単）
                const easiness = 1.0 / (1.0 + cp)
                
                // ポイント（高いほどより適している）
                const point = props.w*rep + (1.0-props.w)* easiness
                
                tmpPoint.push(point)

                // ポイントが高いものを選択する
                if (point > point_max) {
                    point_max = point
                    finger = tmp_finger
                    finger_cnt2 = finger_cnt
                    form_number = formIndex
                }


            })
            
            // -------フォーム確定-------------
            if (form_number !== -1) tmpPoint[form_number] += 1.0
            tmpPoints.push(tmpPoint)

            //if (form_number !== -1) console.log()
            
            // 用意したフォームで再現可能な音高であれば、tabDataに追加
            //if (form_number !== -1) {
            const fingering: number[] = finger.map((f, index) => {
                if (f !== 0 && form_number !== -1) return fingers[form_number].form[index]
                else return -1
            })

            // console.log(d)
            // console.log('point: ' + point_max + ', form_number: ' + form_number + ', fingering:' + fingering)
            tabData.push(fingering)
            //}

            // console.log('--------')
        })

        setPoints(tmpPoints)

        // ---------------------------rendering-----------------------------

        // 2次元配列を宣言
        const tabStr:string[][] = new Array(6)
        for(let i = 0; i < tabStr.length; i++) {
            tabStr[i] = new Array(0)
        }

        // タブデータを文字データに整形する
        tabData.forEach(d => {
            d.forEach((n:number, index:number) => {
                // 実際のデータ
                let str:string = ""
                if (n === -1) str = "-"
                else str = String(n)
                tabStr[index].push(str)
            })
        })

        // チューニング情報をタブ譜の先頭に追加
        tabStr.forEach((t, index) => {
            let str:string = noteNumberToNoteName(props.tuning[index])
            if (str.length===1) str += ' '
            str += '||'
            tabStr[index].unshift(str)
        })

        // 改行してつなげる
        //console.log('tabStr--------------')
        //console.log(tabStr)
        const tabStrLines = new Array(0)
        tabStr.forEach((n, index) => {
            tabStrLines.push(tabStr[5-index].join('---'))
        })
        //console.log(tabStrLines)
        const tabStrLine = tabStrLines.join('\n')
        //console.log(tabStrLine)

        // ステートにセット
        setTab(<pre>{tabStrLine}</pre>)

        // 実行時間計測
        const endTime = performance.now()
        const t = (endTime - startTime).toFixed(2) + ' ms'
        setExecTime(t)
        // console.log('generateTab: ' + t)
    }

    const geButton = () => {
        setGenerate(true)
        generateTab()
    }

    const debugInfo = <p>
        { exectime + ' (' + noteData.length + ' notes, ' + fingers.length + ' fingers)' }
    </p>

    return <div>
        <div className='text-center'>
            <button onClick={geButton} className="btn btn-lg btn-success mb-3">Generate Tablature</button>
        </div>

        <hr />

        <div className={generate ? 'visible' : 'invisible'}>
            { debugInfo }
            { tab }
            <Graph originalData={noteData} forms={fingers} points={points} />
        </div>

    </div>
}

export default Tab