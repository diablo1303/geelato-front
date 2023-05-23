import ConvertUtil from "./ConvertUtil";

export default class MixUtil {
    /**
     * 直接执行eval
     * @param expression
     * @param $ctx 用于expression的上下文参数
     * @param ctxName 指定上下文的参数名，默认为$ctx
     * @returns {*}
     */
    static evalPlus(expression: string, ctx: object, ctxName = "$ctx") {
        // console.log("MixUtil > evalPlus() > expression: ", expression);
        // console.log("MixUtil > evalPlus() > ctx: ", ctx);
        // console.log("MixUtil > evalPlus() > ctxName: ", ctxName);
        if (!expression || expression.indexOf(ctxName) === -1) {
            return expression;
        }
        const utilsName = "utils";
        const Fn = Function;
        const str = ConvertUtil.trim(expression);
        const index = str.indexOf(";");
        if (index === -1 || index === str.length - 1) {
            // 单语句
            return new Fn(ctxName, utilsName, `return ${expression}`)(ctx, this);
        }
        // 多语句
        const strAry = str.split(";");
        const lastStr = strAry.pop();
        const preStr = strAry.join(";");
        return new Fn(ctxName, utilsName, `${preStr}; return ${lastStr}`)(
            ctx,
            this
        );
    }

    /**
     *
     * @param ms 毫秒
     */
    static async sleep(ms: number) {
        function sleepMs(millisecond: number) {
            return new Promise((resolve) => {
                setTimeout(resolve, millisecond);
            });
        }

        await sleepMs(ms);
    }
}
