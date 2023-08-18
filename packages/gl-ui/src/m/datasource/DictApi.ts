import axios from "axios/index";

export function queryItemByDictCode(dictCode: string) {
    return axios.get(`${axios.defaults.baseURL}/api/dict/item/queryItemByDictCode/${dictCode}`)
}