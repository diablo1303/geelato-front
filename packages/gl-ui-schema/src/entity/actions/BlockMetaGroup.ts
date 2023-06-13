import type BlockMeta from "./BlockMeta";

export default class BlockMetaGroup {
    name: string = 'default'
    title: string = '默认'
    // 展开状态
    opened?: boolean = true;
    blocks: Array<BlockMeta> = []
}