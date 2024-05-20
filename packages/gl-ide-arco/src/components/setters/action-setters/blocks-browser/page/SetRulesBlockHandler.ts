import type IBlockHandler from '../../BlockHandler'
import ParseResult from '../../ParseResult'
import { blocksHandler, CommandBlocks } from '../../BlockHandler'

export default class SetRulesBlockHandler implements IBlockHandler {
  getName(): string {
    return 'SetRulesBlockHandler'
  }

  parseToScript(props: Props, propsExpressions: Props): ParseResult {
    let newRulesStr
    let needChangeRules = true
    switch (props.ruleMode) {
      case 'default':
        needChangeRules = false
        break
      case 'custom':
        // 如果未配置自定义规则，则不改变规则
        if (!props.customRules) {
          needChangeRules = false
        } else {
          newRulesStr = props.customRules ? JSON.stringify(props.customRules) : '[]'
        }
        break
      case 'clear':
        newRulesStr = '[]'
        break
      case undefined:
        break
      default:
        console.error('未支持的规则设置模式：', props.ruleMode)
    }

    if (needChangeRules) {
      return new ParseResult(
        `
        $gl.fn.setComponentProps("${props.componentId}",{rules:${newRulesStr}});
      `
      )
    } else {
      return new ParseResult('')
    }
  }
}

export class Props {
  appId: string = ''
  // 调用的组件Id
  componentId: string = ''
  // 设置规则的模式
  ruleMode: string = 'default'
  // 自定义的规则
  customRules?: string
}

blocksHandler.register(new SetRulesBlockHandler(), CommandBlocks.CommandBlockOne)
