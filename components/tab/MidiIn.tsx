import { Midi } from '@tonejs/midi'
import React, { useEffect, useState, useContext } from 'react'
import { NoteDatum, TimeSignature } from './type'
import { StateContext, DispatchContext } from '../../pages'

const MidiIn = () => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)
    const [midiURL, setURL] = useState<string>('Fur_Elise_(original).mid')
    const tmpNotes:NoteDatum[] = []

    const onChangeInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setURL(URL.createObjectURL(file))

            dispatch({type: 'setChannel', channel: 0})
            dispatch({type: 'setTitle', title: file.name.slice(0, -4) }) // 末尾の「.mid」を削除
            dispatch({type: 'setAppState', appState: 'onload' }) // 読み込み開始
        }
    }

    const load = () => {
        async function loadMIDI(){
            console.log('load!')
            dispatch({type: 'setAppState', appState: 'loading' }) // 読み込み中に設定
            console.log('midi load start')
            const midi = await Midi.fromUrl(midiURL)

            // 拍子を設定
            dispatch({type: 'setTimeSignatures', timeSignatures: midi.header.timeSignatures }) // 

            console.log('Tracks:')
            console.log(midi.tracks)

            // トラックのイテレーション
            midi.tracks.forEach((track, index) => {
                const notes = track.notes
                // ノートのイテレーション
                notes.forEach((note, i) => {
                    tmpNotes.push({
                        channel: index,
                        note: note.midi,
                        time: note.ticks,
                        duration: note.durationTicks
                    })
                    console.log({
                        channel: index,
                        note: note.midi,
                        time: note.ticks,
                        duration: note.durationTicks
                    })
                })
            })

            // ロード完了
            console.log(midi.header)
            console.log('midi load end')

            dispatch({type: 'setNoteData', noteData: tmpNotes })
            dispatch({type: 'setAppState', appState: 'complete' }) // 読み込み完了
        }
        loadMIDI()
    }

    // 状態が読み込み待機中のみ
    if (state.appState==='onload') {
        load()
    }

    return <input className='form-control' type="file" onChange={onChangeInputFile} />
}

export default MidiIn
