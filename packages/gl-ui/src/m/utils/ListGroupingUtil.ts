export class ListGroupingUtil {

    groupBySum(data: any[], groupField: string, sumFields: string[]): any {
        const result: { [key: string]: any } = {};
        data.forEach((item) => {
            const keyValue = item[groupField];
            if (!result[keyValue]) {
                result[keyValue] = [];
            }
            for (let i = 0; i < sumFields.length; i++) {
                result[keyValue].push(item[sumFields[i]]);
            }
        });
        return result;
    }
}


// 使用示例

const data = [
    {name: '张三', age: 20, score: 90, height: 175, weight: 65},
    {name: '李四', age: 22, score: 85, height: 180, weight: 75},
    {name: '王五', age: 20, score: 95, height: 170, weight: 60},
];


const groupedData = new ListGroupingUtil().groupBySum(data, 'age', ['score', 'height']);
// console.log(groupedData); // [[180], [185], [190]]

