import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import React, { useState } from 'react'
import { createFingerForms, fingerMoveCost } from '../components/tab/Lib'
import FingeringTable from '../components/fingering/FingeringTable'

const Fingering: NextPage = () => {
	// フォームを動的に取得
	const forms = createFingerForms()
	const mCost = fingerMoveCost(forms)

	// クエリパラメータを用いて並び替えを行う（コスト順とか）
	const router = useRouter()
	const { sortby, order } = router.query
	if (sortby === 'cost' && order === 'asc') {
		forms.sort((f,g)=>f.cost > g.cost ? -1 : 1)
		console.log('sort by cost asc')
	}

	// フォーム絞り込み機能
	const option = ['-', 'C', 'D', 'E', 'F', 'G', 'A', 'B']
	const select = <select>{option.map((o,i)=><option key={i}>{o}</option>)}</select>

	// const mCostTable = <table className='table table-bordered table-sm'>
	// 	<thead>
	// 		<tr>
	// 			<th>#</th>
	// 			{forms.map((f, i) => <th key={i}>{f.name}</th>)}
	// 		</tr>
	// 	</thead>
	// 	<tbody>
	// 		{forms.map((f,i)=><tr key={i}>
	// 			<th>{f.name}</th>
	// 			{mCost[i].map((mc, j) => <td key={j} className={mc === 0 ? 'table-secondary' : ''}>{mc}</td>)}
	// 		</tr>)}
	// 	</tbody>
	// </table>

	const table = <table className='table'>
		<thead>
			<tr>
				<th>Name</th>
				<th>Fingering</th>
				<th>Barre</th>
				<th><a href={'?sortby=cost' + '&order=asc'}>Cost</a> {sortby === 'cost' &&order === 'asc' ? '▼' : ''}</th>
			</tr>
		</thead>
		<tbody>
			{forms.map((f,i)=><tr key={i}>
				<td>{f.name}</td>
				<td><FingeringTable fingering={f}/></td>
				{/* <td>{f.form}</td> */}
				<td>{f.barre}</td>
				<td>{f.cost}</td>
			</tr>)}
		</tbody>
	</table>

	return <Layout title='Home' navNum={1}>
		<div className='m-2'>
			<span className='me-2'>{forms.length} forms</span>
			{select}
		</div>
		{/* <p>{ sortby } で { order === 'asc' ? '昇順' : '降順' } ソートします</p> */}
		{/* {mCostTable} */}
		{table}
	</Layout>
}

export default Fingering
