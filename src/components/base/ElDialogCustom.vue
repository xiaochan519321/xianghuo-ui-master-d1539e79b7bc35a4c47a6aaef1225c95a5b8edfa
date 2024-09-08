<template>
    <div class="el-dialog-custom-container">
        <el-dialog
            class="my-dialog"
            top="0"
            :fullscreen="fullscreen"
            :visible.sync="visible_"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :width="width"
            :lock-scroll="lockScroll"
            :modal-append-to-body="modalAppendToBody"
        >
            <slot></slot>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        width: {
            type: String,
            default: '600px',
        },
        visible: {
            type: Boolean,
            default: false,
        },
        lockScroll: {
            type: Boolean,
            default: false,
        },
        modalAppendToBody: {
            type: Boolean,
            default: true,
        },
        fullscreen: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        };
    },
    computed: {
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

    },
};
</script>

<style lang="scss" scoped>
.el-dialog-custom-container {
    > .my-dialog {
        ::v-deep .el-dialog {
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0);
        }
        ::v-deep .el-dialog {
            background: transparent;
            top: 50%;
            transform: translateY(-50%);
        }
        ::v-deep .el-dialog__header {
            display: none;
        }
        ::v-deep .el-dialog__body {
            padding: 0;
            box-sizing: border-box;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }
        &::-webkit-scrollbar {
            display: none;
        }
    }
}
</style>
