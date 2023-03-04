import {defineStore} from "pinia";
import {useComponentMaterialStore} from "./UseComponentMaterialStore";
import type {ComponentMaterial} from "@geelato/gl-ui-schema";
import {ref} from "vue";
const componentMaterialStore = useComponentMaterialStore()
const groupsMap: {[key: string]:any} = {}
const groupMap: { [key: string]: Array<ComponentMaterial> } | {} = ref({})
/**
 *  提供Sidebar中的组件，分组管理
 */
export const ComponentMaterialGroupStore = defineStore({
    id: 'GlComponentMaterialGroupStore',
    state: () => ({

    }),
    actions: {
        getComponentMaterialByGroupName (groupName: string){
            return componentMaterialStore.componentMaterials.filter((item) => {
                return item.group === groupName
            })
        },
        resetComponentMaterialGroup(){
            // for (let groupKey in groups.value) {
            //     const groupName: string = groups.value[groupKey].name
            //     groupMap.value[groupName] = getComponentMaterialByGroupName(groupName)
            // }
            // console.log('groupMap:', groupMap)
        }
    }
})
