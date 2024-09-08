
import clickoutside from './clickoutside';
import { drag } from './drag';
import spin from '@/components/extend/loading/index';

/**
 * vue自定义指令
 * @returns 焦点必须在实时DOM树中 v-click
 */
const directives = {
    clickoutside,
    spin,
    drag
}

export default {
    install(Vue) {
        Object.keys(directives).forEach((key) => {
            Vue.directive(key, directives[key]);
        });
    }
}
