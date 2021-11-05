import { Midi } from '@tonejs/midi'
import React, { useEffect, useState } from 'react'
import { NoteDatum, TimeSignature } from './type'

interface Props {
    noteData: NoteDatum[]
    setNoteData: any
    
    state: 'unloaded'|'onload'|'loading'|'complete'
    setState: any
    
    setChannel: any
    setTitle: any

    setMidi: any // Midiを一番上で持つ必要はないかも？
    setTimeSignatures: any
}

const MidiIn = (props: Props) => {
    const [midiURL, setURL] = useState<string>('Fur_Elise_(original).mid')
    const tmpNotes:NoteDatum[] = []

    const onChangeInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setURL(URL.createObjectURL(file))

            props.setChannel(0)
            props.setTitle(file.name.slice(0, -4)) // 末尾の「.mid」を削除
            props.setState('onload')
        }
    }

    const load = () => {
        async function loadMIDI(){
            props.setState('loading')
            console.log('midi load start')

            const midi = await Midi.fromUrl(midiURL)
            props.setMidi(midi)

            // 拍子を設定
            props.setTimeSignatures(midi.header.timeSignatures)

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
                })
            })

            // ロード完了
            console.log(midi.header)
            console.log('duration:' + midi.duration)
            console.log('duration:' + midi.duration)
            console.log('duration:' + midi.duration)
            console.log('midi load end')
            props.setNoteData(tmpNotes)
            props.setState('complete')
        }
        loadMIDI()
    }

    // 状態が読み込み待機中のみ
    if (props.state==='onload') {
        load()
    }

    return <input className='form-control' type="file" onChange={onChangeInputFile} />
}

export default MidiIn