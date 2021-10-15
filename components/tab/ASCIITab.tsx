import React, { useState, memo } from 'react'
import { noteNumberToNoteName } from './Lib' 

interface Props {
    tabData: number[][]
    tuning: number[]
}

const ASCIITab = memo((props: Props) => {
    console.log('generated ASCIItab')

    // 2次元配列を宣言
    const tabStr:string[][] = new Array(6)

    for (let i = 0; i < tabStr.length; i++) {
        tabStr[i] = new Array(0)
    }

    // タブデータを文字データに整形する
    props.tabData.forEach(d => {
        d.forEach((n:number, index:number) => {
            // 実際のデータ
            let str:string = ""
            if (n === -1) str = "-"
            else str = String(n)
            tabStr[index].push(str)
        })
    })

    // チューニング情報をタブ譜の先頭に追加
    tabStr.forEach((t, index) => {
        let str:string = noteNumberToNoteName(props.tuning[index])
        if (str.length===1) str += ' '
        str += '||'
        tabStr[index].unshift(str)
    })

    // 入力されるデータを分割する
    // const tabStrs:string[] = []
    const tabStr2 = tabStr.map(t=>
        t.splice(Math.floor(t.length/2))
    )

    // const division = 3

    // 改行してつなげる
    const tabStrLines = new Array(0)
    tabStr.forEach((n, index) => {
        tabStrLines.push(tabStr[5-index].join('---'))
    })
    const tabStrLine = tabStrLines.join('\n')

    // 改行してつなげる
    const tabStrLines2 = new Array(0)
    tabStr2.forEach((n, index) => {
        tabStrLines2.push(tabStr2[5-index].join('---'))
    })
    const tabStrLine2 = tabStrLines2.join('\n')


    return <div>
        <pre>
            {tabStrLine}
            <br />
            <br />
            {tabStrLine2}
        </pre>
    </div>
})

export default ASCIITab