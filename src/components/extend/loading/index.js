import { dataTool } from 'echarts';
import Vue from 'vue';
import Spin from './Spin';

// 使用loading组件配置项创建vue子类构造函数
const Mask = Vue.extend(Spin);

const toggleLoading = (el, binding) => {
    if (binding.value) {
        Vue.nextTick(() => {
            el.classList.add('relative');
            insertDom(el, el, binding);
        });
    } else {
        el.instance.visible = false;
    }
}

// 将对应的 loading组件渲染出来的dom插入到parent对应的dom上
const insertDom = (parent, el, binding) => {
    el.instance.visible = true;
    if (binding.arg) el.instance.size = binding.arg || 'medium';
    parent.appendChild(el.mask);
}

export default {
    bind: (el, binding) => {
        const mask = new Mask({
            el: document.createElement('div'),
            data() { },
        });
        el.instance = mask;
        el.mask = mask.$el;
        el.maskStyle = {};
        binding.value && toggleLoading(el, binding);
    },
    update: (el, binding) => {
        if (binding.oldValue !== binding.value) {
            toggleLoading(el, binding);
        }
    },
    unbind: (el, binding) => {
        el.instance & el.instance.$destroy();
        el = null;
    }
}
