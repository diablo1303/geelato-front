import ButtonMeta from "./setter-arco/button/ButtonMeta";
import ButtonInstance from "./setter-arco/button/ButtonInstance";
import RateMeta from "./setter-arco/rate/RateMeta";
import SwitchMeta from "./setter-arco/switch/SwitchMeta";
import AutoCompleteMeta from "./setter-arco/autoComplete/AutoCompleteMeta";
import AutoCompleteInstance from "./setter-arco/autoComplete/AutoCompleteInstance";
import DividerMeta from "./setter-arco/divider/DividerMeta";
import IconMeta from "./setter-arco/icon/IconMeta";
import TypographyMeta from "./setter-arco/typography/TypographyMeta";
import AffixMeta from "./setter-arco/affix/AffixMeta";
import AffixInstance from "./setter-arco/affix/AffixInstance";
import BreadcrumbMeta from "./setter-arco/breadcrumb/BreadcrumbMeta";
import DropdownMeta from "./setter-arco/dopdown/DropdownMeta";
import MenuMeta from "./setter-arco/menu/MenuMeta";
import PageHeaderMeta from "./setter-arco/pageHeader/PageHeaderMeta";
import PaginationMeta from "./setter-arco/pagination/PaginationMeta";
import StepsMeta from "./setter-arco/steps/StepsMeta";
import CascaderMeta from "./setter-arco/cascader/CascaderMeta";
import CheckboxMeta from "./setter-arco/checkbox/CheckboxMeta";
import DatePickerMeta from "./setter-arco/datePicker/DatePickerMeta";
import FormInstance from "./setter-arco/form/FormInstance";
import InputMeta from "./setter-arco/input/InputMeta";
import InputNumberMeta from "./setter-arco/inputNumber/InputNumberMeta";
import MentionsMeta from "./setter-arco/mentions/MentionsMeta";
import SelectMeta from "./setter-arco/select/SelectMeta";
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
import PopoverMeta from "./setter-arco/popover/PopoverMeta";
import StatisticMeta from "./setter-arco/statistic/StatisticMeta";
import TableMeta from "./setter-arco/table/TableMeta";
import TableInstance from "./setter-arco/table/TableInstance";
import TabsMeta from "./setter-arco/tabs/TabsMeta";
import TagMeta from "./setter-arco/tag/TagMeta";
import TimelineMeta from "./setter-arco/timeLine/TimelineMeta";
import TimelineItemMeta from "./setter-arco/timeLine/TimelineItemMeta";
import TooltipMeta from "./setter-arco/tooltip/TooltipMeta";
import TreeMeta from "./setter-arco/tree/TreeMeta";
import {ComponentMeta, ComponentInstance, ComponentMaterial} from "@geelato/gl-ui-schema";
import PageMeta from "./setter-arco/page/PageMeta";
import DndPlaceholderMeta from "./setter-arco/dndPlaceholder/DndPlaceholderMeta";
import FormMeta from "./setter-arco/form/FormMeta";
import TextAreaMeta from "./setter-arco/textarea/TextAreaMeta";
import ColorMeta from "./setter-arco/color/ColorMeta";
import RowColLayoutMeta from "./setter-arco/row-col-layout/RowColLayoutMeta";
import RowColLayoutInstance from "./setter-arco/row-col-layout/RowColLayoutInstance";
import RadioGroupMeta from "./setter-arco/radio/RadioGroupMeta";
import UserSelectMeta from "./setter-arco/user-select/UserSelectMeta";
import RadioGroupInstance from "./setter-arco/radio/RadioGroupInstance";

// @ts-ignore
const componentMetas: Array<ComponentMeta> = [ButtonMeta, IconMeta, FormMeta, InputMeta, InputNumberMeta, TextAreaMeta, RateMeta, RadioGroupMeta, UserSelectMeta, ColorMeta, TableMeta, TypographyMeta, DividerMeta, RowColLayoutMeta,
    AffixMeta, BreadcrumbMeta, DropdownMeta, MenuMeta, PageHeaderMeta, PaginationMeta, StepsMeta, AutoCompleteMeta,
    CascaderMeta, CheckboxMeta, DatePickerMeta, MentionsMeta,
    SelectMeta, SliderMeta, SwitchMeta, TimePickerMeta, TransferMeta, TreeSelectMeta, UploadMeta, AvatarMeta, BadgeMeta,
    CalendarMeta, CardMeta, CarouselMeta, CollapseMeta, CommentMeta, DescriptionsMeta, EmptyMeta, ImageMeta, ListMeta, PopoverMeta,
    StatisticMeta, TabsMeta, TagMeta, TimelineMeta, TimelineItemMeta, TooltipMeta, TreeMeta, PageMeta, DndPlaceholderMeta]

// @ts-ignore
const customInstances: Array<ComponentInstance> = [ButtonInstance, TableInstance, CardInstance, FormInstance, RowColLayoutInstance, RadioGroupInstance]
const componentInstances: Array<ComponentInstance> = []
const dataEntryNameMap: { [key: string]: boolean } = {}
// 对于没有个性化的实例，即没有个性编码配置的实例，采用以下程序构建的默认实例信息
for (const index in componentMetas) {
    const meta = componentMetas[index]
    const foundInstance = customInstances.find((item: ComponentInstance) => {
        return item.componentName === meta.componentName
    })
    if (foundInstance) {
        componentInstances.push(foundInstance)
    } else {
        const componentInstance = new ComponentInstance()
        componentInstance.componentName = meta.componentName
        componentInstance.props = {}
        componentInstance.slots = {}
        componentInstance.children = []
        componentInstances.push(componentInstance)
    }
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