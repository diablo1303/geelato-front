// 最大历史栈长度
import {utils} from "@geelato/gl-ui";

// 获取数组最后一个元素
const last = (arr: Array<any>) => arr[arr.length - 1];

export class HistoryStep {
    private readonly id: string
    private readonly title: string
    private readonly description?: string
    private readonly createAt: string = utils.dateFormat(new Date(), 'yyyyMMdd HHmmss')
    private readonly value?: any
    private readonly isObject: boolean = false

    /**
     * @param title 操作步骤的标题
     * @param value 如果value的类型为object，则value会被转成字符串
     */
    constructor(id: string, title: string, value: any, description?: string) {
        this.id = id
        this.title = title
        this.description = description
        if (typeof value === 'object') {
            this.isObject = true
            this.value = JSON.stringify(value)
        } else {
            this.value = value
        }
    }

    getId() {
        return this.id
    }

    getTitle() {
        return this.title
    }

    /**
     *  将值转回成JSON对象
     */
    getValue() {
        return this.isObject ? JSON.parse(this.value) : this.value
    }

}

/**
 * 示例：
 * 历史栈：[1,2,3,4,5]
 * 操作->撤销一次
 * 历史栈：[1,2,3,4]
 * 撤销栈：[5]
 * 操作->清空一次
 * 历史栈：[]
 * 撤销栈：[5],[1,2,3,4]
 * 操作->重做一次
 * 历史栈：[1,2,3,4]
 * 撤销栈：[5]
 * 操作->重做一次
 * 历史栈：[1,2,3,4,5]
 * 撤销栈：[]
 * 操作->添加一次、撤销一次
 * 历史栈：[1,2,3,4,5]
 * 撤销栈：[6]
 * 操作->添加一次
 * 历史栈：[1,2,3,4,6]
 * 撤销栈：[]
 */
export default class History {
    // 不可撤销时的值，场景1：初始值；场景2：当撤销队列为空，无法再撤销时的状态值
    irrevocableValue?: HistoryStep = undefined;
    // 历史记录栈
    stack: Array<HistoryStep> = [];
    // 撤销栈，支持清空操作即批量撤销
    undoStack: Array<Array<HistoryStep>> = [];
    // 最新的值
    currentValue?: HistoryStep = undefined;
    // 最大历史栈长度
    maxSteps: number;

    // 是否可以撤销
    public undoAble = false
    // 是否可以重做
    public redoAble = false

    constructor(maxSteps = 30) {
        this.maxSteps = maxSteps
        this.reStat()
    }

    /**
     * 是否满
     */
    isFull() {
        return this.stack.length >= this.maxSteps;
    }

    /**
     * 设置初始值，但不记录到撤销列表中
     * @param title
     * @param value
     * @param description
     */
    init(id: string, title: string, value: any, description?: string) {
        this.irrevocableValue = new HistoryStep(id, title, value, description)
    }

    /**
     * 添加历史记录
     * @param title 历史记录标题
     * @param value 历史记录值
     */
    push(id: string, title: string, value: any, description?: string) {
        const lastStep = last(this.stack)
        this.stack.push(new HistoryStep(id, title, value, description));
        this.undoStack.length = 0;
        this.currentValue = value;
        if (lastStep) {
            if (JSON.stringify(lastStep.value) === JSON.stringify(value)) {
                console.error('新的操作记录值和上次的操作记录值相同！！', value)
            }
        }

        if (this.stack.length > this.maxSteps) {
            this.irrevocableValue = this.stack.splice(0, 1)[0];
        }
        this.reStat()
    }

    /**
     *  重新计算是否可重置、是否可撤销
     */
    reStat() {
        this.undoAble = this.stack.length > 0
        this.redoAble = this.undoStack.length > 0
    }


    /**
     * 撤销
     */
    undo() {
        if (this.undoAble) {
            const value = this.stack.pop()!;
            this.undoStack.push([value]);
            this.currentValue = last(this.stack);
            this.reStat()
        }
    }


    /**
     * 重做
     */
    redo() {
        if (this.redoAble) {
            const valueList: Array<HistoryStep> = this.undoStack.pop()!;
            this.stack.push(...valueList);
            this.currentValue = last(this.stack);
            this.reStat()
        }
    }

    /**
     *  获取当前的值
     */
    getCurrentValue() {
        // console.log('this.currentValue:', this.currentValue)
        return this.currentValue || this.irrevocableValue
    }

    /**
     * 清空历史栈
     */
    clear() {
        if (this.undoAble) {
            this.undoStack.push([...this.stack]);
            this.stack = [];
        }
        this.reStat()
    }
}