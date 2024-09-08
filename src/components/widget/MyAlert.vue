<template>
    <div class="my-alert--components" v-if="visible">
        <div class="wrapper">
            <div class="lbox">
                <i class="el-icon-warning-outline"></i>
                <span>{{ content }}</span>
            </div>
            <i class="el-icon-error" v-if="closable" @click.stop="visible = false"></i>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: String,
            default: '',
        },
        closable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            visible: true,
        };
    },
}
</script>

<style lang="scss" scoped>
.my-alert--components {
    .wrapper {
        width: 100%;
        height: 33px;
        background: #fef2d9;
        border-radius: 4px;
        color: #666666;
        font-size: 12px;
        padding: 0 25px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .lbox {
            display: flex;
            align-items: center;
        }

        .el-icon-warning-outline {
            color: #f89f1b;
            font-size: 18px;
            margin-right: 10px;
            font-weight: 600;
        }
        .el-icon-error {
            color: #666666;
            font-size: 18px;
            cursor: pointer;
        }
    }
}
</style>
