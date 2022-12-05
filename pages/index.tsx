import type { NextPage } from 'next'
import Layout from '../components/Layout'
import React, { createContext, useReducer } from 'react'
import { useRouter } from 'next/router'

// コンポーネント
import usePersist from '../components/Persist'
import Tab from '../components/tab/Tab'
import MidiIn from '../components/tab/MidiIn'
import TrackSelector from '../components/tab/TrackSelector'
import Param from '../components/tab/Param'
import Sequencer from '../components/tab/Sequencer'
import Instrument from '../components/tab/Graph/Instrument'
import EventList from '../components/tab/EventList'
import { SMFWrite } from '../components/tab/SMFWrite'

import { Song, defaultSaveData } from '../components/tab/type'
import { reducer, initialState, Action } from '../components/tab/Store'
import { seqReducer, SeqState, initialSeqState, SeqAction } from '../components/tab/SequencerStore'

export const StateContext = createContext(initialState)
export const DispatchContext = createContext<React.Dispatch<Action>>(()=>{})
export const SequencerContext = createContext<{seqState: SeqState, seqDispatch: React.Dispatch<SeqAction>}>({seqState: initialSeqState, seqDispatch: ()=>{}})

const Home: NextPage = () => {
	const [saveData, setSaveData] = usePersist('tab', defaultSaveData)
	const [state, dispatch] = useReducer(reducer, initialState)
	const [seqState, seqDispatch] = useReducer(seqReducer, initialSeqState) 

    // クエリパラメータを用いて曲読み込み
	const router = useRouter()
	const { song_id } = router.query

	// 初回の場合（何も読み込まれてない場合）
	if (state.appState === 'unloaded') {
		if (song_id !== undefined) {
			const song = saveData.songs[Number(song_id)]
			dispatch({ type: 'load', song })
		}
		else {
			console.log('dispatch!')
			dispatch({type: 'setAppState', appState: 'onload'})
		}
	}
		
	// 保存
	const save = () => {
		const song:Song = {
			title: state.title,
			genre: 'none',
			date: new Date().toLocaleDateString('ja-JP', {timeZone: 'Asia/Tokyo'}),

			noteData: state.noteData,
            noteDataArray: state.noteDataArray,

			timeSignatures: state.timeSignatures
	    }
		setSaveData({songs: [...saveData.songs.filter(s=>s.title!==state.title), song]})
        console.log('save!!!!!!!!!!')
	}

	// 生成
	const gen = () => {
		SMFWrite(state.noteData)
	}

	return <Layout title='Home' navNum={0}>
		<div className="my-2">
		<StateContext.Provider value={state}>
		<DispatchContext.Provider value={dispatch}>
		<SequencerContext.Provider value={{seqState, seqDispatch}}>
			<MidiIn />
			
			{state.appState !== 'complete'?
			<h3>Loading...</h3>
			: 
			<div className='row mt-2'>
				<div className="col-lg-3">
					<TrackSelector />
					<EventList noteData={state.noteData} channel={state.channel}/>
					<Param />
					<div className='text-center'>
						<button className='btn btn-secondary mx-2' onClick={()=>dispatch({type: 'paramReset'})}>Reset</button>
	            		<button onClick={gen} className="btn btn-success">Generate</button>
						<button onClick={save} className="btn btn-secondary ms-2">Save</button>
					</div>
					<hr />
					<p>
						Beat: {state.timeSignatures[0]?.timeSignature[0]}/{state.timeSignatures[0]?.timeSignature[1]}<br />
						Beat: {state.timeSignatures[1]?.timeSignature[0]}/{state.timeSignatures[1]?.timeSignature[1]}<br />
					</p>
				</div>
				<div className="col-lg-9">
					<Instrument />
					<Sequencer />
					<Tab />
				</div>
			</div>
			}
		</SequencerContext.Provider>
		</DispatchContext.Provider>
		</StateContext.Provider>
		</div>
    </Layout>
}

export default Home
