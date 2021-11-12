export type SeqState = {
    // シーケンス
    isPlaying: boolean
    nowTick: number
    bpm: number
    
    // MIDI
    output: any
}

export const initialSeqState: SeqState = {
    isPlaying: false,
    nowTick: 0,
    bpm: 120,
    
    output: null,
}

export type SeqAction = 
    {type: 'setIsPlaying'; isPlaying: boolean}|
    {type: 'setNowTick'; nowTick: number}|
    {type: 'setBPM'; bpm: number}|
    {type: 'nextTick'}|
    {type: 'stop'}|
    {type: 'REGISTER_OUTPUT'; output: any}|
    {type: 'NOTE_ON'; note: number; channel: number}|
    {type: 'ALL_NOTE_OFF'}|
    {type: 'PROGRAM_SET_ALL'}|
    {type: 'PROGRAM_CHANGE'; programNumber: number; channel: number}

// stateとactionを受け取り、actionのtypeによってstateの更新方法を変える
export const seqReducer = (state: SeqState, action: SeqAction): SeqState => {
    switch (action.type) {
    case 'setIsPlaying': return { ...state, isPlaying: action.isPlaying }
    case 'setNowTick': return { ...state, nowTick: action.nowTick }
    case 'setBPM': return { ...state, bpm: action.bpm}
    case 'nextTick': return { ...state, nowTick: state.nowTick + 1}
    case 'stop':
        return {
            ...state,
            nowTick: 0,
            isPlaying: false
        }
 
    // MIDIデバイス操作-------------------------------------
    case 'REGISTER_OUTPUT':
        return {
            ...state,
            output: action.output,
        }
    case 'NOTE_ON':
        {
            const ch = action.channel
            state.output.send([0x90 + ch, action.note, 100])
            state.output.send([0x80 + ch, action.note, 100], window.performance.now() + 1000) // 1秒後にノートオフ
            break
        }
    case 'ALL_NOTE_OFF':
        state.output.send([0xB0, 0x7B, 0])
        break
    case 'PROGRAM_SET_ALL':
        // state.channelData.map((ch, index) => state.output.send([0xC0 + index, ch.program]))
        break
    case 'PROGRAM_CHANGE':
        const ch = action.channel
        const num = action.programNumber
        state.output.send([0xC0 + ch, num])
        // let newChannelData = state.channelData.slice()
        // newChannelData[ch].program = num
        break
        // return {
        //     ...state,
        //     channelData: newChannelData
        // }
    default:
        return state
    }
    return state
}