import type { NextPage } from 'next'
import Layout from '../components/Layout'
import { defaultSaveData } from '../components/tab/type'
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
					<th>generateTime(ms)</th>
					<th>NotesNum</th>
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
					<td><button onClick={()=>deleteSong(i)} type="button" className="btn-close" aria-label="Close"></button></td>
				</tr>)}
			</tbody>
		</table>
	</Layout>
}

export default Songs
