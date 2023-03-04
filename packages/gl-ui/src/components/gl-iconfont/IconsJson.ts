export class IconsJson {
    id:string =  '2457479'
    name:string = 'geelato'
    font_family:string =  'iconfont'
    css_prefix_text:string =  'gl-'
    description:string =  ''
    glyphs:Array<IconFont> = []
}

class IconFont{
    icon_id:string = ''
    name:string = ''
    font_class:string = ''
    unicode:string = ''
    unicode_decimal:number = 0
}