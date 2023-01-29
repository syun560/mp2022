import { StateContext } from '../../pages'
import { NoteDatum, SaveData, Song, TimeSignature } from './type'

type AppState = 'unloaded'|'onload'|'loading'|'complete'

type State = {
    // アプリの状態
    appState: AppState

    // パラメータ
    channel: number
    tempo: number

    // 曲データ
    title: string
    timeSignatures: TimeSignature[]
    noteData: NoteDatum[]
    noteDataArray: number[][]

}

export const initialState: State = {
    appState: 'unloaded',

    channel: 0,
    tempo: 120,
    
    title: 'no name',
    timeSignatures: [],
    noteData: [],
    noteDataArray: [],

}

export type Action = 
    {type: 'add'        ; text: string}|
    {type: 'save'       ; text: number}|
    {type: 'load'       ; song: Song}|

    {type: 'start'      ;}|
    {type: 'paramReset' ;}|

    {type: 'setTempo' ; tempo: number}|
    {type: 'setChannel' ; channel: number}|
    {type: 'setTitle'   ; title: string}|
    {type: 'setAppState'; appState: AppState}|
    {type: 'setTimeSignatures'; timeSignatures: TimeSignature[]}|
    {type: 'setGenerateFlag'; generateFlag: boolean}|
    
    {type: 'setNoteData'; noteData: NoteDatum[]}|
    {type: 'addNoteData'; note: NoteDatum}|

    {type: 'setNoteDataArray'; noteDataArray: number[][]}

// stateとactionを受け取り、actionのtypeによってstateの更新方法を変える
export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
    case "save":
        return state
    case 'load':
        const song = action.song
        return {
            ...state,
            appState: 'complete',
			title: song.title,
			noteData: song.noteData,
			noteDataArray: song.noteDataArray,
			timeSignatures: song.timeSignatures
        }

    case 'setAppState': 
        console.log('setAppState:' + action.appState)
        return { ...state, appState: action.appState }    
    case 'setChannel':  return { ...state, channel: action.channel}
    case 'setTitle':    return { ...state, title: action.title }
    case 'setTimeSignatures': return { ...state, timeSignatures: action.timeSignatures }
    case 'setTempo': return { ...state, tempo: action.tempo }
    case 'setNoteData': return { ...state, noteData: action.noteData }
    case 'addNoteData' :
        // 同じ音だったら登録しない
        if (state.noteData.some(n=>{
            n.channel == action.note.channel && n.note == action.note.note && n.time == action.note.time
        })){
            return state
        }
        else{
            // ソートする
            let n :NoteDatum[] = [...state.noteData, action.note]
            n.sort((a,b)=>{
                if(a.time < b.time) return -1;
                if(a.time > b.time) return 1;
                if(a.note < b.note) return -1;
                if(a.note > b.note) return 1;
                return 0
            })
            
            return { ...state, 
                noteData: n
            }
        }
    case 'setNoteDataArray' : return { ...state, noteDataArray: action.noteDataArray }

    default:
        return state
    }
}