import type { NextPage } from 'next'
import Layout from '../components/Layout'
import React, { useState } from 'react'

import usePersist from '../components/Persist'
import Tab from '../components/tab/Tab'
import MidiIn from '../components/tab/MidiIn'
import EventList from '../components/tab/EventList'
import TrackSelector from '../components/tab/TrackSelector'
import Param from '../components/tab/Param'
import Tuning from '../components/tab/Tuning'
import { NoteDatum, SaveData, Song, defaultSaveData } from '../components/tab/type'

const Home: NextPage = () => {
	const [w, setW] = useState(0.8)
	const [noteData, setNoteData] = useState<NoteDatum[]>([])
	
	const [saveData, setSaveData] = usePersist('tab', defaultSaveData)
    const [title, setTitle] = useState('no name')

	const [capo, setCapo] = useState<number>(0)
	const [capoFixedFlag, setCapoFixedFlag] = useState(true)
	const [tuneFixedFlag, setTuneFixedFlag] = useState(true)
	
	const [tuning, setTuning] = useState<number[]>([0, 0, 0, 0, 0, 0])
	const [channel, setChannel] = useState<number>(0)
	const [state, setState] = useState<'loading'|'complete'>('loading')

	const [generateFlag, setGenerateFlag] = useState(false)

	// 仮に
	const [debugText, setDebugText] = useState(<p></p>)

	// 保存
	const save = () => {
		const song:Song = {
			title,
			genre: 'none',
			capo,
			tuning,
			date: new Date().toLocaleDateString('ja-JP', {timeZone: 'Asia/Tokyo'}),

			generateTime: 12,
			score: 12,
			recall: 12,

			noteData: [],
			tabData: []
	    }
		setSaveData({songs: [...saveData.songs.filter(s=>s.title!==title), song]})
	}

	return <Layout title='Home' navNum={0}>
		<div className="my-2">
			<MidiIn
                noteData={noteData}
                setTitle={setTitle}
                setNoteData={setNoteData}
                setState={setState}
                setChannel={setChannel}
            />
			
			{state === 'loading'?
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
					{debugText}
				</div>
				<div className="col-lg-9">
				    <button className="btn btn-primary mb-3">Play</button>
				    <Tab
				    	w={w}
				    	noteData={noteData}
				    	capo={capo} setCapo={setCapo} capoFixedFlag={capoFixedFlag}
				    	tuning={tuning} setTuning={setTuning} tuneFixedFlag={tuneFixedFlag}
				    	channel={channel}
				    	generateFlag={generateFlag} setGenerateFlag={setGenerateFlag}
				    	setDebugText={setDebugText}
				    />
				</div>
			</div>
			}
		</div>
	</Layout>
}

export default Home
