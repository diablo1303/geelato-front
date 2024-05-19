import {ComponentMeta, ComponentInstance} from "@geelato/gl-ui-schema";

import BlockNotificationMeta from "./setter-block-browser/feedback/BlockNotificationMeta";
import BlockOpenThirdPageMeta from "./setter-block-browser/page/BlockOpenThirdPageMeta";
import BlockIfMeta from "./setter-block-browser/if-else/BlockIfMeta";
import BlockIfInstance from "./setter-block-browser/if-else/BlockIfInstance";
import BlockElseMeta from "./setter-block-browser/if-else/BlockElseMeta";
import BlockElseInstance from "./setter-block-browser/if-else/BlockElseInstance";
import BlockOpenComponentPageMeta from "./setter-block-browser/page/BlockOpenComponentPageMeta";
import BlockRootMeta from "./setter-block-browser/root/BlockRootMeta";
import BlockComponentInvokeMeta from "./setter-block-browser/page/BlockComponentInvokeMeta";
import BlockConfirmMeta from "./setter-block-browser/feedback/BlockConfirmMeta";
import BlockSetVisibleMeta from "./setter-block-browser/page/BlockSetVisibleMeta";
import IfComponentValueBlockMeta from "./setter-block-browser/if-else/IfComponentValueBlockMeta";
import IfComponentValueBlockInstance from "./setter-block-browser/if-else/IfComponentValueBlockInstance";
import IfEmptyBlockMeta from "./setter-block-browser/if-else/IfEmptyBlockMeta";
import IfEmptyBlockInstance from "./setter-block-browser/if-else/IfEmptyBlockInstance";
import IfExpressionBlockMeta from "./setter-block-browser/if-else/IfExpressionBlockMeta";
import IfExpressionBlockInstance from "./setter-block-browser/if-else/IfExpressionBlockInstance";
import TriggerComponentActionMeta from "./setter-block-browser/page/TriggerComponentActionBlockMeta";
import LogBlockMeta from "./setter-block-browser/other/LogBlockMeta";
import SetValueBlockMeta from "./setter-block-browser/page/SetValueBlockMeta";
import ReturnBlockMeta from "./setter-block-browser/other/ReturnBlockMeta";
import SetVarBlockMeta from "./setter-block-browser/set-var/SetVarBlockMeta";
import GroupSumBlockMeta from "./setter-block-browser/data/GroupSumBlockMeta";
import ExportExcelBlockMeta from "./setter-block-browser/file/ExportExcelBlockMeta";
import GenerateEntityReaderBlockMeta from "./setter-block-browser/data/GenerateEntityReaderBlockMeta";
import EntityQueryBlockMeta from "./setter-block-browser/data/EntityQueryBlockMeta";
import ForListBlockMeta from "./setter-block-browser/loop/ForListBlockMeta";
import ForListBlockInstance from "./setter-block-browser/loop/ForListBlockInstance";
import ForTimesBlockMeta from "./setter-block-browser/loop/ForTimesBlockMeta";
import ForTimesBlockInstance from "./setter-block-browser/loop/ForTimesBlockInstance";
import DictQueryBlockMeta from './setter-block-browser/data/DictQueryBlockMeta'
import ExportWordBlockMeta from './setter-block-browser/file/ExportWordBlockMeta'
import JsCodeBlockMeta from "./setter-block-browser/code/JsCodeBlockMeta";
import ExportPdfBlockMeta from './setter-block-browser/file/ExportPdfBlockMeta';
import ImportExcelBlockMeta from './setter-block-browser/file/ImportExcelBlockMeta';
import HttpRequestBlockMeta from "./setter-block-browser/network/HttpRequestBlockMeta";
import DownloadBlockMeta from "./setter-block-browser/file/DownloadBlockMeta";
import SetRulesMeta from "./setter-block-browser/page/SetRulesMeta";
import EntitySaverBlockMeta from './setter-block-browser/data/EntitySaverBlockMeta'
import AnnotationBlockMeta from "./setter-block-browser/other/AnnotationBlockMeta";
import MessageBlock from "./setter-block-browser/feedback/MessageBlockMeta"
// @ts-ignore
const componentMetas: Array<ComponentMeta> = [BlockRootMeta, SetVarBlockMeta, JsCodeBlockMeta,GenerateEntityReaderBlockMeta, GroupSumBlockMeta, BlockNotificationMeta,MessageBlock, BlockOpenComponentPageMeta,BlockComponentInvokeMeta, TriggerComponentActionMeta, BlockSetVisibleMeta, SetValueBlockMeta,SetRulesMeta, BlockOpenThirdPageMeta, IfComponentValueBlockMeta, IfExpressionBlockMeta,BlockIfMeta, BlockElseMeta,IfEmptyBlockMeta,
    BlockConfirmMeta,  ReturnBlockMeta,
    LogBlockMeta, ExportExcelBlockMeta,ExportWordBlockMeta,ExportPdfBlockMeta,ImportExcelBlockMeta,DownloadBlockMeta,AnnotationBlockMeta,ForListBlockMeta,ForTimesBlockMeta,EntityQueryBlockMeta,DictQueryBlockMeta,HttpRequestBlockMeta,EntitySaverBlockMeta]

// @ts-ignore
const customInstances: Array<ComponentInstance> = [IfExpressionBlockInstance,BlockIfInstance, BlockElseInstance, IfComponentValueBlockInstance,IfEmptyBlockInstance,ForListBlockInstance,ForTimesBlockInstance]
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
const schemaBlockBrowser = {componentMetas, componentInstances}
export {schemaBlockBrowser}