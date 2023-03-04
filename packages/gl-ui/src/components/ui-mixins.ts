export default {
    props: {
        fieldId: {
            type: [String, Number]
        },
        className: {
            type: String,
            default() {
                return ''
            }
        },
        '__style__': {
            type: String,
            default() {
                return ''
            }
        }
    }
}
