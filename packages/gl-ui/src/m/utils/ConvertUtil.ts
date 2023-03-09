import type {LooseObject} from "../mix/LooseObject";

export default class ConvertUtil {
    /**
     * 'false' -> false ,'0' -> false
     * @param v
     * @returns {boolean}
     */
    static toBoolean(v: string | boolean | number) {
        if (
            typeof v === "string" &&
            "false|0".indexOf(ConvertUtil.trim(v.toLowerCase())) !== -1
        ) {
            return false;
        }
        return !!v;
    }

    static trim(str: string) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    /**
     *
     * @param data 列表数据
     * @param pid  根id
     * @param pid  重命名pid字段名，默认为“pid”
     * @returns {Array}
     */
    static listToTree(data: Array<any>, pid: String | Number, renamePid?: String) {
        const tree = [];
        let temp;
        for (let i = 0; i < data.length; i += 1) {
            if (data[i].pid === pid) {
                const obj = data[i];
                temp = this.listToTree(data, data[i].id, renamePid);
                if (temp.length > 0) {
                    obj.children = temp;
                }
                tree.push(obj);
            }
        }
        return tree;
    }

    /**
     *
     * @param hex 16进制
     * @param alpha 透明度，默认为1，即不透明
     * @returns {string}
     */
    static hex2Rgb(hex: string, alpha: number) {
        const alphaLocal = alpha || 1;
        let sColor = hex.toLowerCase();
        // 十六进制颜色值的正则表达式
        const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是16进制颜色
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                let sColorNew = "#";
                for (let i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            // 处理六位的颜色值
            const sColorChange = [];
            for (let j = 1; j < 7; j += 2) {
                sColorChange.push(parseInt(`0x${sColor.slice(j, j + 2)}`, 10));
            }
            return `RGBA(${sColorChange.join(",")},${alphaLocal})`;
        }
        return sColor;
    }

    /**
     * 数组指定列去重，返回去重后的列对象
     * @param arr 数组
     * @param col
     */
    static distinct(arr: Array<any>, col: string | number) {
        const resultArray = arr.reduce(function (result, item) {
            if (!(item[col] in result)) {
                result[item[col]] = item[col];
            }
            return result;
        }, {});
        return resultArray;
    }

    /**
     *
     * @param d 需格式化的日期，可为数值或字符串或日期对象
     * @param formatString 日期格式
     * @returns {*}
     */
    static dateFormat(d: string | number | object, formatString: string) {
        let date: Date;
        let fmt = formatString;
        if (typeof d === "string") {
            date = new Date(parseInt(d, 10));
        } else if (typeof d === "number") {
            date = new Date();
        } else if (typeof d === "object") {
            date = d as Date;
        } else {
            date = new Date();
            console.error("输入格式不对，应为日期数值或字符串，或日期对象");
        }
        const o: LooseObject = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "h+": date.getHours(), // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds(), // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
            );
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
                );
            }
        }
        return fmt;
    }
}
