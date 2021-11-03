import { Midi } from '@tonejs/midi'
import React, { useEffect, useState } from 'react'
import { NoteDatum } from './type'

interface Props {
    noteData: NoteDatum[]
    setNoteData: any
    setState: any
    setChannel: any
    setTitle: any
}

const MidiIn = (props: Props) => {
    const [midiURL, setURL] = useState<string>('Fur_Elise_(original).mid')
    const [midi, setMidi] = useState<Midi>()

    const tmpNotes:NoteDatum[] = []

    const onChangeInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setURL(URL.createObjectURL(file))

            props.setChannel(0)
            props.setTitle(file.name)
        }
    }

    const load = () => {
        async function loadMIDI(){
            props.setState('loading')
            console.log('midi load start')

            const midi = await Midi.fromUrl(midiURL)
            setMidi(midi)
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

    return <input className='form-control' type="file" onChange={onChangeInputFile} />
}

export default MidiIn