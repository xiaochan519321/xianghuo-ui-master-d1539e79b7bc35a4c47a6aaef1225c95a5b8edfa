<template>
    <div class="avue-logo">
        <div class="logo" @click="goIndex">
            <img v-if="siteConfig.id == 1" src="@/assets/logo-img.png" alt />
            <img v-if="siteConfig.id == 1766060302561169409" src="@/assets/lm-logo.png" alt />
            <img v-if="siteConfig.id == 1813891945346191362" src="@/assets/jj-logo.png" alt />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Logo',
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['keyCollapse', 'siteConfig'])
    },
    methods: {
        goIndex() {
            this.$router.push({ path: "/login" });
        },
    },
    created() {}
}
</script>

<style lang="scss">
.fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-active {
    transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
.avue-logo {
    $height: 64px;
    // position: fixed;
    position: absolute;
    top: -64px;
    left: 0;
    width: 208px;
    height: 64px;
    line-height: 64px;
    font-size: 20px;
    z-index: 1024;
    border-bottom: 1px solid #EAEBEE;
    overflow: hidden;
    .logo-small {
        padding: 0px 30px 0px 16px;
        cursor: pointer;
        text-align: center;
        display: flex;
        align-items: center;
        height: $height;
        width: 54px;
        overflow: hidden;
        img {
            width: 144px;
            max-width: 144px;
        
        }
    }
    .logo {
        padding: 0px 30px 0px 16px;
        cursor: pointer;
        text-align: center;
        display: flex;
        align-items: center;
        height: $height;

        img {
            width: 144px;
        }
    }
}
</style>
