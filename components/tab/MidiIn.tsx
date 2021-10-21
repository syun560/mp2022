import { Midi } from '@tonejs/midi'
import React, { useEffect, useState, useCallback } from 'react'
import { NoteDatum } from './type'

interface Props {
    noteData: NoteDatum[]
    setNoteData: any
    setState: any
    setChannel: any
}

const MidiIn = (props: Props) => {
    const [midiData, setMidi] = useState<Midi>()
    const [midiURL, setURL] = useState<string>('Fur_Elise_(original).mid')

    // const channel = 2 // 読み込むチャンネル
    const tmpNotes:NoteDatum[] = []

    const onChangeInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setURL(URL.createObjectURL(file))

            props.setChannel(0)
        }
    }

    const load = () => {
        async function loadMIDI(){
            props.setState('loading')
            console.log('midi load start')

            // URLからMIDI読み込み
            const midi = await Midi.fromUrl(midiURL)
            setMidi(midi)
            console.log('Tracks:')
            console.log(midi.tracks)

            // トラックごとイテレーション
            midi.tracks.forEach((track, index) => {

                const notes = track.notes
                
                // ノートごとイテレーション
                notes.forEach((note, i) => {
                    // console.log(`note: ${note.midi}, time: ${note.time}, duration: ${note.duration}, name: ${note.name}`)
                    tmpNotes.push({
                        channel: index,
                        note: note.midi,
                        time: note.ticks,
                        duration: note.duration
                    })
                })
            })

            // ロード完了
            console.log(midi.header)
            console.log('duration:' + midi.duration)
            console.log('duration:' + midi.duration)
            console.log('duration:' + midi.duration)
            console.log('midi load end')
            // alert(midi.tracks.length)
            props.setNoteData(tmpNotes)
            props.setState('complete')
        }
        loadMIDI()
    }

    // 読み込み時
    useEffect(() => {
        load()
    }, [midiURL])

    return <div>
        <form>
            <input type="file" name='aaa' onChange={onChangeInputFile} />
            {midiURL}
        </form>
        <p>{midiData ? '': 'loading！'}</p>
    </div>
}

export default MidiIn