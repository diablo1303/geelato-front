// export enum LineType {
//     hollow = 'hollow',
//     solid = 'solid'
// }

export declare type DotType = 'hollow' | 'solid';
export declare type LineType = 'solid' | 'dashed' | 'dotted';

export type GlTimelineItem = {
    id: string,
    // 节点的唯一编码字段，可用作动态节点数据更新静态节点数据的依据
    code:string,
    label: string,
    title: string,
    content: string,
    // 可用于图标
    dotColor: string,
    dotType: DotType | undefined,
    lineType: LineType | undefined,
    lineColor: string,
    position: string,
    // 图标类型
    iconType: string,
    // 是否隐藏
    hide?: boolean
}