import {ComponentMeta, ComponentInstance} from "@geelato/gl-ui-schema";

import BlockNotificationMeta from "./setter-block/feedback/BlockNotificationMeta";
import BlockOpenThirdPageMeta from "./setter-block/page/BlockOpenThirdPageMeta";
import BlockSetVarMeta from "./setter-block/set-var/BlockSetVarMeta";
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

const componentMetas: Array<ComponentMeta> = [BlockRootMeta, BlockNotificationMeta, BlockOpenThirdPageMeta,
    BlockOpenComponentPageMeta, BlockSetVisibleMeta, SetValueBlockMeta, BlockSetVarMeta, IfComponentValueBlockMeta, BlockIfMeta, BlockElseMeta,
    BlockComponentInvokeMeta, BlockConfirmMeta, TriggerComponentActionMeta,ReturnBlockMeta,
    LogBlockMeta]

// @ts-ignore
const customInstances: Array<ComponentInstance> = [BlockIfInstance, BlockElseInstance, IfComponentValueBlockInstance]
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