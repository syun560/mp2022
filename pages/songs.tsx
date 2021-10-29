import type { NextPage } from 'next'
import Layout from '../components/Layout'

interface Result {
	title: string
	genre: string
	capo: number
	time: number
	date: string
}

const result: Result[] = [
	{
		title: '主よ人の望みよ、喜びよ',
		genre: 'classic',
		capo: 12,
		time: 22,
		date: '2021/10/29'
	}
]

const Songs: NextPage = () => {
	return <Layout title='Songs' navNum={2}>
		<table className="table">
			<thead>
				<tr>
					<th>Title</th>
					<th>Genre</th>
					<th>Date</th>
					<th>Capo</th>
					<th>Tuning</th>
					<th>Time(ms)</th>
					<th>Notes</th>
					<th>Recall</th>
					<th>Score</th>
				</tr>
			</thead>
			<tbody>
				{result.map((r, i)=><tr key={i}>
					<td>{r.title}</td>
					<td>{r.genre}</td>
					<td>{r.date}</td>
				</tr>)}
			</tbody>
		</table>
	</Layout>
}

export default Songs
