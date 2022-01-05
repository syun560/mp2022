import { Finger, RawFinger, NoteDatum } from "./type"
import { chord } from "./chord"

// レギュラーチューニング
export const regularTuning = [40, 45, 50, 55, 59, 64]

// 入力MIDIデータを2次元配列の形に変換する
export const convertData = (nd: NoteDatum[], reso:number, channel: number):number[][] => {
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

// ノートナンバー（64）をノート（C5）に変換する
export function noteNumberToNoteName(num: number): string {
    const notes_name = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const base = Math.floor(num / 12) - 1
    const offset = num % 12
    return notes_name[offset] + base.toString()
}

// ノートの最小値と最大値を求める
export function getMinMaxNote(noteData: NoteDatum[]): [number, number] {
    // 一番下のノート（下端のノート）
    const sorted = noteData.sort((a,b) => a.note > b.note ? 1 : -1)
    let minNote = 0
    let maxNote = 127
    if (noteData.length > 0) {
        minNote = sorted[0].note
        maxNote = sorted[noteData.length - 1].note
    }
    return [minNote, maxNote]
}

// 左手の水平方向の位置を求める
export function getHorizontalPosition(finger: Finger): number{
    let res = 10
    // 0と-1以外の一番小さいポジションを位置とする。（それ以外は0）
    finger.form.forEach(f=>{
        if (f < res && f !== 0 && f !== -1) res = f
    })
    if (res === 10) res = 0
    return res
}

// 各指のマンハッタン移動距離の和を求める
function manhattan(f: Finger, g: Finger, horizontal_move: number): number{
    let res = 0

    // 指使いをイテレーション
    const yubi = [1,2,3,4]
    yubi.forEach(y=>{
        // fでもgでも押さえてる指の場合
        if (f.finger.includes(y) && g.finger.includes(y)) {
            const fstr = f.finger.indexOf(y)
            const ffret = f.form[fstr] + horizontal_move
            const gstr = g.finger.indexOf(y)
            const gfret = g.form[gstr]
            // マンハッタン距離をコストとする
            res += Math.abs(fstr - gstr) + Math.abs(ffret - gfret)
        }
        // どちらかの場合は離弦、押弦コスト+1
        else if (f.finger.includes(y) || g.finger.includes(y)) {
            res += 0.1
        }
    })
    return res
}

// フォーム変更難易度（テーブル）を返す
export function fingerMoveCost(fingers: Finger[]): number[][] {
    const res:number[][] = []
    // 100*100くらいのイテレーション
    fingers.forEach((f,fi)=> {
        const tmpRes: number[] = []
        fingers.forEach((g,gi)=>{
            // f→gへ行く時の難易度
            // 水平方向の移動距離 + 各指のマンハッタン距離
            // fの水平方向の位置を求める（親指の位置ではないので微妙？）
            const diff = getHorizontalPosition(g) - getHorizontalPosition(f)
            let horizontal_move = Math.abs(diff)
            if (fi === 0 || gi === 0) horizontal_move = 0 // 何も押さえないときは移動しない
            // 水平方向の位置を修正
            const manhattan_move = manhattan(f, g, diff)
            const cost = horizontal_move + manhattan_move
            tmpRes.push(cost)
        })
        res.push(tmpRes)
    })
    return res
}

// 変則調弦を返す
export const tunes = [
    [0,0,0,0,0,0],  // レギュラー
    
    // 1音変化
    [-1, 0, 0, 0, 0, 0],
    [ 0,-1, 0, 0, 0, 0],
    [0,0,-1,0,0,0],
    [0,0,0,-1,0,0],
    [0,0,0,0,-1,0],
    [0,0,0,0,0,-1],
    [-2,0,0,0,0,0], // DropD
    [0,-2,0,0,0,0],
    [0,0,-2,0,0,0],
    [0,0,0,-2,0,0],
    [0,0,0,0,-2,0],
    [0,0,0,0,0,-2],
    [0,0,2,0,0,0],

    // 変則
    [-2, 0, 0, 0, -2, -2],  // DADGAD
    [-2, 0, 0, -3, -2, -2], // DADEAD

    // Openコード
    [-2, -2,  0, -1, -2, -2], // Open G
    [ 0,  0,  2,  2,  2,  0], // Open A
    [-2,  0,  0,  1, -2, -2], // Open D
    [ 0,  2,  2,  1,  0,  0], // Open E
    [-2, -2,  0,  0, -1, -2], // Open Gm
    [ 0,  0,  2,  2,  1,  0], // Open Am
    [ 0,  2,  2,  0,  0,  0], // Open Em
    [-2,  0,  0, -2, -2, -2], // Open Dm
]

// フォームを返す
export function createFingerForms(): Finger[] {
    // バレーにかけるコスト
    const barre_cost = 5

    // コストを計算する
    const calcCost = (finger : RawFinger[]): Finger[] => {
        return finger.map(f=>{
            // 指の数
            let finger_num = 0
            for (let i = 1; i < 5; i++) {
                if (f.finger.includes(i)) finger_num += 1
            }

            // 指を開く距離
            const f2 = f.form.filter(g=>g>0) // 押さえている指だけ抽出する（0は省く）
            let finger_width = Math.max(...f2) - Math.min(...f2)
            if (!Number.isFinite(finger_width)) finger_width = 0

            // コスト = 指の数 + 指を開く距離 + バレーの有無
            const cost = finger_num + finger_width + f.barre * barre_cost
            return {
                ...f,
                cost
            }
        })
    }

    // 動的にフォームを作成する。
    const dynamicChord = () => {
        const fret_max = 10
        const string_max = 6
        const single_yubi = 3 // 単音を押さえるときの指

        const fingers: RawFinger[] = []

        // 単音を生成する
        for (let f = 1; f < fret_max; f++) {
            for (let s = 0; s < string_max; s++) {
                const name = (string_max - s) + 's' + f
                let form = [-1, -1, -1, -1, -1, -1]
                let finger = [0, 0, 0, 0, 0, 0]
                form[s] = f
                finger[s] = single_yubi

                fingers.push(
                    {
                        name,
                        form,
                        finger,
                        barre: 0,
                    }
                )
            }
        }

        // バレーコード
        for (let f = 1; f < fret_max; f++) {
            const name = f + 'b'
            const finger = [1, 1, 1, 1, 1, 1]
            const form = finger.map(fin=>fin+f-1)

            fingers.push(
                {
                    name,
                    form,
                    finger,
                    barre: 1,
                }
            )
        }

        return fingers
    }

    const res = [
        ...chord,
        ...dynamicChord()
    ]

    return calcCost(res)
}