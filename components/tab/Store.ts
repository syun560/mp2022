import { StateContext } from '../../pages'
import { NoteDatum, SaveData, Song, TimeSignature } from './type'

type AppState = 'unloaded'|'onload'|'loading'|'complete'

type State = {
    // アプリの状態
    appState: AppState

    // パラメータ
    w: number
    capo: number
    tuning: number[]

    channel: number

    // 曲データ
    title: string
    timeSignatures: TimeSignature[]
    noteData: NoteDatum[]
    noteDataArray: number[][]
    tabData: number[][]

    // fixedFlag
    capoFixedFlag: boolean
    tuneFixedFlag: boolean
    generateFlag: boolean

    // デバッグ情報
    generateTime: number
    score: number
    recall: number
    easiness: number
}

export const initialState: State = {
    appState: 'unloaded',
    
    w: 0.9,
    capo: 0,
    tuning: [0,0,0,0,0,0],
    
    channel: 0,
    
    title: 'no name',
    timeSignatures: [],
    noteData: [],
    noteDataArray: [],
    tabData: [],

    capoFixedFlag: true,
    tuneFixedFlag: true,
    generateFlag: false,

    generateTime: 0,
    score: 0,
    recall: 0,
    easiness: 0
}

export type Action = 
    {type: 'add'        ; text: string}|
    {type: 'save'       ; text: number}|
    {type: 'load'       ; song: Song}|

    {type: 'start'      ;}|
    {type: 'paramReset' ;}|
    
    {type: 'setChannel' ; channel: number}|
    {type: 'setTitle'   ; title: string}|
    {type: 'setAppState'; appState: AppState}|
    {type: 'setTimeSignatures'; timeSignatures: TimeSignature[]}|
    {type: 'setNoteData'; noteData: NoteDatum[]}|
    {type: 'setW'       ; w: number}|
    {type: 'setTuning'  ; tuning: number[]}|
    {type: 'setCapo'    ; capo: number}|
    {type: 'setCapoFixedFlag'; capoFixedFlag: boolean}|
    {type: 'setTuneFixedFlag'; tuneFixedFlag: boolean}|
    {type: 'setGenerateFlag'; generateFlag: boolean}|
    {type: 'setNoteData'; noteData: NoteDatum[]}|
    {type: 'setNoteDataArray'; noteDataArray: number[][]}|
    {type: 'setTabData'; tabData: number[][]}|
    {type: 'setDebugInfo'; recall: number; generateTime: number; score: number; easiness: number}

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
			capo: song.capo,
			tuning: song.tuning,
			noteData: song.noteData,
			noteDataArray: song.noteDataArray,
			tabData: song.tabData,
			timeSignatures: song.timeSignatures
        }
    case 'paramReset':
        return {
            ...state,
            capo: 0,
            tuning: [0,0,0,0,0,0],
            capoFixedFlag: true,
            tuneFixedFlag: true
        }

    case 'setAppState': 
        console.log('setAppState:' + action.appState)
        return { ...state, appState: action.appState }    
    case 'setChannel':  return { ...state, channel: action.channel}
    case 'setTitle':    return { ...state, title: action.title }
    case 'setTimeSignatures': return { ...state, timeSignatures: action.timeSignatures }
    case 'setNoteData': return { ...state, noteData: action.noteData }
    case 'setW':        return { ...state, w: action.w }
    case 'setTuning':   return { ...state, tuning: action.tuning }
    case 'setCapo':     
        console.log('setCapo')
        return { ...state, capo: action.capo }
    case 'setCapoFixedFlag':
        console.log('setCapoFixedFlag')
        return { ...state, capoFixedFlag: action.capoFixedFlag }
    case 'setTuneFixedFlag': return { ...state, tuneFixedFlag: action.tuneFixedFlag }
    case 'setGenerateFlag' :
        return { ...state, generateFlag: action.generateFlag }
    case 'setNoteData' : return { ...state, noteData: action.noteData }
    case 'setNoteDataArray' : return { ...state, noteDataArray: action.noteDataArray }
    case 'setTabData' : return { ...state, tabData: action.tabData }
    case 'setDebugInfo': return { ...state, 
        score: action.score,
        recall: action.recall,
        easiness: action.easiness,
        generateTime: action.generateTime
    }


    default:
        return state
    }
}