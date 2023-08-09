import axios from "axios";

/**
 * 基于编码id获取一个新的编码
 * @param id
 */
export function generateCode(id: string) {
    return axios.post(`/api/encoding/generate/${id}`);
}