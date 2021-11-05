import type { NextPage } from 'next'
import Layout from '../components/Layout'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { Midi } from '@tonejs/midi'

import usePersist from '../components/Persist'
import Tab from '../components/tab/Tab'
import MidiIn from '../components/tab/MidiIn'
import EventList from '../components/tab/EventList'
import TrackSelector from '../components/tab/TrackSelector'
import Param from '../components/tab/Param'
import Tuning from '../components/tab/Tuning'
import { NoteDatum, SaveData, Song, defaultSaveData, TimeSignature } from '../components/tab/type'

const Home: NextPage = () => {
	const [w, setW] = useState(0.8)
	const [noteData, setNoteData] = useState<NoteDatum[]>([])
    const [noteDataArray, setNoteDataArray] = useState<number[][]>([])
    const [tabData, setTabData] = useState<number[][]>([])
	
	const [saveData, setSaveData] = usePersist('tab', defaultSaveData)
    const [title, setTitle] = useState('no name')

	const [timeSignatures, setTimeSignatures] = useState<TimeSignature[]>([])

	const [capo, setCapo] = useState<number>(0)
	const [capoFixedFlag, setCapoFixedFlag] = useState(true)
	const [tuneFixedFlag, setTuneFixedFlag] = useState(true)
	
	const [tuning, setTuning] = useState<number[]>([0, 0, 0, 0, 0, 0])
	const [channel, setChannel] = useState<number>(0)
	const [state, setState] = useState<'unloaded'|'onload'|'loading'|'complete'>('unloaded')

	const [generateFlag, setGenerateFlag] = useState(false)
	const [midi, setMidi] = useState<Midi>()

	// デバッグ情報
    const [generateTime, setGenerateTime] = useState(0)
    const [score, setScore] = useState(0)
    const [recall, setRecall] = useState(0)

    // クエリパラメータを用いて曲読み込み
	const router = useRouter()
	const { song_id } = router.query
	// 初回の場合（何も読み込まれてない場合）
	if (state === 'unloaded') {
		if (song_id !== undefined) {
			const song = saveData.songs[Number(song_id)]
			setState('complete')
			setTitle(song.title)
			setCapo(song.capo)
			setTuning(song.tuning)
			setNoteData(song.noteData)
			setNoteDataArray(song.noteDataArray)
			setTabData(song.tabData)
			setTimeSignatures(song.timeSignatures)
		}
		else {
			setState('onload')
		}
	}
		
	// 保存
	const save = () => {
		const song:Song = {
			title,
			genre: 'none',
			capo,
			tuning,
			date: new Date().toLocaleDateString('ja-JP', {timeZone: 'Asia/Tokyo'}),

			generateTime,
			score,
			recall,

			noteData,
            noteDataArray,
			tabData,

			timeSignatures
	    }
		setSaveData({songs: [...saveData.songs.filter(s=>s.title!==title), song]})
        console.log('save!!!!!!!!!!')
	}

	return <Layout title='Home' navNum={0}>
		<div className="my-2">
			<MidiIn
                noteData={noteData}
                setTitle={setTitle}
                setNoteData={setNoteData}
                state={state} setState={setState}
                setChannel={setChannel}
				setMidi={setMidi}
				setTimeSignatures={setTimeSignatures}
            />
			
			{state !== 'complete'?
			<h3>Loading...</h3>
			: 
			<div className='row mt-2'>
				<div className="col-lg-3">
					<TrackSelector noteData={noteData} channel={channel} setChannel={setChannel} />
					<EventList noteData={noteData} channel={channel} />
					<Param w={w} setW={setW} />
					<Tuning
						capo={capo} setCapo={setCapo} capoFixedFlag={capoFixedFlag} setCapoFixedFlag={setCapoFixedFlag}
						tuning={tuning} setTuning={setTuning} tuneFixedFlag={tuneFixedFlag} setTuneFixedFlag={setTuneFixedFlag}
					/>
					<div className='text-center'>
						{generateFlag
	            		?<button className="btn btn-success" disabled>Generating...</button>
	            		:<button onClick={()=>setGenerateFlag(true)} className="btn btn-success">Generate</button>
						}
						<button onClick={save}className="btn btn-secondary ms-2">Save</button>
					</div>
					<hr />
					<p>
                        Recall: {recall.toFixed(2)}<br/>
                        Score: {score.toFixed(2)}<br/>
                        Time: { generateTime }
                    </p>
					<p>
						BPM: {midi?.header.tempos[0].bpm}<br />
						Beat: {timeSignatures[0]?.timeSignature[0]}/{midi?.header.timeSignatures[0]?.timeSignature[1]}<br />
						Beat: {timeSignatures[1]?.timeSignature[0]}/{midi?.header.timeSignatures[1]?.timeSignature[1]}<br />
					</p>
				</div>
				<div className="col-lg-9">
				    <button className="btn btn-primary mb-3">Play</button>
				    <Tab
				    	w={w}
				    	noteData={noteData} noteDataArray={noteDataArray} setNoteDataArray={setNoteDataArray}
                        tabData={tabData} setTabData={setTabData}
				    	capo={capo} setCapo={setCapo} capoFixedFlag={capoFixedFlag}
				    	tuning={tuning} setTuning={setTuning} tuneFixedFlag={tuneFixedFlag}
				    	channel={channel}

						timeSignatures={timeSignatures}
				    	generateFlag={generateFlag} setGenerateFlag={setGenerateFlag}
				    	setRecall={setRecall} setScore={setScore} setGenerateTime={setGenerateTime}
				    />
				</div>
			</div>
			}
		</div>
	</Layout>
}

export default Home
