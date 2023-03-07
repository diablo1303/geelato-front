import {defineStore} from 'pinia'
import {ref} from "vue";


export class HistoryStep {
    type: String = ''
    createAt: String = ''
}

/**
 *  操作历史记录
 */
export const useHistoryStore = defineStore('GlHistoryStore', () => {

    const steps = ref(new Array<HistoryStep>())
    const prevAble = ref(false)
    const nextAble = ref(false)

    const nextStep = () => {

    }

    const prevStep = () => {

    }

    return {
        steps,
        prevAble,
        nextAble,
        prevStep,
        nextStep
    }
})