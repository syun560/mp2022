import { DebugNote, Finger } from './type'

export const solveShortestPath = (
    formNotes: number[][],
    noteDataArray: number[][],
    w: number,
    fingers: Finger[],
    mCosts: number[][],
) => {

    const ndlength = noteDataArray.length
    // console.log(ndlength)

    if (ndlength < 1) {
        return {
            score: 0,
            tabData: [],
            debugNotes: []
        }
    }

    // スコア（グラフ）表示用変数(2次元)
    let tmpDebugNotes: DebugNote[][] = new Array(1000)
    for (let y = 0; y < 1000; y++) {
        tmpDebugNotes[y] = new Array(1000).fill({
            correctForm: 0,
            score: 1.0,
            recall: 1.0,
            cp: 0,
            cc: 0,
            cost: 1.0,
        })
    }

    // 頂点のポイントを保存しておく(1次元)
    let prevVertexPoint: number[] = new Array(fingers.length).fill(0)
    let nowVertexPoint: number[] = new Array(fingers.length).fill(0)
    // 経路のインデックスを記憶しておくポインタ(2次元)
    // const backVertex: number[][] = new Array(ndlength)
    // for (let y = 0; y < fingers.length; y++) {
    //     backVertex[y] = new Array(fingers.length).fill(0)
    // }
    const backVertex = Array.from(new Array(1000), () => new Array(1000).fill(0));

    // 押さえる指の形(3次元) [ノート][フォーム][指(6)]
    const tmp_fingers: number[][][] = Array.from(new Array(1000), () => {
        return Array.from(new Array(1000), () => new Array(6).fill(0))
    })

    // 入力音高列をイテレーションする(100itr)
    noteDataArray.forEach( (nd:number[], noteIndex: number) => {            
        // 現在の音後列の頂点について調べる
        nowVertexPoint = new Array(fingers.length).fill(0)

        // 配列が0のときはスキップする
        // if (nd.length > 0) {
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

                let recall = 1.0
                if (nd.length > 0)
                    recall = ring_cnt / nd.length // 再現度（鳴らす音の数/元の音の数）
                if (recall > 1.0) recall = 1.0 // 暫定的な処置（できれば重複して数えないようにしたい。）
                const cp = fingers[formIndex].cost // 押弦コスト

                // ポイントが以前より高ければ選択する
                // ループする（以前のフォーム100itrぶん）
                prevVertexPoint.forEach((prev, prev_index)=>{
                    let cc = 0
                    if (mCosts.length > 0) cc = mCosts[prev_index][formIndex] // フォーム変更コスト
                    const easiness = 1.0 / (1.0 + cp + cc) // 難易度（大きいほど簡単）

                    // ポイント（高いほどより適している）
                    const point = w*recall + (1.0-w)*easiness // その時のポイント
                    const score = prev + point // 累積のポイント

                    // スコアが高かったら更新
                    if (nowVertexPoint[formIndex] < score) {
                        nowVertexPoint[formIndex] = score // スコアを更新
                        // console.log(noteIndex, formIndex)
                        backVertex[noteIndex][formIndex] = prev_index // どこから来たか記録しておく
                        tmp_fingers[noteIndex][formIndex] = tmp_finger // 指の形を記憶しておく
                        tmpDebugNotes[noteIndex][formIndex] = { // デバッグ情報を記録
                            score: point,
                            correctForm: formIndex,
                            recall,
                            cp,
                            cc,
                            cost: easiness
                        }
                    }
                })
            })
            // 以前の段階のスコアを記録しておく
            prevVertexPoint = nowVertexPoint
        // }
        // 音高データがない（[]）とき、少し計算を省略する
        // とりあえず、フォーム0（何も押さえないを選択することにする）
        // else {
        //     formNotes.forEach((fn:number[], formIndex:number) => {
        //         prevVertexPoint.forEach((prev, index)=>{ // ループをしない
        //             // nowVertexPoint[formIndex] = score // スコアはそのまま
        //             backVertex[noteIndex][formIndex] = formIndex // 以前押さえていた形のままにする
        //             // tmp_fingers[noteIndex][formIndex] = tmp_finger // なにも押さえない
        //         })
        //     })
        //     prevVertexPoint = nowVertexPoint
        // }
    })

    // 最後の列の一番大きなスコアの頂点のスコアとインデックスを取得
    let maxScore = 0
    let maxScoreIndex = 0
    nowVertexPoint.forEach((n, index)=>{
        if (maxScore < n) {
            maxScore = n
            maxScoreIndex = index
        }
    })
    
    // 最後のフィンガリングをプッシュする
    const tmpFingering:number[][] = []
    const form_number:number[] = []
    const debugNotes: DebugNote[] = []
    tmpFingering.push(tmp_fingers[ndlength-1][maxScoreIndex])
    form_number.push(maxScoreIndex)
    debugNotes.push(tmpDebugNotes[ndlength-1][maxScoreIndex])

    // バックトレースを行う
    let next = backVertex[ndlength - 1][maxScoreIndex]
    for (let x = ndlength - 2; x >= 0; x--) {
        tmpFingering.push(tmp_fingers[x][next])
        form_number.push(next)
        debugNotes.push(tmpDebugNotes[x][next])
        next = backVertex[x][next]
    }

    // 逆にする
    tmpFingering.reverse()
    form_number.reverse()
    debugNotes.reverse()

    // 用意したフォームで再現可能な音高であれば、tabDataに追加
    // tmpFingeringというのは1か0で表されている（例: [0, 0, 0, 1, 1, 0]）
    // tabDataはform_number（抑えるフォームのインデックス）と合わせてはじめて完成する
    // tabDataは鳴らさない音は-1にする。
    const tabData = tmpFingering.map((finger, nIndex) => {
        return finger.map((f, index) => {
            // if (f !== 0 && form_number !== -1) return fingers[form_number].form[index]
            if (f !== 0) return fingers[form_number[nIndex]].form[index]
            else return -1
        })
    })

    return {
        score: maxScore,
        tabData: tabData,
        debugNotes: debugNotes
    }
}