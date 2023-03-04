import OperationHistoryItem from "./OperationHistoryItem";

/**
 *  操作记录
 */
export default class OperationHistory {

    private items: Array<OperationHistoryItem> = []

    private _currentStepIndex: number = 0

    private maxStepCount: number

    // 回调事件
    public onPrevStep?: Function
    public onNextStep?: Function

    /**
     * @param maxStepCount 可以记录的最大步骤数量，默认至少=为30步
     */
    constructor(maxStepCount: number = 30) {
        this.maxStepCount = maxStepCount < 30 ? 30 : maxStepCount
    }

    /**
     * 添加操作记录
     * @param item
     */
    pushStepByHistoryItem(item: OperationHistoryItem) {
        if (this.items.length === this.maxStepCount) {
            this.items.splice(0, 1)
        }
        this.items.push(item)
        this._currentStepIndex = this.items.length - 1
    }

    /**
     * 添加操作记录
     * @param type
     * @param jsonObj
     */
    pushStep(type: string = 'ComponentTree', jsonObj: Object = {}) {
        console.log('ide > history > ComponentTree():', jsonObj)

        this.pushStepByHistoryItem(new OperationHistoryItem(type, jsonObj))
    }

    /**
     *  上一步，当前步骤指向上一步，并返回上一步的操作记录
     */
    prevStep(): OperationHistoryItem | undefined {
        if (this.items.length === 0) {
            return undefined
        }
        this._currentStepIndex -= 1
        console.log('ide > history > prevStep():', this._currentStepIndex, this.items[this._currentStepIndex])
        if (this.onPrevStep) {
            this.onPrevStep({index: this._currentStepIndex, item: this.items[this._currentStepIndex]})
        }
        return this.items[this._currentStepIndex]
    }

    /**
     *  下一步，当前步骤指向下一步，并返回下一步的操作记录
     */
    nextStep() {
        if (this.items.length === this._currentStepIndex + 1) {
            return
        }
        this._currentStepIndex += 1
        console.log('ide > history > nextStep():', this.items[this._currentStepIndex])
        if (this.onNextStep) {
            this.onNextStep({index: this._currentStepIndex, item: this.items[this._currentStepIndex]})
        }
        return this.items[this._currentStepIndex]
    }

    getItems(): Array<OperationHistoryItem> {
        return this.items
    }

    get prevAble(): boolean {
        return this._currentStepIndex > 0
    }

    get nextAble(): boolean {
        return this.items.length > 0 && this._currentStepIndex < this.items.length - 1
    }

    get stepCount(): number {
        return this.items.length;
    }

    /**
     *  当前所处的步骤索引（位置），从0开始记数，第一步为0。
     */
    get currentStepIndex(): number {
        return this._currentStepIndex;
    }

}
