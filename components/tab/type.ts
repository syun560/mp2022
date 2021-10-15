// tonejsのデータ構造をそのまま利用する
export interface NoteDatum {
    channel: number
    note: number // MIDIのノート（60 = ドの音）
    time: number // 小節（0小節から始まる、2で1小節）
    duration: number // 長さ（2で全音符, 0.5: 4分音符, 0.25: 8分音符）
}

export interface RawFinger {
    name: string,
    form: number[],
    finger: number[], 
    barre: number,
}

export interface Finger extends RawFinger{
    cost: number
}