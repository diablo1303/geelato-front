export interface Params {
    [key: string]: string;
}

export default class BlockUtils {

    static highlightVariables = (str: string | undefined) => {
        if (!str) return ''
        const regex = /\${(\w+)}/g;
        return str.replace(regex, "<span class='gl-var'>$&</span>");
    }


    static replaceVariables = (message: string, params: Params): string => {
        let result: string = message;
        Object.keys(params).forEach((key: string) => {
            if (params[key]) {
                result = result.replace(new RegExp('\\${' + key + '}', 'g'), params[key]);
                result = result.replace(new RegExp('{' + key + '}', 'g'), `"${params[key]}"`);
            }
        });
        return result;
    }

}