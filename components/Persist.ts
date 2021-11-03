import React, { useState } from "react";
import { SaveData } from "./tab/type";

const usePersist = (ky: string, initVal:SaveData):[SaveData, (saveData :SaveData)=>any] => {
    const key:string = 'hooks:' + ky
    const value = () => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initVal
        }
        catch (err) {
            console.log(err)
            return initVal
        }
    }
    const setValue = (val:SaveData) => {
        try {
            setSavedValue(val)
            window.localStorage.setItem(key, JSON.stringify(val))
        } catch (err) {
            console.log(err)
        }
    }

    const [savedValue, setSavedValue] = useState(value)
    return [savedValue, setValue]
}

export default usePersist