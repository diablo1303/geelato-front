import dayjs from "dayjs";

const fns = {
    dateText(date?: Date, format?: string) {
        return dayjs(date || Date.now()).format(format || 'YYYY-MM-DD HH:mm:ss')
    }
}
export const getDateTimeFns = ($gl: any) => {
    let that = this
    return fns
}