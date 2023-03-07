import {LooseObject} from "geelato/gl-ui";
import {nextTick} from "vue";
import VueJsonPretty from "vue-json-pretty";
import 'vue-json-pretty/lib/styles.css';

export default {
    components: {VueJsonPretty},
    props: {
        parentId: {
            type: [String, Number]
        },
        glComponentInst: {
            type: Object,
            default() {
                return {}
            }
        },
        glChildren: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            titles: {
                setter: '组件设置面板',
                instance: '组件实例信息',
                result: '组件设置结果',
                meta: '组件协议信息'
            },
            componentMeta: {},
            componentInstance: {},
            refreshFlag: true
        }
    },
    methods: {
        getInstance(propertyName) {
            for (let key in this.demoProps as LooseObject) {
                if (key === propertyName) {
                    let kv = {}
                    kv[propertyName] = this.demoProps[key]
                    return kv
                }
            }
        },
        setInstance(instance) {
            let that = this
            console.log('set instance:', instance)
            this.componentInstance = instance
            that.refreshFlag = false
            nextTick(() => {
                that.refreshFlag = true
            })
        }
    }
}
