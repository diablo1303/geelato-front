import GlButton from "./GlButton.vue";
import type {App} from "vue";

export default {
    install: (app: App) => {
        app.component(GlButton.name, GlButton);
    }
}