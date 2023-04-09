import ComponentInstance from "../ComponentInstance";

export default class BlockInstance extends ComponentInstance{
    id: string = ''
    componentName: string = ''
    title: string = ''
    props: object = {}
    children: Array<BlockInstance> = []
}