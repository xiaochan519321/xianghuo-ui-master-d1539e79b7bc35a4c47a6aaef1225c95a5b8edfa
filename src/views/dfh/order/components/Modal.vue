<template>
    <div class="modal-components">
        <el-dialog-custom :width="width" :visible="visible_" @close="onClose">
            <div class="wrapper" :style="`height: ${height}`" v-if="visible_" v-loading="loading">
                <div class="header">
                    <p class="title">{{ title }}</p>
                    <i class="iconfont icon-close2" @click.stop="onClose"></i>
                </div>
                <div class="content">
                    <slot name="content"></slot>
                </div>
                <div class="footer">
                    <div class="flex items-center">
                        <el-button class="btn" @click.stop="onClose">
                            <span>取消</span>
                        </el-button>
                        <el-button class="btn" type="primary" @click.stop="onClickConfirm">
                            <span>确定</span>
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog-custom>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ElDialogCustom from '@/components/base/ElDialogCustom';

export default {
    components: {
        ElDialogCustom,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '',
        },
        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: String,
            default: '',
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {

        };
    },
    computed: {
        ...mapGetters([

        ]),
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
            },
        },
    },
    methods: {
        /**
         * 关闭弹窗
         */
        onClose() {
            this.visible_ = false;
        },
        onClickConfirm() {
            this.$emit('confirm');
        },
    },
};
</script>

<style lang="scss" scoped>
.modal-components {
    .wrapper {
        width: 100%;
        background: #ffffff;
        border-radius: 8px;
        color: #666666;
        position: relative;
        .header {
            background: #fff;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 63px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 0 28px;
            border-bottom: 1px solid #dedede;

            .title {
                font-size: 18px;
                font-weight: 600;
            }

            .icon-close2 {
                font-size: 28px;
                cursor: pointer;
            }
        }
        .content {
            position: absolute;
            top: 63px;
            left: 0;
            width: 100%;
            height: calc(100% - 143px);
            overflow-x: hidden;
            overflow-y: auto;
            padding-bottom: 20px;
            box-sizing: border-box;
            &::-webkit-scrollbar {
                width: 8px;
                height: 8px;
                background-color: #fff;
            }

            /* 滚动槽 */
            &::-webkit-scrollbar-track {
                border-radius: 10px;
            }

            /* 滚动条滑块 */
            &::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background: #cccccc;
            }

            scrollbar-color: #cccccc #fff;
            scrollbar-width: thin;
        }
        .footer {
            background: #fff;
            position: absolute;
            bottom: 0;
            left: 0;
            border-top: 1px solid #dedede;
            box-sizing: border-box;
            width: 100%;
            height: 80px;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            padding-right: 28px;

            .btn {
                width: 80px;
            }
        }
    }
}
</style>
