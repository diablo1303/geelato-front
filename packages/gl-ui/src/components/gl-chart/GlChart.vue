<script lang="ts">
export default {
  name: 'GlChart'
}
</script>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, type PropType, ref, watch } from 'vue'
import mixins from '../../components/mixins'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import type { EntityReader } from '../../m/datasource/EntityDataSource'
import { entityApi } from '../../m/datasource/EntityApi'
import useGlobal from '../../m/hooks/useGlobal'

const global = useGlobal()
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  // modelValue: {
  //   type: String,
  //   default() {
  //     return ''
  //   }
  // },
  type: {
    type: String,
    default() {
      return 'bar'
    }
  },
  label: String,
  hideLabel: Boolean,
  // 子标题
  subText: String,
  // 标题高级设置
  titleProps: Object,
  // 图例
  legend: Object,
  // 数据源entityReader
  // 基于该entityReader加载的数据存储到dataset的source中
  // 基于该entityReader加载的元数据存储到dataset的dimensions中
  entityReader: {
    type: Object as PropType<EntityReader>,
    required: true
  },
  // dataSource: Object,
  /**
   *  {name:string,type:string,displayName:string}
   */
  // dimensions: Object,
  ...mixins.props
})
// const mv = ref(props.modelValue)
// watch(mv, () => {
//   emits('update:modelValue', mv.value)
// })

const glChart = ref()
// 基于准备好的dom，初始化echarts实例
let myChart: EChartsType | undefined = undefined

/**
 *  构建chart的标题配置
 */
const title = computed(() => {
  let result = {
    text: props.label,
    show: props.hideLabel !== true,
    subtext: props.subText,
    triggerEvent: true
  }
  Object.assign(result, props.titleProps)

  return result
})

// const dataset = {
//   dimensions: ['product', '2015', '2016', '2017'],
//   // 实体查询的返回数据集合
//   source: [
//     { product: '衬衫', '2015': 100, '2016': 120, '2017': 180 },
//     { product: '裤子', '2015': 110, '2016': 220, '2017': 190 }
//   ]
// }

const init = ()=> {
  props.entityReader?.fields?.forEach((field) => {
    field.alias = field.alias || field.title
  })
}


const getSeries = () => {
  let len = props.entityReader?.fields?.length || 0
  let result: any[] = []
  for (let i = 0; i < len - 1; i++) {
    result.push({ type: props.type })
  }
  return result
}

const getDimensions = () => {
  let ary: string[] = []
  props.entityReader?.fields?.forEach((field) => {
    console.log('field:', field)
    ary.push(field.alias)
  })
  return ary
}

const source:Record<string, any>[]= []

const getOption = () => {
  return {
    title: title.value,
    legend: props.legend,
    tooltip: {},
    xAxis: {
      type: 'category'
    },
    dataset: {
      dimensions: getDimensions(),
      source:source
    },
    yAxis: {},
    series: getSeries()
  }
}

const reRender = () => {
  const options = getOption()
  console.log('options:', options)
  myChart?.clear()
  myChart?.setOption(options, true)
}
watch(
  () => {
    return { title, legend: props.legend }
  },
  () => {
    reRender()
  },
  { deep: true }
)
// 设计时，监听数据变化，重新渲染
if (!props.glIsRuntime) {
}

const resize = () => {
  console.log('resize')
  myChart?.resize()
}

const divResizeResizeObserver = new ResizeObserver(resize)

const click = (params: any) => {
  console.log('click my chart params:', params)
}

const fetchData = () => {
  if (!props.entityReader || !props.entityReader.entity) {
    return
  }
  entityApi
    .queryByEntityReader(props.entityReader)
    .then((res) => {
      // dataset: {
      //   // 用 dimensions 指定了维度的顺序。直角坐标系中，如果 X 轴 type 为 category，
      //   // 默认把第一个维度映射到 X 轴上，后面维度映射到 Y 轴上。
      //   // 如果不指定 dimensions，也可以通过指定 series.encode完成映射。
      //   dimensions: ['product', '2015', '2016', '2017'],
      //   source: [
      //     { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
      //     { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
      //     { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
      //     { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 }
      //   ]
      // },
      source.length = 0
      source.push(...(res.data || []))
      reRender()
    })
    .catch((err) => {
      console.log(err)
      global.$notification.error('数据加载失败')
    })
    .finally(() => {})
}

onMounted(() => {
  if (!myChart) {
    myChart = echarts.init(glChart.value)!
    // 绘制图表
    myChart?.setOption(getOption())
    window.addEventListener('resize', resize)
    divResizeResizeObserver.observe(glChart.value)
    myChart.on('click', click)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  myChart?.off('click', click)
  if (glChart.value) {
    // 在设计时直接删除组件时，value为null，该场景需要排除
    divResizeResizeObserver.unobserve(glChart.value)
  }
})

init()
fetchData()

defineExpose({})
</script>

<template>
  <div class="gl-chart" ref="glChart" style="width: 100%; height: 400px"></div>
</template>

<style scoped></style>
