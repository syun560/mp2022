import React, { useContext, useState, useEffect, memo } from 'react'
import { SequencerContext } from '../../pages'

const Instrument = () => {
    const [selectedOutPortID, setSelectedOutPortID] = useState('')
    const [selectedInPortID, setSelectedInPortID] = useState('')
    const [inPorts, setInPorts]: [any, any] = useState([])
    const [outPorts, setOutPorts]: [any, any] = useState([])
    const [outputs, setOutputs] = useState<any>()

    const {seqState, seqDispatch} = useContext(SequencerContext)

    // テストで音を鳴らす
    // const doClick= () => {
    //     // 出力先の MIDI ポートを取得
    //     const output = outputs.get(selectedOutPortID);

    //     // MIDI メッセージを送信
    //     output.send([0x90, 60, 100]);                                       // ノートオン
    //     output.send([0x80, 60, 100], window.performance.now() + 500);      // 1秒後にノートオフ
    //     // MIDI メッセージを送信
    //     output.send([0x90, 64, 100]);                                       // ノートオン
    //     output.send([0x80, 64, 100], window.performance.now() + 500);      // 1秒後にノートオフ
    //     // MIDI メッセージを送信
    //     output.send([0x90, 67, 100]);                                       // ノートオン
    //     output.send([0x80, 67, 100], window.performance.now() + 500);      // 1秒後にノートオフ

    //     // outputを登録する
    //     seqDispatch({type: 'REGISTER_OUTPUT', output: output})
    // }

    // 読み込み時に実行
    useEffect(()=>{
        navigator.requestMIDIAccess({sysex: true}).then(
            // 成功時
            (midiAccess) => {                
                // InPortの取得、設定
                let inputIterator = midiAccess.inputs.values();
                let inPorts = []
                for (let input = inputIterator.next(); !input.done; input = inputIterator.next()) {
                    let value = input.value;
                    inPorts.push({
                        name: value.name,
                        ID: value.id
                    })
                    // イベント登録
                    // value.addEventListener('midimessage', this.inputEvent, false);
                }
                if (inPorts.length) setSelectedInPortID(inPorts[0].ID)
                setInPorts(inPorts)

                // OutPortの取得、設定
                let outPorts = []
                const tmpOutputs:any = midiAccess.outputs
                setOutputs(midiAccess.outputs)
                for (let output of tmpOutputs.values()) {
                    outPorts.push({
                        device: output,
                        name: output.name,
                        ID: output.id
                    })
                }
                if (outPorts.length) {
                    setSelectedOutPortID(outPorts[0].ID)

                    // outputを登録する
                    seqDispatch({type: 'REGISTER_OUTPUT', output: tmpOutputs.get(outPorts[0].ID)})
                }
                setOutPorts(outPorts)
                console.log("MIDI READY!!!");

                // チャンネルを初期化する（Programのセットを行う）
                seqDispatch({ type: 'PROGRAM_CHANGE', channel: 1, programNumber: 25 })
            },
 
            // 失敗時
            (msg) => console.log("MIDI FAILED - " + msg)
        )
    }, [])

    // セレクトタグの内容を作る
    let n = 0
    let in_items = inPorts.map((value:any) =>
        <option key={n++} value={value.ID}>{value.name} ({value.ID})</option> 
    )
    let out_items = outPorts.map((value:any) =>
        <option key={n++} value={value.ID}>{value.name} ({value.ID})</option> 
    )

    return <span className='me-2'>
        <tr><td>Input: </td><td><select>{ in_items }</select></td></tr>
          
        <select className="form-select" onChange={(e)=>setSelectedOutPortID(e.target.value)}
        defaultValue="-1">
            { out_items }
        </select>
    </span>
}

export default memo(Instrument)