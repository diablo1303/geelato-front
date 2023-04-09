import type {BlockMetaGroup} from "@geelato/gl-ui-schema";

const blockMetaGroups: Array<BlockMetaGroup> = [
    {
        name: 'page', title: '页面', blocks: [
            {
                componentName: 'GlBlockOpenThirdPage',
                title: '打开第三方页面',
                iconType: 'gl-file',
                color: '',
                content: '在新窗口打开第三方页面${url}'
            },
        ]
    },
    {
        name: 'logic', title: '逻辑', blocks: [
            {componentName: 'GlIfBlock', title: '如果', hasSub: true, color: '', content: ''},
            {componentName: 'GlForBlock', title: '循环', hasSub: true, color: '', content: ''}
        ]
    }, {
        name: 'expression', title: '表达式', blocks: [
            {componentName: 'GlConditionBlock', title: '条件', color: '', content: ''},
            {componentName: 'GlSetValueBlock', title: '设值', color: '', content: '设置变量为：${var}，值为：${val}'}
        ]
    }, {
        name: 'feedback', title: '反馈', blocks: [
            {
                componentName: 'GlBlockMessage',
                title: '弹出消息',
                iconType: 'gl-info-circle',
                color: '',
                content: '轻量级全局反馈，内容为：${content}'
            },
            {
                componentName: 'GlBlockNotification',
                title: '弹出通知',
                iconType: 'gl-notification',
                color: '',
                content: '全局展示通知提醒，内容为：${content}'
            }
        ]
    }]

export default blockMetaGroups