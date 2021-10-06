import { Finger } from "./type"

// ノートナンバー（64）をノート（C5）に変換する
export function noteNumberToNoteName(num: number): string {
    const notes_name = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const base = Math.floor(num / 12) - 1
    const offset = num % 12
    return notes_name[offset] + base.toString()
}

export function createFingerForms(): Finger[] {

    // コストを計算する

    // 動的にフォームを作成する。

    // 単音を生成する
    const singleChord = () => {
        const fret_max = 10
        const string_max = 6
        const single_yubi = 3 // 単音を押さえるときの指

        const fingers: Finger[] = []

        for (let f = 1; f < fret_max; f++) {
            for (let s = 0; s < string_max; s++) {
                const name = (string_max - s) + 's' + f
                let form = [0, 0, 0, 0, 0, 0]
                let finger = [0, 0, 0, 0, 0, 0]
                form[s] = f
                finger[s] = single_yubi

                fingers.push(
                    {
                        name,
                        form,
                        finger,
                        finger_num: 0,
                        barre: 0,
                        cost: 1
                    }
                )
            }
        }

        return fingers
    }

    const chord: Finger[] = [
        {
            name: 'C',
            form: [0, 3, 2, 0, 1, 0],
            finger: [0, 3, 2, 0, 1, 0],
            finger_num: 3,
            barre: 0,
            cost: 5
        },
        {
            name: 'CM7',
            form: [0, 3, 2, 0, 0, 0],
            finger: [0, 3, 2, 0, 0, 0],
            finger_num: 2,
            barre: 0,
            cost: 3
        },
        {
            name: 'Am',
            form: [0, 0, 2, 2, 1, 0],
            finger: [0, 0, 2, 3, 1, 0],
            finger_num: 3,
            barre: 0,
            cost: 4
        },
        {
            name: 'Aadd9',
            form: [0, 0, 2, 2, 0, 0],
            finger: [0, 0, 2, 3, 0, 0],
            finger_num: 2,
            barre: 0,
            cost: 2
        },
        {
            name: 'Am7',
            form: [0, 0, 2, 0, 1, 0],
            finger: [0, 0, 2, 0, 1, 0],
            finger_num: 2,
            barre: 0,
            cost: 3
        },
        {
            name: 'E',
            form: [0, 2, 2, 1, 0, 0],
            finger: [0, 2, 3, 1, 0, 0],
            finger_num: 3,
            barre: 0,
            cost: 4
        },
        {
            name: 'E7',
            form: [0, 2, 0, 1, 0, 0],
            finger: [0, 2, 0, 1, 0, 0],
            finger_num: 2,
            barre: 0,
            cost: 3,
        },
        {
            name: 'Em',
            form: [0, 2, 2, 0, 0, 0],
            finger: [0, 2, 3, 0, 0, 0],
            finger_num: 2,
            barre: 0,
            cost: 2
        },
        {
            name: 'Em7',
            form: [0, 2, 0, 0, 0, 0],
            finger: [0, 2, 0, 0, 0, 0],
            finger_num: 1,
            barre: 0,
            cost: 1
        },
        {
            name: 'F',
            form: [1, 3, 3, 2, 1, 1],
            finger: [1, 3, 4, 2, 1, 1],
            finger_num: 4,
            barre: 1,
            cost: 8
        },
        {
            name: 'G',
            form: [3, 2, 0, 0, 0, 3],
            finger: [3, 2, 0, 0, 0, 4],
            finger_num: 3,
            barre: 0,
            cost: 5
        },
        {
            name: 'None',
            form: [0, 0, 0, 0, 0, 0],
            finger: [0, 0, 0, 0, 0, 0],
            finger_num: 0,
            barre: 0,
            cost: 0
        },
    ]
    return [
        ...chord,
        ...singleChord()
    ]
}