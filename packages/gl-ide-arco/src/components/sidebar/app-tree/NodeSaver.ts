import { EntitySaver } from '@geelato/gl-ui'

export type TreeNodeRecord = {
  flag : string,
  iconType: string,
  type: string,
  treeId:string,
  text: string,
  pid:string
}

export const createAddNodeEntitySaver = (record:TreeNodeRecord) => {
  const es: EntitySaver = new EntitySaver()
  es.entity = 'platform_tree_node'
  es.record = record
  return es
}