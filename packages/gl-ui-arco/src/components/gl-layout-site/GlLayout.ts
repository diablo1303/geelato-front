export enum LayoutMode {
    Sidebar = 0,
    Collapse = 1,
    TopNav = 2
}

export class LayoutLogo{
    enabled:boolean = true
    componentName:string = 'img'
    props: Record<string, any>  = {src:''}
}

export class LayoutToolbar{
    enabled:boolean = false
    title:string = ''
    actions:[] = []
}

export class LayoutNavigation{
    enabled:boolean = false
    startOpen:boolean = false
    items:[] = []
}

export class LayoutConfig {
    // 导航菜单
    navigation:any =  {
        enabled: true,
        startOpen: true,
        logo: {
            component: 'TairoLogo',
            props: { class: 'text-primary-600 h-10' },
        },
        items: [],
    }
    toolbar: LayoutToolbar = new LayoutToolbar()
}
