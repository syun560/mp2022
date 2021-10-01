import { Midi } from '@tonejs/midi'
import React, { useEffect, useState, useCallback } from 'react'
import { NoteDatum } from './type'

interface Props {
    noteData: NoteDatum[]
    setNoteData: any
}


const MidiIn = (props: Props) => {
    const [midiData, setMidi] = useState<Midi>()
    const [midiURL, setURL] = useState<string>('Fur_Elise_(original).mid')

    const channel = 2 // 読み込むチャンネル
    const tmpNotes:NoteDatum[] = []

    const onChangeInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setURL(URL.createObjectURL(file))
        }
    }

    const load = () => {
        async function loadMIDI(){
            //const midi = await Midi.fromUrl("./kaeru.mid")
            const midi = await Midi.fromUrl(midiURL)
            setMidi(midi)
            // console.log(midi)
            console.log(midi.tracks)
            
            midi.tracks.forEach((track, index) => {
                if (index === channel) {
                    const notes = track.notes
                    notes.forEach(note => {
                        //console.log(note)
                        console.log(`note: ${note.midi}, time: ${note.time}, duration: ${note.duration}, name: ${note.name}`)
                        tmpNotes.push({
                            note: note.midi,
                            time: note.time,
                            duration: note.duration
                        })
                    })
                    
                }
            })

            props.setNoteData(tmpNotes)
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
            {/* <p>midiURL: {midiURL}</p> */}
            {/* <img src={midiURL} /> */}
        </form>
        <p>{midiData ? 'midi OK': 'loading！'}</p>
    </div>
}

export default MidiIn