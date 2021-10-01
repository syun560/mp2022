import { Finger } from "./type"

// ノートナンバー（64）をノート（C5）に変換する
export function noteNumberToNoteName(num: number): string {
    const notes_name = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    //const base = Math.floor(num / 12) - 1
    const offset = num % 12
    return notes_name[offset] /* base.toString()*/
}

export function createFingerForms(): Finger[] {
    const finger: Finger[] = [
        {
            name: 'None',
            form: [0, 0, 0, 0, 0, 0],
            finger_num: 0,
            barre: 0,
        },
        {
            name: '2s4',
            form: [0, 0, 0, 0, 4, 0],
            finger_num: 1,
            barre: 0,
        },
        {
            name: '2s3',
            form: [0, 0, 0, 0, 3, 0],
            finger_num: 1,
            barre: 0,
        },
        {
            name: 'C',
            form: [0, 3, 2, 0, 1, 0],
            finger_num: 3,
            barre: 0,
        },
        {
            name: 'CM7',
            form: [0, 3, 2, 0, 0, 0],
            finger_num: 2,
            barre: 0,
        },
        {
            name: 'Am',
            form: [0, 0, 2, 2, 1, 0],
            finger_num: 3,
            barre: 0,
        },
        {
            name: 'Aadd9',
            form: [0, 0, 2, 2, 0, 0],
            finger_num: 2,
            barre: 0,
        },
        {
            name: 'Am7',
            form: [0, 0, 2, 0, 1, 0],
            finger_num: 2,
            barre: 0,
        },
        {
            name: 'E',
            form: [0, 2, 2, 1, 0, 0],
            finger_num: 3,
            barre: 0,
        },
        {
            name: 'E7',
            form: [0, 2, 0, 1, 0, 0],
            finger_num: 2,
            barre: 0,
        },
        {
            name: 'Em',
            form: [0, 2, 2, 0, 0, 0],
            finger_num: 2,
            barre: 0,
        },
        {
            name: 'Em7',
            form: [0, 2, 0, 0, 0, 0],
            finger_num: 1,
            barre: 0,
        },
        {
            name: 'F',
            form: [1, 3, 3, 2, 1, 1],
            finger_num: 4,
            barre: 1,
        },
        {
            name: 'G',
            form: [3, 2, 0, 0, 0, 3],
            finger_num: 3,
            barre: 0,
        },
    ]
    return finger
}