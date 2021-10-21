import { Finger, RawFinger } from "./type"

// ノートナンバー（64）をノート（C5）に変換する
export function noteNumberToNoteName(num: number): string {
    const notes_name = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const base = Math.floor(num / 12) - 1
    const offset = num % 12
    return notes_name[offset] + base.toString()
}

// 水平方向の位置を求める
export function getHorizontalPosition(finger: Finger): number{
    let res = 10
    finger.form.forEach(f=>{
        if (f < res && f !== 0 && f !== -1) res = f
    })
    if (res === 10) res = 0
    return res
}

// 各指のマンハッタン移動距離の和を求める
function manhattan(f: Finger, g: Finger): number{
    let res = 0

    // 指使いをイテレーション
    const yubi = [1,2,3,4]
    yubi.forEach(y=>{
        // fにもgにもある場合
        if (f.finger.includes(y) && g.finger.includes(y)) {
            const fstr = f.finger.indexOf(y)
            const ffret = f.form[fstr]
            const gstr = g.finger.indexOf(y)
            const gfret = g.form[gstr]
            // マンハッタン距離をコストとする
            res += Math.abs(fstr - gstr) + Math.abs(ffret - gfret)
        }
        // どちらかの場合は離弦、押弦コスト+1
        else if (f.finger.includes(y) || g.finger.includes(y)) {
            res += 1
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
            const horizontal_move = Math.abs(getHorizontalPosition(g) - getHorizontalPosition(f))
            const finger_move_cost = manhattan(f, g)
            // const cost = horizontal_move + finger_move_cost
            const cost = finger_move_cost
            tmpRes.push(cost)
        })
        res.push(tmpRes)
    })
    return res
}

