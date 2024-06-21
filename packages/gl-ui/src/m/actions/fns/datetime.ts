import dayjs from "dayjs";

export const useDateTimeFns = () => {
    return {
        dateText(date?: Date, format?: string) {
            return dayjs(date || Date.now()).format(format || 'YYYY-MM-DD HH:mm:ss')
        }
    }
}