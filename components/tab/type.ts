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

export interface DebugNote {
    correctForm: number
    score: number
    recall: number
    cost: number
    cp: number
    cc: number
}

export interface Song {
	date: string

    title: string
	genre: string

    noteData: number[][]
    tabData: number[][]

	capo: number
    tuning: number[]
    
	generateTime: number
    score: number
    recall: number
}

export interface SaveData {
    songs: Song[]
}
    
export const defaultSaveData:SaveData = {
    songs: [
		{
			date: '2021/10/29',
			title: '主よ人の望みよ、喜びよ',
			genre: 'classic',
			capo: 12,
			tuning: [0,0,0,0,0,0],
			generateTime: 22,

			noteData: [],
			tabData: [],

            score: 0.8,
            recall: 0.8
		}
	]
}