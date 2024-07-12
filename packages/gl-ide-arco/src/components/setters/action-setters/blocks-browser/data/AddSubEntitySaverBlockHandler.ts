import type IBlockHandler from '../../BlockHandler'
import type { PropsExpressions } from '../../BlockHandler'
import ParseResult from '../../ParseResult'
import { utils, type EntityReader, EntitySaver } from '@geelato/gl-ui'
import { blocksHandler, CommandBlocks } from '../../BlockHandler'
import useVars from '../../hooks/vars'
const {getVarStr} = useVars()
export default class AddSubEntitySaverBlockHandler implements IBlockHandler {
  getName(): string {
    return 'AddSubEntitySaverBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    //
    // const EntitySaver:EntitySaver = {}
    // let respVarName = props.respVarName || utils.gid('respVarName')
    // let entityReaderId = utils.gid('entityReader')
    // let dataVarName = props.dataVarName || utils.gid('dataVarName')
    return new ParseResult(
      `
      ${getVarStr(props.parentEntitySaverVar)}.children.push({
        entity:${props.entity},
        pidName:${props.pidName},
        records:${props.records},
      })`
    )
  }
}

interface Props {
  /**
   *  父实体保存器变量名
   */
  parentEntitySaverVar: string
  /**
   *  实体名称
   */
  entity: string
  /**
   *  本实体作为子实体时，指向父实体id字段的外健字段的名称
   */
  pidName?: string
  /**
   *  保存的记录，可以是单条记录，也可以是多条记录
   */
  records: Record<string, any>[] | Record<string, any>
}

blocksHandler.register(new AddSubEntitySaverBlockHandler(), CommandBlocks.CommandBlockOne)
