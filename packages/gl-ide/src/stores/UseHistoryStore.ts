import {defineStore} from 'pinia'
import {ref} from "vue";

/**
 *  操作历史记录
 */
export const useHistoryStore = defineStore('GlHistoryStore', () => {

    const prevAble = ref(false)
    const nextAble = ref(false)

    const nextStep = () => {

    }

    const prevStep = () => {

    }

    return {
        prevAble,
        nextAble,
        prevStep,
        nextStep
    }
})