import type { NextPage } from 'next'
import Layout from '../components/Layout'
import React, { useState } from 'react'

import Tab from '../components/tab/Tab'
import MidiIn from '../components/tab/MidiIn'
import PianoRoll from '../components/tab/PianoRoll/PianoRoll'
import EventList from '../components/tab/EventList'
import Param from '../components/tab/Param'
import Tuning from '../components/tab/Tuning'
import { noteNumberToNoteName } from '../components/tab/Lib'
import { NoteDatum } from '../components/tab/type'

const Home: NextPage = () => {
	const [w, setW] = useState(0.8)
	const [noteData, setNoteData] = useState<NoteDatum[]>([])
	
	const [capo, setCapo] = useState<number>(0)
	const [tuning, setTuning] = useState<number[]>([0, 0, 0, 0, 0, 0])
	const [channel, setChannel] = useState<number>(0)
	const [state, setState] = useState<'loading'|'complete'>('loading')
    const regularTuning = [40, 45, 50, 55, 59, 64]

	return <Layout title='Home' navNum={0}>
		<div className="bg-light my-3 p-3">
			{/* {state} */}
			<MidiIn noteData={noteData} setNoteData={setNoteData} setState={setState} setChannel={setChannel} />
			{state === 'loading'? '' : 
			<div className='row'>
				<div className="col-3">
					<EventList noteData={noteData} channel={channel} />
				</div>
				<div className="col-9">
					<PianoRoll noteData={noteData} channel={channel} setChannel={setChannel} />
				</div>
			</div>
			}

			<Param w={w} setW={setW} />

			<Tuning capo={capo} setCapo={setCapo} tuning={tuning} setTuning={setTuning} />

			Tuning: {regularTuning.map(value => noteNumberToNoteName(value + capo)).join(', ')}
		</div>

		{state === 'loading'? '' : <>
			<Tab
				w={w}
				noteData={noteData}
				tuning={tuning} setTuning={setTuning}
				capo={capo} setCapo={setCapo}
				channel={channel}
			/>
		</>}
	</Layout>
}

export default Home
