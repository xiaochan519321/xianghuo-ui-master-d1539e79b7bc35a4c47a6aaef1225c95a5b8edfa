<template>
    <div class="empty-container flex flex-col justify-center items-center">
        <div class="empty-main">
            <p class="font14 col-g">
                <span>{{ text }}</span>
            </p>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        text: {
            type: String,
            default: '暂无相关数据',
        },
        height: {
            type: String,
            default: '100%',
        },
    },
    data() {
        return {

        };
    },
    methods: {

    },
};
</script>

<style lang="scss" scoped>
.empty-container {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
    .empty-main {
        width: 196px;
        height: 100%;
        background: url("/img/no-data.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: top;
        text-align: center;
        padding-top: 131px;
    }
}
</style>
