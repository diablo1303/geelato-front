//  record :{subField1:xx,subField2:xx}
type Record = { [key: string]: any }

export class RecordsUtil {


    // 使用示例
    // const data = [
    //     {name: '张三', age: 20, score: 90, height: 175, weight: 65},
    //     {name: '李四', age: 22, score: 85, height: 180, weight: 75},
    //     {name: '王五', age: 20, score: 95, height: 170, weight: 60},
    // ];
    // const groupedData = new RecordsUtil().groupSum(data, 'age', ['score', 'height']);
    static groupSum(data: any[], groupField: string, sumFields: string[]): any {
        const result: { [key: string]: Record } = {};
        // 分组
        data.forEach((item) => {
            const keyValue = item[groupField];
            if (!result[keyValue]) {
                result[keyValue] = {};
            }
            for (let i = 0; i < sumFields.length; i++) {
                let lastSum = result[keyValue][sumFields[i]]
                result[keyValue][sumFields[i]] = lastSum + (item[sumFields[i]] || 0)
            }
        });
        return result;
    }
}




