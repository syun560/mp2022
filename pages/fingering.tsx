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
				<th>name</th>
				<th>fingering</th>
				<th>finger_num</th>
				<th>barre</th>
				<th>cost</th>
			</tr>
		</thead>
		<tbody>
			{forms.map((f,i)=><tr key={i}>
				<td>{f.name}</td>
				<td><FingeringTable fingering={f.form}/></td>
				{/* <td>{f.form}</td> */}
				<td>{f.finger_num}</td>
				<td>{f.barre}</td>
			</tr>)}

		</tbody>
	</table>

	return <Layout title='Home' navNum={1}>
		{table}
	</Layout>
}

export default Fingering
