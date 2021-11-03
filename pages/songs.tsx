import type { NextPage } from 'next'
import Layout from '../components/Layout'
import { Song, SaveData, defaultSaveData } from '../components/tab/type'
import usePersist from '../components/Persist'

const Songs: NextPage = () => {
	const [saveData] = usePersist('tab', defaultSaveData)

	return <Layout title='Songs' navNum={2}>
		<table className="table">
			<thead>
				<tr>
					<th>Title</th>
					<th>Genre</th>
					<th>Date</th>
					<th>Capo</th>
					<th>Tuning</th>
					<th>generateTime(ms)</th>
					<th>NotesNum</th>
					<th>Recall</th>
					<th>Score</th>
				</tr>
			</thead>
			<tbody>
				{saveData.songs.map((s, i)=><tr key={i}>
					<td>{s.title}</td>
					<td>{s.genre}</td>
					<td>{s.date}</td>
					<td>{s.capo}</td>
					<td>{s.tuning.join()}</td>
					<td>{s.generateTime}</td>
					<td>{s.noteData.length}</td>
					<td>{s.recall}</td>
					<td>{s.score}</td>
				</tr>)}
			</tbody>
		</table>
	</Layout>
}

export default Songs
