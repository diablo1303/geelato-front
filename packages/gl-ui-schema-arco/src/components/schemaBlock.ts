import {ComponentMeta, ComponentInstance} from "@geelato/gl-ui-schema";

import BlockNotificationMeta from "./setter-block/feedback/BlockNotificationMeta";
import BlockOpenThirdPageMeta from "./setter-block/page/BlockOpenThirdPageMeta";
import BlockIfMeta from "./setter-block/if-else/BlockIfMeta";
import BlockIfInstance from "./setter-block/if-else/BlockIfInstance";
import BlockElseMeta from "./setter-block/if-else/BlockElseMeta";
import BlockElseInstance from "./setter-block/if-else/BlockElseInstance";
import BlockOpenComponentPageMeta from "./setter-block/page/BlockOpenComponentPageMeta";
import BlockRootMeta from "./setter-block/root/BlockRootMeta";
import BlockComponentInvokeMeta from "./setter-block/page/BlockComponentInvokeMeta";
import BlockConfirmMeta from "./setter-block/feedback/BlockConfirmMeta";
import BlockSetVisibleMeta from "./setter-block/page/BlockSetVisibleMeta";
import IfComponentValueBlockMeta from "./setter-block/if-else/IfComponentValueBlockMeta";
import IfComponentValueBlockInstance from "./setter-block/if-else/IfComponentValueBlockInstance";
import TriggerComponentActionMeta from "./setter-block/page/TriggerComponentActionBlockMeta";
import LogBlockMeta from "./setter-block/other/LogBlockMeta";
import SetValueBlockMeta from "./setter-block/page/SetValueBlockMeta";
import ReturnBlockMeta from "./setter-block/other/ReturnBlockMeta";
import SetVarBlockMeta from "./setter-block/set-var/SetVarBlockMeta";
import GroupSumBlockMeta from "./setter-block/data/GroupSumBlockMeta";
import ExportExcelBlockMeta from "./setter-block/file/ExportExcelBlockMeta";
import GenerateEntityReaderBlockMeta from "./setter-block/data/GenerateEntityReaderBlockMeta";
import EntityQueryBlockMeta from "./setter-block/data/EntityQueryBlockMeta";
import AnnotaionBlockMeta from "./setter-block/other/AnnotaionBlockMeta";
import ForListBlockMeta from "./setter-block/loop/ForListBlockMeta";
import ForListBlockInstance from "./setter-block/loop/ForListBlockInstance";
import DictQueryBlockMeta from './setter-block/data/DictQueryBlockMeta'
import ExportWordBlockMeta from './setter-block/file/ExportWordBlockMeta'
import JsCodeBlockMeta from "./setter-block/code/JsCodeBlockMeta";
import ExportPdfBlockMeta from './setter-block/file/ExportPdfBlockMeta';
import ImportExcelBlockMeta from './setter-block/file/ImportExcelBlockMeta';

// @ts-ignore
const componentMetas: Array<ComponentMeta> = [BlockRootMeta, SetVarBlockMeta, JsCodeBlockMeta,GenerateEntityReaderBlockMeta, GroupSumBlockMeta, BlockNotificationMeta, BlockOpenComponentPageMeta,BlockComponentInvokeMeta, TriggerComponentActionMeta, BlockSetVisibleMeta, SetValueBlockMeta, BlockOpenThirdPageMeta, IfComponentValueBlockMeta, BlockIfMeta, BlockElseMeta,
    BlockConfirmMeta,  ReturnBlockMeta,
    LogBlockMeta, ExportExcelBlockMeta,ExportWordBlockMeta,ExportPdfBlockMeta,ImportExcelBlockMeta,AnnotaionBlockMeta,ForListBlockMeta,EntityQueryBlockMeta,DictQueryBlockMeta]

// @ts-ignore
const customInstances: Array<ComponentInstance> = [BlockIfInstance, BlockElseInstance, IfComponentValueBlockInstance,ForListBlockInstance]
const componentInstances: Array<ComponentInstance> = []
// 对于没有个性化的实例，即没有个性编码配置的实例，采用以下程序构建的默认实例信息
for (const index in componentMetas) {
    const foundInstance = customInstances.find((item: ComponentInstance) => {
        return item.componentName === componentMetas[index].componentName
    })
    if (foundInstance) {
        componentInstances.push(foundInstance)
    } else {
        const componentInstance = new ComponentInstance()
        componentInstance.componentName = componentMetas[index].componentName
        componentInstance.props = {}
        componentInstance.slots = {}
        componentInstance.children = []
        componentInstances.push(componentInstance)
    }
}
const schemaBlock = {componentMetas, componentInstances}
export {schemaBlock}