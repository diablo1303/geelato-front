import {defineStore} from 'pinia'
import {EntityMeta, FieldMeta, EntityReaderParam, entityApi} from "@geelato/gl-ui";
import {ref} from "vue";

export const useEntityStore = defineStore('GlEntityStore', () => {

    const currentEntityName = ref('')
    const currentFieldMetas = ref(new Array<FieldMeta>())
    const currentParamsMetas = ref(new Array<EntityReaderParam>())
    const entityLiteMetas = ref(new Array<EntityMeta>())

    /**
     * 从服务端加载指定应用有权访问的精简版实体元数据
     * @param appCode
     * @param forceLoad  是否强行加载，是不管当前的entityLiteMetas是否有值
     */
    const loadEntityLiteMetas = async (appCode: string, forceLoad?: boolean) => {
        if (forceLoad || entityLiteMetas.value.length === 0) {
            // @ts-ignore
            const res = await entityApi.queryEntityLiteMetas(appCode)
            entityLiteMetas.value = res?.data
            // console.log('entityLiteMetas', entityLiteMetas)
        }
        return entityLiteMetas.value
    }
    /**
     * 加载实体元数据的详细信息
     * @param appCode
     * @param entityName
     */
    const loadFieldMetas = async (appCode: string, entityName: string) => {
        const res = await entityApi.queryMeta(entityName)
        // console.log('loadFieldMetas res:',res)
        currentEntityName.value = entityName
        // @ts-ignore
        currentFieldMetas.value = res?.meta
        return currentFieldMetas.value
    }
    const setCurrentEntityName = async (entityName: string) => {
        currentEntityName.value = entityName
        const res = await entityApi.queryMeta(entityName)
    }
    return {
        loadEntityLiteMetas,
        loadFieldMetas,
        setCurrentEntityName,
        currentFieldMetas,
        entityLiteMetas
    }
})