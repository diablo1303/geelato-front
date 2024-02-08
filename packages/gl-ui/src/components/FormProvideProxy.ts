/**
 *  在GlEntityForm组件的所有子组件中注入的对象，每个组件new一个FormProvideProxy对象
 */
import {ref} from "vue";

export type FormParamType = { pName: string, pValue: any, pType: string }
export const FormProvideKey = 'FormProvideKey'
export const FormProvideKeyNotBlockForm = 'FormProvideKeyNotBlockForm'
export default class FormProvideProxy {

    state = ref<{ [key: string]: any }>({})
    recordId = ref('')

    setRecordId(id: string) {
        this.recordId.value = id
    }
    getRecordIdRef() {
        return this.recordId
    }
    getRecordId() {
        return this.recordId.value
    }

    /**
     * 设置整个表单的值
     * @param formValues
     */
    setValues(formValues: any) {
        this.state = formValues
    }

    setFieldValue(fieldName: string, value: any) {
        this.state.value[fieldName] = value
    }

    getFieldValue(fieldName: string) {
        // console.log('form state:', this.state)
        return this.state.value[fieldName]
    }

}