// フォームを返す
export function createFingerForms(): Finger[] {

    // コストを計算する
    const calcCost = (finger : RawFinger[]): Finger[] => {
        return finger.map(f=>{
            // 指の数
            let finger_num = 0
            for (let i = 1; i < 5; i++) {
                if (f.finger.includes(i)) finger_num += 1
            }

            // 指を開く距離
            const f2 = f.finger.filter(g=>g!==0) // 押さえている指だけ抽出する（0は省く）
            let finger_width = Math.max(...f2) - Math.min(...f2)
            if (!Number.isFinite(finger_width)) finger_width = 0

            // コスト = 指の数 + 指を開く距離 + バレーの有無
            const cost = finger_num + finger_width + f.barre
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

    const chord: RawFinger[] = [
        {
            name: 'None',
            form: [0, 0, 0, 0, 0, 0],
            finger: [0, 0, 0, 0, 0, 0],
            barre: 0,
        },
        {
            name: 'C',
            form: [-1, 3, 2, 0, 1, 0],
            finger: [0, 3, 2, 0, 1, 0],
            barre: 0,
        },
        {
            name: 'C/E',
            form: [0, 3, 2, 0, 1, 0],
            finger: [0, 3, 2, 0, 1, 0],
            barre: 0,
        },
        {
            name: 'CM7',
            form: [-1, 3, 2, 0, 0, 0],
            finger: [0, 3, 2, 0, 0, 0],
            barre: 0,
        },
        {
            name: 'C7',
            form: [-1, 3, 2, 3, 1, 0],
            finger: [0, 3, 2, 4, 1, 0],
            barre: 0,
        },
        {
            name: 'C6',
            form: [-1, 3, 2, 2, 1, 0],
            finger: [0, 4, 2, 3, 1, 0],
            barre: 0,
        },
        {
            name: 'Caug',
            form: [-1, 3, 2, 1, 1, -1],
            finger: [0, 3, 2, 1, 1, 0],
            barre: 1,
        },
        {
            name: 'Cm',
            form: [-1, 3, 5, 5, 4, 3],
            finger: [0, 1, 3, 4, 2, 1],
            barre: 1,
        },
        {
            name: 'CmM7',
            form: [-1, 3, 5, 4, 4, 3],
            finger: [0, 1, 4, 2, 3, 1],
            barre: 1,
        },
        {
            name: 'Cm7',
            form: [-1, 3, 5, 3, 4, 3],
            finger: [0, 1, 3, 1, 2, 1],
            barre: 1,
        },
        {
            name: 'Cm6',
            form: [-1, 3, 1, 2, 1, 3],
            finger: [0, 3, 1, 2, 1, 4],
            barre: 1,
        },
        {
            name: 'Cm7-5',
            form: [-1, 3, 4, 3, 4, -1],
            finger: [0, 1, 3, 2, 4, 1],
            barre: 0,
        },
        {
            name: 'Cadd9',
            form: [-1, 3, 2, 0, 3, 0],
            finger: [0, 3, 2, 0, 4, 0],
            barre: 0,
        },
        {
            name: 'Csus4',
            form: [-1, 3, 3, 0, 1, 1],
            finger: [0, 3, 4, 0, 1, 1],
            barre: 1,
        },
        {
            name: 'C7sus4',
            form: [-1, 3, 5, 3, 6, 3],
            finger: [0, 1, 3, 1, 4, 1],
            barre: 0,
        },
        {
            name: 'Cdim7',
            form: [-1, 3, 4, 2, 4, -1],
            finger: [0, 2, 3, 1, 4, 0],
            barre: 0,
        },
        {
            name: 'C#',
            form: [-1, 4, 6, 6, 6, 4],
            finger: [0, 1, 3, 3, 3, 1],
            barre: 1,
        },
        {
            name: 'C#M7',
            form: [-1, 4, 6, 5, 6, 4],
            finger: [0, 1, 3, 2, 4, 1],
            barre: 1,
        },
        {
            name: 'C#7',
            form: [-1, 4, 6, 4, 6, 4],
            finger: [0, 1, 3, 1, 4, 1],
            barre: 1,
        },
        {
            name: 'C#6',
            form: [-1, 4, 6, 6, 6, 6],
            finger: [0, 1, 3, 3, 3, 3],
            barre: 1,
        },
        {
            name: 'C#aug',
            form: [-1, 4, 3, 2, 2, -1],
            finger: [0, 3, 2, 1, 1, 0],
            barre: 1,
        },
        {
            name: 'C#m',
            form: [-1, 4, 6, 6, 3, 4],
            finger: [0, 1, 3, 4, 2, 1],
            barre: 1,
        },
        {
            name: 'C#mM7',
            form: [-1, 4, 6, 5, 5, 4],
            finger: [0, 1, 4, 2, 3, 1],
            barre: 1,
        },
        {
            name: 'C#m7',
            form: [-1, 4, 6, 4, 5, 4],
            finger: [0, 1, 3, 1, 2, 1],
            barre: 1,
        },
        {
            name: 'C#m6',
            form: [-1, 4, 2, 3, 2, 4],
            finger: [0, 3, 1, 2, 1, 4],
            barre: 1,
        },
        {
            name: 'C#m7-5',
            form: [-1, 4, 5, 4, 5, -1],
            finger: [0, 1, 3, 2, 4, 1],
            barre: 0,
        },
        {
            name: 'C#add9',
            form: [-1, 4, 6, 6, 4, 4],
            finger: [0, 1, 3, 4, 1, 1],
            barre: 1,
        },
        {
            name: 'C#sus4',
            form: [-1, 4, 6, 6, 7, 4],
            finger: [0, 1, 2, 3, 4, 1],
            barre: 1,
        },
        {
            name: 'C#7sus4',
            form: [-1, 4, 6, 4, 7, 4],
            finger: [0, 1, 3, 1, 4, 1],
            barre: 1,
        },
        {
            name: 'C#dim7',
            form: [-1, 4, 5, 3, 5, -1],
            finger: [0, 2, 3, 1, 4, 0],
            barre: 0,
        },
        {
            name: 'D',
            form: [-1, -1, 0, 2, 3, 2],
            finger: [0, 0, 0, 1, 3, 1],
            barre: 0,
        },
        {
            name: 'DM7',
            form: [-1, -1, 0, 2, 2, 2],
            finger: [0, 0, 0, 1, 1, 1],
            barre: 0.5,
        },
        {
            name: 'D7',
            form: [-1, -1, 0, 2, 1, 2],
            finger: [0, 0, 0, 2, 1, 3],
            barre: 0,
        },
        {
            name: 'D6',
            form: [-1, -1, 0, 2, 0, 2],
            finger: [0, 0, 0, 2, 0, 3],
            barre: 0,
        },
        {
            name: 'Daug',
            form: [-1, -1, 0, 3, 3, 2],
            finger: [0, 0, 0, 2, 3, 1],
            barre: 0,
        },
        {
            name: 'Dm',
            form: [-1, -1, 0, 2, 3, 1],
            finger: [0, 0, 0, 2, 3, 1],
            barre: 0,
        },
        {
            name: 'DmM7',
            form: [-1, -1, 0, 2, 2, 1],
            finger: [0, 0, 0, 2, 3, 1],
            barre: 0,
        },
        {
            name: 'Dm7',
            form: [-1, -1, 0, 2, 1, 1],
            finger: [0, 0, 0, 2, 1, 1],
            barre: 0,
        },
        {
            name: 'D6',
            form: [-1, -1, 0, 2, 0, 1],
            finger: [0, 0, 0, 2, 0, 1],
            barre: 0,
        },
        {
            name: 'Dm7-5',
            form: [-1, -1, 0, 1, 1, 1],
            finger: [0, 0, 0, 1, 1, 1],
            barre: 0.5,
        },
        {
            name: 'Dadd9',
            form: [-1, -1, 0, 2, 3, 0],
            finger: [0, 0, 0, 2, 3, 0],
            barre: 0,
        },
        {
            name: 'Dsus4',
            form: [-1, -1, 0, 2, 3, 3],
            finger: [0, 0, 0, 1, 3, 3],
            barre: 0,
        },
        {
            name: 'D7sus4',
            form: [-1, -1, 0, 2, 1, 3],
            finger: [0, 0, 0, 2, 1, 4],
            barre: 0,
        },
        {
            name: 'Ddim7',
            form: [-1, -1, 0, 1, 0, 1],
            finger: [0, 0, 0, 1, 0, 2],
            barre: 0,
        },
        {
            name: 'D#',
            form: [-1, 6, 8, 8, 8, 6],
            finger: [0, 1, 2, 3, 4, 1],
            barre: 1,
        },
        {
            name: 'D#M7',
            form: [-1, 6, 8, 7, 8, 6],
            finger: [0, 1, 3, 2, 4, 1],
            barre: 1,
        },
        {
            name: 'D#7',
            form: [-1, 6, 8, 6, 8, 6],
            finger: [0, 1, 3, 1, 4, 1],
            barre: 1,
        },
        {
            name: 'D#6',
            form: [-1, 6, 8, 8, 8, 8],
            finger: [0, 1, 3, 3, 3, 3],
            barre: 1,
        },
        {
            name: 'D#aug',
            form: [-1, 6, 5, 4, 4, -1],
            finger: [0, 3, 2, 1, 1, 0],
            barre: 1,
        },
        {
            name: 'D#m',
            form: [-1, 6, 8, 8, 7, 6],
            finger: [0, 1, 3, 4, 2, 1],
            barre: 1,
        },
        {
            name: 'D#mM7',
            form: [-1, 6, 8, 7, 7, 6],
            finger: [0, 1, 4, 2, 3, 1],
            barre: 1,
        },
        {
            name: 'D#m7',
            form: [-1, 6, 8, 6, 7, 6],
            finger: [0, 1, 3, 1, 2, 1],
            barre: 1,
        },
        {
            name: 'D#m6',
            form: [-1, 6, 4, 5, 4, 6],
            finger: [0, 3, 1, 2, 1, 4],
            barre: 1,
        },
        {
            name: 'D#m7-5',
            form: [-1, 6, 7, 6, 7, -1],
            finger: [0, 1, 3, 2, 4, 1],
            barre: 0,
        },
        {
            name: 'D#add9',
            form: [-1, 6, 8, 8, 6, 6],
            finger: [0, 1, 3, 4, 1, 1],
            barre: 1,
        },
        {
            name: 'D#sus4',
            form: [-1, 6, 8, 8, 9, 6],
            finger: [0, 1, 2, 3, 4, 1],
            barre: 1,
        },
        {
            name: 'D#7sus4',
            form: [-1, 6, 8, 6, 9, 6],
            finger: [0, 1, 3, 1, 4, 1],
            barre: 1,
        },
        {
            name: 'D#dim7',
            form: [-1, 4, 5, 3, 5, -1],
            finger: [0, 2, 3, 1, 4, 0],
            barre: 0,
        },
        {
            name: 'E',
            form: [0, 2, 2, 1, 0, 0],
            finger: [0, 2, 3, 1, 0, 0],
            barre: 0,
        },
        {
            name: 'EM7',
            form: [0, 2, 1, 1, 0, 0],
            finger: [0, 3, 1, 2, 0, 0],
            barre: 0,
        },
        {
            name: 'E7',
            form: [0, 2, 0, 1, 0, 0],
            finger: [0, 2, 0, 1, 0, 0],
            barre: 0,
        },
        {
            name: 'Eaug',
            form: [-1, -1, 2, 1, 1, 0],
            finger: [0, 0, 3, 1, 4, 0],
            barre: 0,
        },
        {
            name: 'E6',
            form: [0, 2, 2, 1, 2, 0],
            finger: [0, 2, 3, 1, 4, 0],
            barre: 0,
        },
        {
            name: 'Em7',
            form: [0, 2, 0, 0, 0, 0],
            finger: [0, 2, 0, 0, 0, 0],
            barre: 0,
        },
        {
            name: 'Em6',
            form: [0, 2, 2, 0, 2, 0],
            finger: [0, 2, 3, 0, 4, 0],
            barre: 0,
        },
        {
            name: 'Em7-5',
            form: [0, 1, 2, 0, 3, 0],
            finger: [0, 1, 2, 0, 4, 0],
            barre: 0,
        },
        {
            name: 'Eadd9',
            form: [0, 2, 4, 1, 0, 0],
            finger: [0, 2, 4, 1, 0, 0],
            barre: 0,
        },
        {
            name: 'Esus4',
            form: [0, 2, 2, 2, 0, 0],
            finger: [0, 2, 3, 4, 0, 0],
            barre: 0,
        },
        {
            name: 'E7sus4',
            form: [0, 2, 0, 2, 0, 0],
            finger: [0, 2, 0, 3, 0, 0],
            barre: 0,
        },
        {
            name: 'Edim7',
            form: [0, 1, 2, 0, 2, 0],
            finger: [0, 1, 0, 2, 3, 0],
            barre: 0,
        },
        {
            name: 'F',
            form: [1, 3, 3, 2, 1, 1],
            finger: [1, 3, 4, 2, 1, 1],
            barre: 1,
        },
        {
            name: 'FM7',
            form: [1, -1, 2, 2, 1, -1],
            finger: [1, 0, 3, 4, 2, 0],
            barre: 0,
        },
        {
            name: 'F7',
            form: [1, 3, 1, 2, 1, 1],
            finger: [1, 3, 1, 2, 1, 1],
            barre: 1,
        },
        {
            name: 'F6',
            form: [1, 1, 3, 2, 3, 1],
            finger: [1, 1, 3, 2, 4, 1],
            barre: 1,
        },
        {
            name: 'Faug',
            form: [-1, -1, 3, 2, 2, 1],
            finger: [0, 0, 4, 2, 3, 1],
            barre: 0,
        },
        {
            name: 'Fm',
            form: [1, 3, 3, 1, 1, 1],
            finger: [1, 3, 4, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'FmM7',
            form: [1, 3, 2, 1, 1, 1],
            finger: [1, 3, 2, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'Fm7',
            form: [1, 3, 1, 1, 1, 1],
            finger: [1, 3, 1, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'Fm6',
            form: [1, 3, 3, 1, 3, 1],
            finger: [1, 2, 3, 1, 4, 1],
            barre: 1,
        },
        {
            name: 'Fm7-5',
            form: [1, -1, 1, 1, 0, -1],
            finger: [2, 0, 3, 4, 0, 0],
            barre: 0,
        },
        {
            name: 'Fadd9',
            form: [-1, -1, 3, 2, 1, 3],
            finger: [0, 0, 3, 2, 1, 4],
            barre: 0,
        },
        {
            name: 'Fsus4',
            form: [1, 3, 3, 3, 1, 1],
            finger: [1, 2, 3, 4, 1, 1],
            barre: 1,
        },
        {
            name: 'F7sus4',
            form: [1, 3, 1, 3, 1, 1],
            finger: [1, 3, 1, 4, 1, 1],
            barre: 1,
        },
        {
            name: 'Fdim7',
            form: [1, -1, 0, 1, 0, 1],
            finger: [1, 0, 0, 2, 0, 3],
            barre: 0,
        },
        {
            name: 'F#',
            form: [2, 4, 4, 3, 2, 2],
            finger: [1, 3, 4, 2, 1, 1],
            barre: 1,
        },
        {
            name: 'F#M7',
            form: [2, -1, 3, 3, 2, -1],
            finger: [1, 0, 3, 4, 2, 0],
            barre: 0,
        },
        {
            name: 'F#7',
            form: [2, 4, 2, 3, 2, 2],
            finger: [1, 3, 1, 2, 1, 1],
            barre: 1,
        },
        {
            name: 'F#6',
            form: [2, 2, 4, 3, 4, 2],
            finger: [1, 1, 3, 2, 4, 1],
            barre: 1,
        },
        {
            name: 'F#aug',
            form: [-1, -1, 4, 3, 3, 2],
            finger: [0, 0, 4, 2, 3, 1],
            barre: 0,
        },
        {
            name: 'F#m',
            form: [2, 4, 4, 2, 2, 2],
            finger: [1, 3, 4, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'F#mM7',
            form: [2, 4, 3, 2, 2, 2],
            finger: [1, 3, 2, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'F#m7',
            form: [2, 4, 2, 2, 2, 2],
            finger: [1, 3, 1, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'F#m6',
            form: [2, 4, 4, 2, 4, 2],
            finger: [1, 2, 3, 1, 4, 1],
            barre: 1,
        },
        {
            name: 'F#m7-5',
            form: [2, -1, 2, 2, 1, 0],
            finger: [2, 0, 3, 4, 1, 0],
            barre: 0,
        },
        {
            name: 'F#add9',
            form: [-1, -1, 4, 3, 2, 4],
            finger: [0, 0, 3, 2, 1, 4],
            barre: 0,
        },
        {
            name: 'F#sus4',
            form: [2, 4, 4, 4, 2, 2],
            finger: [1, 2, 3, 4, 1, 1],
            barre: 1,
        },
        {
            name: 'F#7sus4',
            form: [2, 4, 2, 4, 2, 2],
            finger: [1, 3, 1, 4, 1, 1],
            barre: 1,
        },
        {
            name: 'F#dim7',
            form: [2, -1, 1, 2, 1, -1],
            finger: [2, 0, 1, 3, 1, 0],
            barre: 0,
        },
        {
            name: 'G',
            form: [3, 2, 0, 0, 0, 3],
            finger: [3, 2, 0, 0, 0, 4],
            barre: 0,
        },
        {
            name: 'G',
            form: [3, 2, 0, 0, 3, 3],
            finger: [2, 1, 0, 0, 3, 4],
            barre: 0,
        },
        {
            name: 'GM7',
            form: [3, 2, 0, 0, 0, 2],
            finger: [3, 2, 0, 0, 0, 1],
            barre: 0,
        },
        {
            name: 'G7',
            form: [3, 2, 0, 0, 0, 1],
            finger: [3, 2, 0, 0, 0, 1],
            barre: 0,
        },
        {
            name: 'G6',
            form: [3, 2, 0, 0, 0, 0],
            finger: [3, 2, 0, 0, 0, 0],
            barre: 0,
        },
        {
            name: 'G6/F#',
            form: [2, 2, 0, 0, 0, 0],
            finger: [1, 2, 0, 0, 0, 0],
            barre: 0,
        },
        {
            name: 'Gaug',
            form: [-1, -1, 5, 4, 4, 3],
            finger: [0, 0, 4, 2, 3, 1],
            barre: 0,
        },
        {
            name: 'Gm',
            form: [3, 5, 5, 3, 3, 3],
            finger: [1, 3, 4, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'GmM7',
            form: [3, 5, 4, 3, 3, 3],
            finger: [1, 3, 2, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'Gm7',
            form: [3, 5, 3, 3, 3, 3],
            finger: [1, 3, 1, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'Gm6',
            form: [3, 5, 5, 3, 5, 3],
            finger: [1, 2, 3, 1, 4, 1],
            barre: 1,
        },
        {
            name: 'Gm7-5',
            form: [3, -1, 3, 3, 2, -1],
            finger: [2, 0, 3, 4, 1, 0],
            barre: 0,
        },
        {
            name: 'Gadd9',
            form: [3, 0, 0, 2, 0, 3],
            finger: [3, 0, 0, 2, 0, 4],
            barre: 0,
        },
        {
            name: 'Gsus4',
            form: [3, 2, 0, 0, 1, 3],
            finger: [3, 2, 0, 0, 1, 4],
            barre: 1,
        },
        {
            name: 'G7sus4',
            form: [3, 5, 3, 5, 3, 3],
            finger: [1, 3, 1, 4, 1, 1],
            barre: 1,
        },
        {
            name: 'Gdim7',
            form: [3, -1, 2, 3, 2, -1],
            finger: [2, 0, 1, 3, 1, 0],
            barre: 0,
        },
        {
            name: 'G#',
            form: [4, 6, 6, 5, 4, 4],
            finger: [1, 3, 4, 2, 1, 1],
            barre: 1,
        },
        {
            name: 'G#M7',
            form: [4, -1, 5, 5, 4, -1],
            finger: [1, 0, 3, 4, 2, 0],
            barre: 0,
        },
        {
            name: 'G#7',
            form: [4, 6, 4, 5, 4, 4],
            finger: [1, 3, 1, 2, 1, 1],
            barre: 1,
        },
        {
            name: 'G#6',
            form: [4, -1, 3, 5, 4, -1],
            finger: [2, 0, 1, 4, 3, 0],
            barre: 0,
        },
        {
            name: 'G#aug',
            form: [-1, -1, 6, 5, 5, 4],
            finger: [0, 0, 4, 2, 3, 1],
            barre: 0,
        },
        {
            name: 'G#m',
            form: [4, 6, 6, 4, 4, 4],
            finger: [1, 3, 4, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'G#mM7',
            form: [4, 6, 5, 4, 4, 4],
            finger: [1, 3, 2, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'G#m7',
            form: [4, 6, 4, 4, 4, 4],
            finger: [1, 3, 1, 1, 1, 1],
            barre: 1,
        },
        {
            name: 'G#m6',
            form: [4, 6, 6, 4, 6, 4],
            finger: [1, 2, 3, 1, 4, 1],
            barre: 1,
        },
        {
            name: 'G#m7-5',
            form: [4, -1, 4, 4, 3, 0],
            finger: [2, 0, 3, 4, 1, 0],
            barre: 0,
        },
        {
            name: 'G#add9',
            form: [-1, -1, 6, 5, 4, 6],
            finger: [0, 0, 3, 2, 1, 4],
            barre: 0,
        },
        {
            name: 'G#sus4',
            form: [4, 6, 6, 6, 4, 4],
            finger: [1, 2, 3, 4, 1, 1],
            barre: 1,
        },
        {
            name: 'G#7sus4',
            form: [4, 6, 4, 6, 4, 4],
            finger: [1, 3, 1, 4, 1, 1],
            barre: 1,
        },
        {
            name: 'G#dim7',
            form: [4, -1, 3, 4, 3, -1],
            finger: [2, 0, 1, 3, 1, 0],
            barre: 0,
        },
        {
            name: 'A',
            form: [-1, 0, 2, 2, 2, 0],
            finger: [0, 0, 1, 1, 1, 0],
            barre: 0.5,
        },
        {
            name: 'AM7',
            form: [-1, 0, 2, 1, 2, 0],
            finger: [0, 0, 2, 1, 3, 0],
            barre: 0,
        },
        {
            name: 'A7',
            form: [-1, 0, 2, 0, 2, 0],
            finger: [0, 0, 2, 0, 3, 0],
            barre: 0,
        },
        {
            name: 'A6',
            form: [-1, 0, 2, 2, 2, 2],
            finger: [0, 0, 1, 1, 1, 1],
            barre: 0.8,
        },
        {
            name: 'Aaug',
            form: [-1, 0, 3, 2, 2, 1],
            finger: [0, 0, 4, 2, 3, 1],
            barre: 0,
        },
        {
            name: 'Am',
            form: [-1, 0, 2, 2, 1, 0],
            finger: [0, 0, 2, 3, 1, 0],
            barre: 0,
        },
        {
            name: 'AmM7',
            form: [-1, 0, 2, 1, 1, 0],
            finger: [0, 0, 3, 1, 2, 0],
            barre: 0,
        },
        {
            name: 'Am7',
            form: [-1, 0, 2, 0, 1, 0],
            finger: [0, 0, 2, 0, 1, 0],
            barre: 0,
        },
        {
            name: 'Am6',
            form: [-1, 0, 2, 0, 1, 0],
            finger: [0, 0, 2, 3, 1, 4],
            barre: 0,
        },
        {
            name: 'Am7-5',
            form: [-1, 0, 1, 0, 1, -1],
            finger: [0, 0, 2, 0, 3, 0],
            barre: 0,
        },
        {
            name: 'Aadd9',
            form: [-1, 0, 2, 2, 0, 0],
            finger: [0, 0, 2, 3, 0, 0],
            barre: 0,
        },
        {
            name: 'Asus4',
            form: [-1, 0, 2, 2, 3, 0],
            finger: [0, 0, 1, 2, 3, 0],
            barre: 0,
        },
        {
            name: 'A7sus4',
            form: [-1, 0, 2, 0, 3, 0],
            finger: [0, 0, 1, 0, 3, 0],
            barre: 0,
        },
        {
            name: 'Adim7',
            form: [-1, 0, 1, 2, 1, 2],
            finger: [0, 0, 1, 2, 1, 3],
            barre: 0,
        },
        {
            name: 'A#',
            form: [-1, 1, 3, 3, 3, 1],
            finger: [0, 1, 3, 3, 3, 1],
            barre: 1,
        },
        {
            name: 'A#M7',
            form: [-1, 1, 3, 2, 3, 1],
            finger: [0, 1, 3, 2, 4, 1],
            barre: 1,
        },
        {
            name: 'A#7',
            form: [-1, 1, 3, 1, 3, 1],
            finger: [0, 1, 3, 1, 4, 1],
            barre: 1,
        },
        {
            name: 'A#6',
            form: [-1, 1, 3, 3, 3, 3],
            finger: [0, 1, 3, 3, 3, 3],
            barre: 1,
        },
        {
            name: 'A#aug',
            form: [-1, -1, 8, 7, 7, 6],
            finger: [0, 0, 4, 2, 3, 1],
            barre: 1,
        },
        {
            name: 'A#m',
            form: [-1, 1, 3, 3, 2, 1],
            finger: [0, 1, 3, 4, 2, 1],
            barre: 1,
        },
        {
            name: 'A#mM7',
            form: [-1, 1, 3, 2, 2, 1],
            finger: [0, 1, 4, 2, 3, 1],
            barre: 1,
        },
        {
            name: 'A#m7',
            form: [-1, 4, 6, 4, 5, 4],
            finger: [0, 1, 3, 1, 2, 1],
            barre: 1,
        },
        {
            name: 'A#m6',
            form: [-1, 1, 1, 3, 2, 1],
            finger: [0, 1, 1, 3, 2, 4],
            barre: 1,
        },
        {
            name: 'A#m7-5',
            form: [-1, 1, 2, 1, 2, -1],
            finger: [0, 1, 2, 1, 3, 1],
            barre: 0.5,
        },
        {
            name: 'A#add9',
            form: [-1, 1, 3, 3, 1, 1],
            finger: [0, 1, 3, 4, 1, 1],
            barre: 1,
        },
        {
            name: 'A#sus4',
            form: [-1, 1, 3, 3, 4, 1],
            finger: [0, 1, 2, 3, 4, 1],
            barre: 1,
        },
        {
            name: 'A#7sus4',
            form: [-1, 1, 3, 1, 4, 1],
            finger: [0, 1, 3, 1, 4, 1],
            barre: 1,
        },
        {
            name: 'A#dim7',
            form: [-1, 1, 2, 0, 1, 0],
            finger: [0, 1, 2, 0, 3, 0],
            barre: 0,
        },
        {
            name: 'B',
            form: [-1, 2, 4, 4, 4, 2],
            finger: [0, 1, 3, 3, 3, 1],
            barre: 1,
        },
        {
            name: 'BM7',
            form: [-1, 2, 4, 3, 4, 2],
            finger: [0, 1, 3, 2, 4, 1],
            barre: 1,
        },
        {
            name: 'B7',
            form: [-1, 2, 1, 2, 0, 2],
            finger: [0, 2, 1, 3, 0, 4],
            barre: 1,
        },
        {
            name: 'B6',
            form: [-1, 2, 4, 4, 4, 4],
            finger: [0, 1, 3, 3, 3, 3],
            barre: 1,
        },
        {
            name: 'Baug',
            form: [-1, 2, 1, 0, 0, -1],
            finger: [0, 3, 2, 0, 0, 0],
            barre: 0,
        },
        {
            name: 'Bm',
            form: [-1, 2, 4, 4, 3, 2],
            finger: [0, 1, 3, 4, 2, 1],
            barre: 1,
        },
        {
            name: 'BmM7',
            form: [-1, 2, 4, 3, 3, 2],
            finger: [0, 1, 4, 2, 3, 1],
            barre: 1,
        },
        {
            name: 'Bm7',
            form: [-1, 2, 4, 2, 3, 2],
            finger: [0, 1, 3, 1, 2, 1],
            barre: 1,
        },
        {
            name: 'Bm6',
            form: [-1, 3, 0, 2, 0, 3],
            finger: [0, 2, 0, 1, 0, 3],
            barre: 1,
        },
        {
            name: 'Bm7-5',
            form: [-1, 2, 3, 2, 3, -1],
            finger: [0, 1, 2, 1, 3, 0],
            barre: 0.5,
        },
        {
            name: 'Badd9',
            form: [-1, 1, 3, 3, 1, 1],
            finger: [0, 1, 3, 4, 1, 1],
            barre: 1,
        },
        {
            name: 'Bsus4',
            form: [-1, 2, 4, 4, 5, 2],
            finger: [0, 1, 2, 3, 4, 1],
            barre: 1,
        },
        {
            name: 'B7sus4',
            form: [-1, 2, 4, 2, 5, 2],
            finger: [0, 1, 3, 1, 4, 1],
            barre: 1,
        },
        {
            name: 'Bdim7',
            form: [-1, 2, 3, 1, 3, -1],
            finger: [0, 2, 3, 1, 4, 0],
            barre: 0,
        },
    ]

    const res = [
        ...chord,
        ...dynamicChord()
    ]

    return calcCost(res)
}