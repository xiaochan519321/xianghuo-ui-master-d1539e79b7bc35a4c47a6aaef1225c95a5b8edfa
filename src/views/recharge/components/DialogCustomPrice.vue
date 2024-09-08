<template>
    <div class="container">
        <el-dialog title="自定义充值金额" :visible.sync="visible_" width="30%" :before-close="handleClose">
            <div class="content">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="充值金额：" size="medium" prop="price">
                        <el-input
                            class="input-box"
                            v-model="form.price"
                            type="text"
                            placeholder="请输入充值金额"
                            v-focus
                            @keyup.enter.native="onConfirm"
                        />
                        <p class="desc">
                            <span>充值金额最低500元</span>
                        </p>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click.stop="visible_ = false">取 消</el-button>
                <el-button type="primary" @click="onConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            form: {
                price: null,
            },
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
            }
        }
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.querySelector("input").focus();
            }
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        handleClose() {
            this.$emit('close');
        },
        onConfirm() {
            const { form } = this;
            if (form.price && form.price >= 500) {
                this.loading = true;
                this.$emit('onPay', null, this.form.price);
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.container {
    color: #3b4859;
    font-weight: 700;
    .el-dialog__title {
        color: #3b4859;
    }
    .content {
        .desc {
            color: #f56c6c;
            font-weight: 500;
        }
    }
}
</style>
