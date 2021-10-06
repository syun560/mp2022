import type { NextPage } from 'next'
import Layout from '../components/Layout'
import React, { useState } from 'react'
import { createFingerForms } from '../components/tab/Lib'
import FingeringTable from '../components/fingering/FingeringTable'

const Fingering: NextPage = () => {
	const forms = createFingerForms()
	const calcCost = () => {
		
	}

	const table = <table className='table'>
		<thead>
			<tr>
				<th>Name</th>
				<th>Fingering</th>
				<th>FingerNum</th>
				<th>Barre</th>
				<th>Cost</th>
			</tr>
		</thead>
		<tbody>
			{forms.map((f,i)=><tr key={i}>
				<td>{f.name}</td>
				<td><FingeringTable fingering={f}/></td>
				{/* <td>{f.form}</td> */}
				<td>{f.finger_num}</td>
				<td>{f.barre}</td>
				<td>{f.cost}</td>
			</tr>)}

		</tbody>
	</table>

	return <Layout title='Home' navNum={1}>
		{table}
	</Layout>
}

export default Fingering
