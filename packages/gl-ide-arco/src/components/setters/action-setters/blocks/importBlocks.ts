/**
 *  在blocks的相关子目录下，添加Handler之后，需要在这里导入
 */
import OpenThirdPageBlockHandler from './page/OpenThirdPageBlockHandler'
import NotificationBlockHandler from './feedback/NotificationBlockHandler'
import IfBlockHandler from './logic/IfBlockHandler'
import ElseBlockHandler from './logic/ElseBlockHandler'
import OpenComponentPageBlockHandler from './page/OpenComponentPageBlockHandler'
import ComponentInvokeBlockHandler from './page/ComponentInvokeBlockHandler'
import ConfirmBlockHandler from './feedback/ConfirmBlockHandler'
import SetVisibleBlockHandler from './page/SetVisibleBlockHandler'
import IfComponentValueBlockHandler from './logic/IfComponentValueBlockHandler'
import TriggerComponentActionBlockHandler from './logic/TriggerComponentActionBlockHandler'
import LogBlockHandler from './other/LogBlockHandler'
import SetValueBlockHandler from './page/SetValueBlockHandler'
import ReturnBlockHandler from './other/ReturnBlockHandler'
import SetVarBlockHandler from './var/SetVarBlockHandler'
import GroupSumBlockHandler from './data/GroupSumBlockHandler'
import JsCodeBlockHandler from './other/JsCodeBlockHandler'
import ExportExcelBlockHandler from './file/ExportExcelBlockHandler'
import GenerateEntityReaderBlockHandler from './data/GenerateEntityReaderBlockHandler'
import EntityQueryBlockHandler from './data/EntityQueryBlockHandler'
import DictQueryBlockHandler from './data/DictQueryBlockHandler'
import AnnotationBlockHandler from './other/AnnotationBlockHandler'
import ForListBlockHandler from './loop/ForListBlockHandler'
export {
  OpenThirdPageBlockHandler,
  NotificationBlockHandler,
  IfBlockHandler,
  ElseBlockHandler,
  OpenComponentPageBlockHandler,
  ComponentInvokeBlockHandler,
  ConfirmBlockHandler,
  SetVisibleBlockHandler,
  IfComponentValueBlockHandler,
  TriggerComponentActionBlockHandler,
  LogBlockHandler,
  SetValueBlockHandler,
  ReturnBlockHandler,
  SetVarBlockHandler,
  GroupSumBlockHandler,
  JsCodeBlockHandler,
  ExportExcelBlockHandler,
  GenerateEntityReaderBlockHandler,
  EntityQueryBlockHandler,
  DictQueryBlockHandler,
  AnnotationBlockHandler,
  ForListBlockHandler,
}