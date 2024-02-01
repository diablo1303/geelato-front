import {ComponentMeta, ComponentInstance} from "@geelato/gl-ui-schema";
import ButtonMeta from "./setter-arco/button/ButtonMeta";
import ButtonInstance from "./setter-arco/button/ButtonInstance";
import RateMeta from "./setter-arco/rate/RateMeta";
import SwitchMeta from "./setter-arco/switch/SwitchMeta";
import AutoCompleteMeta from "./setter-arco/autoComplete/AutoCompleteMeta";
import DividerMeta from "./setter-arco/divider/DividerMeta";
import IconMeta from "./setter-arco/icon/IconMeta";
import TypographyMeta from "./setter-arco/typography/TypographyMeta";
import AffixMeta from "./setter-arco/affix/AffixMeta";
import BreadcrumbMeta from "./setter-arco/breadcrumb/BreadcrumbMeta";
import DropdownMeta from "./setter-arco/dopdown/DropdownMeta";
import MenuMeta from "./setter-arco/menu/MenuMeta";
import PageHeaderMeta from "./setter-arco/pageHeader/PageHeaderMeta";
import PaginationMeta from "./setter-arco/pagination/PaginationMeta";
import StepsMeta from "./setter-arco/steps/StepsMeta";
import CascaderMeta from "./setter-arco/cascader/CascaderMeta";
import CascaderInstance from "./setter-arco/cascader/CascaderInstance";
import CheckboxGroupMeta from "./setter-arco/checkbox/CheckboxGroupMeta";
import CheckboxGroupGroupInstance from "./setter-arco/checkbox/CheckboxGroupInstance";
import DatePickerMeta from "./setter-arco/datePicker/DatePickerMeta";
import FormInstance from "./setter-arco/form/FormInstance";
import InputMeta from "./setter-arco/input/InputMeta";
import InputNumberMeta from "./setter-arco/inputNumber/InputNumberMeta";
import MentionsMeta from "./setter-arco/mentions/MentionsMeta";
import SelectMeta from "./setter-arco/select/SelectMeta";
import ASelectMeta from "./setter-arco/select/ASelectMeta";
import SliderMeta from "./setter-arco/slider/SliderMeta";
import TimePickerMeta from "./setter-arco/timePicker/TimePickerMeta";
import TransferMeta from "./setter-arco/transfer/TransferMeta";
import TreeSelectMeta from "./setter-arco/treeSelect/TreeSelectMeta";
import UploadMeta from "./setter-arco/upload/UploadMeta";
import AvatarMeta from "./setter-arco/avatar/AvatarMeta";
import BadgeMeta from "./setter-arco/badge/BadgeMeta";
import CalendarMeta from "./setter-arco/calendar/CalendarMeta";
import CardMeta from "./setter-arco/card/CardMeta";
import CardInstance from "./setter-arco/card/CardInstance";
import CarouselMeta from "./setter-arco/carousel/CarouselMeta";
import CollapseMeta from "./setter-arco/collapse/CollapseMeta";
import CommentMeta from "./setter-arco/comment/CommentMeta";
import DescriptionsMeta from "./setter-arco/descriptions/DescriptionsMeta";
import EmptyMeta from "./setter-arco/empty/EmptyMeta";
import ImageMeta from "./setter-arco/image/ImageMeta";
import ListMeta from "./setter-arco/list/ListMeta";
import TinymceMeta from "./setter-arco/tinymce/TinymceMeta";
import PopoverMeta from "./setter-arco/popover/PopoverMeta";
import StatisticMeta from "./setter-arco/statistic/StatisticMeta";
import TableMeta from "./setter-arco/table/TableMeta";
import TableInstance from "./setter-arco/table/TableInstance";
import TableSubMeta from "./setter-arco/table/TableSubMeta";
import TableSubInstance from "./setter-arco/table/TableSubInstance";
import TabsMeta from "./setter-arco/tabs/TabsMeta";
import TagMeta from "./setter-arco/tag/TagMeta";
import TimelineMeta from "./setter-arco/timeLine/TimelineMeta";
import TooltipMeta from "./setter-arco/tooltip/TooltipMeta";
import EntityTreeMeta from "./setter-arco/tree/EntityTreeMeta";
import PageMeta from "./setter-arco/page/PageMeta";
import DndPlaceholderMeta from "./setter-arco/dndPlaceholder/DndPlaceholderMeta";
import FormMeta from "./setter-arco/form/FormMeta";
import TextAreaMeta from "./setter-arco/textarea/TextAreaMeta";
import ColorMeta from "./setter-arco/color/ColorMeta";
import RowColLayoutMeta from "./setter-arco/row-col-layout/RowColLayoutMeta";
import RowColLayoutInstance from "./setter-arco/row-col-layout/RowColLayoutInstance";
import RadioGroupMeta from "./setter-arco/radio/RadioGroupMeta";
import RadioGroupInstance from "./setter-arco/radio/RadioGroupInstance";
import UserSelectMeta from "./setter-arco/user-select/UserSelectMeta";
import VirtualMeta from "./setter-arco/virtual/VirtualMeta";
import HiddenAreaMeta from "./setter-arco/hidden-area/HiddenAreaMeta";
import HiddenAreaInstance from "./setter-arco/hidden-area/HiddenAreaInstance";
import DictMeta from "./setter-arco/dict/dictMeta";
import DynamicSelectMeta from "./setter-arco/select/DynamicSelectMeta";
import EncodeMeta from "./setter-arco/encode/EncodeMeta";
import RefPageMeta from "./setter-arco/page/RefPageMeta";
import {commonPropsDataEntry, commonPropsOther, commonActions} from "./setter-arco/CommonProperties";
import TextMeta from "./setter-arco/text/TextMeta";
import AlertMeta from "./setter-arco/alert/AlertMeta";
import MultiComponentsMeta from "./setter-arco/multiComponents/multiComponentsMeta";
import GlButtonMeta from "./setter-arco/button/GlButtonMeta";
import OpRecordMeta from "./setter-arco/op-record/OpRecordMeta";
import RangePickerMeta from "./setter-arco/datePicker/RangePickerMeta";
import BlocksMeta from "./setter-arco/blocks/BlocksMeta";
import LayoutPageMeta from "./setter-arco/layout-page/LayoutPageMeta";
import LayoutPageInstance from "./setter-arco/layout-page/LayoutPageInstance";
import LoopMeta from "./setter-arco/loop/LoopMeta";
import LoopInstance from "./setter-arco/loop/LoopInstance";
import TemplateMeta from "./setter-arco/template/TemplateMeta";
import TemplateInstance from "./setter-arco/template/TemplateInstance";
import FlowEditorMeta from "./setter-arco/flow-editor/FlowEditorMeta";
import PageTemplateFlowMeta from "./setter-arco/page-template/PageTemplateFlowMeta";
import PageTemplateFlowInstance from "./setter-arco/page-template/PageTemplateFlowInstance";
import SpaceMeta from "./setter-arco/space/SpaceMeta";
import SpaceInstance from "./setter-arco/space/SpaceInstance";

