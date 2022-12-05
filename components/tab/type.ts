// tonejsのデータ構造をそのまま利用する
export interface NoteDatum {
    channel: number
    note: number // MIDIのノート（60 = ドの音）
    time: number // 小節（0小節から始まる、2で1小節）
    duration: number // 長さ（2で全音符, 0.5: 4分音符, 0.25: 8分音符）
}

export interface TimeSignature {
    measures?: number | undefined
    ticks: number
    timeSignature: number[]
}

export interface Song {
	date: string
    title: string

    noteData: NoteDatum[]
    noteDataArray: number[][]

    timeSignatures: TimeSignature[]
}

export interface SaveData {
    songs: Song[]
}
    
export const defaultSaveData:SaveData = {
    songs: [
		{
			date: '2021/10/29',
			title: '主よ人の望みよ、喜びよ',
			
            noteDataArray: [],
			noteData: [],
            timeSignatures: [{
                measures: 0,
                ticks: 0,
                timeSignature: [1,4]
            }],

		}
	]
}