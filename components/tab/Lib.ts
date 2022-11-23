import { Finger, RawFinger, NoteDatum } from "./type"

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