// @ts-ignore
const componentMetas: Array<ComponentMeta> = [TextMeta, FormMeta, InputMeta, InputNumberMeta, EncodeMeta, DictMeta, DynamicSelectMeta, SelectMeta,ASelectMeta, RadioGroupMeta, CheckboxGroupMeta, DatePickerMeta, TimePickerMeta,RangePickerMeta, SwitchMeta, TinymceMeta,UserSelectMeta, UploadMeta, TableSubMeta, TextAreaMeta, RateMeta, ColorMeta, MultiComponentsMeta,ButtonMeta, GlButtonMeta, TableMeta, AlertMeta, CalendarMeta, IconMeta, TypographyMeta, RowColLayoutMeta,LayoutPageMeta,
    SpaceMeta,AffixMeta, BreadcrumbMeta, DropdownMeta, MenuMeta, PageHeaderMeta, PaginationMeta, StepsMeta, AutoCompleteMeta,
    CascaderMeta, MentionsMeta, SliderMeta, TransferMeta, TreeSelectMeta, AvatarMeta, BadgeMeta, RefPageMeta,
    CardMeta, CarouselMeta, CollapseMeta, CommentMeta, DescriptionsMeta, EmptyMeta, ImageMeta, ListMeta, PopoverMeta,
    StatisticMeta, TabsMeta, TagMeta, TimelineMeta, TooltipMeta, EntityTreeMeta, PageMeta, DndPlaceholderMeta, VirtualMeta, HiddenAreaMeta,LoopMeta,TemplateMeta, DividerMeta,
    OpRecordMeta,BlocksMeta,FlowEditorMeta,PageTemplateFlowMeta
]
// @ts-ignore
const customInstances: Array<ComponentInstance> = [ButtonInstance,SpaceInstance, TableInstance, TableSubInstance, CardInstance, HiddenAreaInstance, FormInstance, RowColLayoutInstance, RadioGroupInstance, CheckboxGroupGroupInstance, CascaderInstance,LayoutPageInstance,TemplateInstance,LoopInstance,PageTemplateFlowInstance]
const componentInstances: Array<ComponentInstance> = []
const dataEntryNameMap: { [key: string]: boolean } = {}
// 不在sidebar中出现的组件
// @ts-ignore
// const ignoreInstances: Array<ComponentMeta> = [DndPlaceholderMeta, VirtualMeta,ButtonMeta,ASelectMeta]
// 不需要自动添加公共属性的组件
const ignoreCommonPropertiesComponents = ['GlEntityTableSub', 'GlHiddenArea']
// 对于没有个性化的实例，即没有个性编码配置的实例，采用以下程序构建的默认实例信息
for (const index in componentMetas) {
    const meta = componentMetas[index]

    //  设置僵入组件公共属性
    if (meta.group === 'dataEntry') {
        if (ignoreCommonPropertiesComponents.indexOf(meta.componentName) === -1) {
            commonPropsDataEntry.forEach((commonProperty) => {
                const foundProperty = meta.properties.find((property) => {
                    return property.name === commonProperty.name
                })
                if (!foundProperty) {
                    meta.properties.push(commonProperty)
                }
            })
        }
    } else {
        if (ignoreCommonPropertiesComponents.indexOf(meta.componentName) === -1) {
            commonPropsOther.forEach((commonProperty) => {
                const foundProperty = meta.properties.find((property) => {
                    return property.name === commonProperty.name
                })
                if (!foundProperty) {
                    meta.properties.push(commonProperty)
                }
            })
        }

    }

    // 设置组件的加载完成事件
    meta.actions = meta.actions || []
    meta.actions.push(...commonActions)


    let inst = customInstances.find((item: ComponentInstance) => {
        return item.componentName === meta.componentName
    })
    if (!inst) {
        inst = new ComponentInstance()
        inst.componentName = meta.componentName
        inst.props = {
            "label": meta.title,
        }
        inst.slots = {}
        inst.children = []
    }

    // if (ignoreInstances.findIndex((componentMeta: ComponentMeta) => {
    //     return meta.componentName === componentMeta.componentName
    // }) !== -1) {
    // }

    componentInstances.push(inst)
    // 设置input表单项
    if (meta.group === 'dataEntry') {
        dataEntryNameMap[meta.componentName] = true
    }
}
/**
 * 检查组件是否为表单输入项
 * @param componentName
 */
const isDataEntry = (componentName: string) => {
    return !!dataEntryNameMap[componentName]
}
const schemaArco = {componentMetas, componentInstances}
export {schemaArco, isDataEntry}