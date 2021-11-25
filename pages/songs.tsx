import type { NextPage } from 'next'
import Layout from '../components/Layout'
import { Song, SaveData, defaultSaveData } from '../components/tab/type'
import usePersist from '../components/Persist'
import Link from 'next/link'

const Songs: NextPage = () => {
	const [saveData, setSaveData] = usePersist('tab', defaultSaveData)

	// 削除
	const deleteSong = (index: number) => {
		console.log('delete song')
		const newSongs = saveData.songs
		newSongs.splice(index, 1)
		setSaveData({songs: newSongs})
	}

	return <Layout title='Songs' navNum={2}>
		<table className="table">
			<thead>
				<tr>
					<th>Title</th>
					{/* <th>Genre</th> */}
					{/* <th>Date</th> */}
					<th>Capo</th>
					<th>Tuning</th>
					<th>generateTime(ms)</th>
					<th>NotesNum</th>
					<th>Recall</th>
					<th>Score</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{saveData.songs.map((s, i)=><tr key={s.title}>
					<td><Link href={{
            			pathname: '/',
            			query: { song_id: i },
          			}}>{s.title}</Link></td>
					{/* <td>{s.genre}</td> */}
					{/* <td>{s.date}</td> */}
					<td>{s.capo}</td>
					<td>{s.tuning.join()}</td>
					<td>{s.generateTime.toFixed(2)}</td>
					<td>{s.noteData.length}</td>
					<td>{s.recall.toFixed(2)}</td>
					<td>{s.score.toFixed(2)}</td>
					<td><button onClick={()=>deleteSong(i)} type="button" className="btn-close" aria-label="Close"></button></td>
				</tr>)}
			</tbody>
		</table>
	</Layout>
}

export default Songs
