import { noteNumberToNoteName } from "./Lib"
import { NoteDatum } from "./type"

export const SMFWrite = (song: NoteDatum[]) => {
    const MidiWriter = require('midi-writer-js')
    const tracks = []
    
    // チャンネル数分繰り返す
    for (let ch = 0; ch < 10; ch++) {
        let newTrack = new MidiWriter.Track()
        
        console.log('ch: ' + ch + 'Program: ' + ch)

        // 現在のチャンネルのnoteEventを取り出す
        let ne = song.filter(noteEvent=> noteEvent.channel === ch)

        // noteEvents
        ne.map(noteEvent => {


            // durationを変換
            let dur = "T" + Math.round(noteEvent.duration / 480 * 128)
            let sta = Math.round(noteEvent.time / 480 * 128)


            let note = new MidiWriter.NoteEvent({
                pitch: noteNumberToNoteName(noteEvent.note),
                duration: dur,
                channel: ch + 1,
                velocity: 100,
                startTick: sta
            })
            console.log(note)
            newTrack.addEvent(note)
        })
        tracks.push(newTrack)
    }

    const writer = new MidiWriter.Writer(tracks)

    // URL遷移（ダウンロード）
    window.location.href = writer.dataUri()
}

