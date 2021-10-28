import type { NextPage } from 'next'
import Layout from '../components/Layout'
import React, { useState } from 'react'

import Tab from '../components/tab/Tab'
import MidiIn from '../components/tab/MidiIn'
import EventList from '../components/tab/EventList'
import TrackSelector from '../components/tab/TrackSelector'
import Param from '../components/tab/Param'
import Tuning from '../components/tab/Tuning'
import { NoteDatum } from '../components/tab/type'

const Home: NextPage = () => {
	const [w, setW] = useState(0.8)
	const [noteData, setNoteData] = useState<NoteDatum[]>([])
	
	const [capo, setCapo] = useState<number>(0)
	const [capoFixedFlag, setCapoFixedFlag] = useState(true)
	const [tuneFixedFlag, setTuneFixedFlag] = useState(true)

	const [tuning, setTuning] = useState<number[]>([0, 0, 0, 0, 0, 0])
	const [channel, setChannel] = useState<number>(0)
	const [state, setState] = useState<'loading'|'complete'>('loading')

	return <Layout title='Home' navNum={0}>
		<div className="bg-light my-3 p-3">
			<MidiIn noteData={noteData} setNoteData={setNoteData} setState={setState} setChannel={setChannel} />
			
			{state === 'loading'?
			<h3>Loading...</h3>
			: 
			<div className='row'>
				<div className="col-lg-3">
					<TrackSelector noteData={noteData} channel={channel} setChannel={setChannel} />
					<EventList noteData={noteData} channel={channel} />
					<Param w={w} setW={setW} />
					<Tuning
						capo={capo} setCapo={setCapo} capoFixedFlag={capoFixedFlag} setCapoFixedFlag={setCapoFixedFlag}
						tuning={tuning} setTuning={setTuning} tuneFixedFlag={tuneFixedFlag} setTuneFixedFlag={setTuneFixedFlag}
					/>
				</div>
				<div className="col-lg-9">
				<Tab
					w={w}
					noteData={noteData}
					capo={capo} setCapo={setCapo} capoFixedFlag={capoFixedFlag}
					tuning={tuning} setTuning={setTuning} tuneFixedFlag={tuneFixedFlag}
					channel={channel}
				/>
				</div>
			</div>
			}
		</div>
	</Layout>
}

export default Home
