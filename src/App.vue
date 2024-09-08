<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { handleImg } from '@/util/util'
import { setStore } from '@/util/store'
import { mapGetters } from 'vuex'

export default {
    name: 'App',
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters(['siteConfig'])
    },
    watch: {},
    created() {
        console.log('v1.2.1')
    },
    mounted() {
        // const siteData = this.$locStore.getStore({ name: 'siteConfig' });
        // if (!siteData) {
        //     this.initData();
        // }
        this.initData();
    },
    methods: {
        /**
         * 初始化 获取站点配置信息
        */
        initData() {
            this.$store.dispatch('GetSiteConfig', { type: true }).then(siteData => {
                if (siteData.icon) {
                    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                    link.rel = 'shortcut icon';
                    link.href = siteData.icon;
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
                if (siteData.name) {
                    document.title = siteData.name;
                    // if(window.location.host == 'www.dppdf.cn'){
                    //     document.title = "丰城市玄公网络科技有限公司";
                    // }
                    // if(window.location.host  == 'test2.yunpaipai.com.cn'){
                    //     document.title = "老梦一键下单";
                    // }
                }
            });
        },
    }
}
</script>
<style lang="scss">
@import url(//at.alicdn.com/t/font_3382884_jrw6a1s4zta.css);
@import './styles/font/font.css';
#app {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
body {
    min-width: 1380px;
    
    @media screen and (max-width: 1380px) {
        overflow-x: scroll;
        overflow-y: hidden;
    }
}
.avue-sidebar {
    width: auto !important;
}
</style>
