export default class CheckUtil {
    static isEmpty(str: string) {
        return str === undefined || str === null || str.replace(/\s/g, '') === '';
    }

    static isNullOrEmpty(obj: object | undefined | null) {
        return (
            obj === null ||
            obj === undefined ||
            (typeof obj === 'object' && Object.keys.length === 0)
        );
    }

    static isBrowser() {
        return typeof window !== 'undefined'
    }
}
