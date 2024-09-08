<template>
    <div class="container">
        <el-dialog title="修改登录密码" :visible.sync="visible_" width="30%" :before-close="handleClose">
            <div class="content">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-form-item label="原密码：" size="medium" prop="password">
                        <el-input
                            class="input-box"
                            v-model="form.password"
                            type="text"
                            placeholder="请输入原密码"
                        />
                    </el-form-item>
                    <el-form-item label="新密码：" prop="newpassword1">
                        <el-input
                            class="input-box"
                            size="medium"
                            v-model="form.newpassword1"
                            type="text"
                            placeholder="请输入新密码"
                        />
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="newpassword2">
                        <el-input
                            class="input-box"
                            size="medium"
                            v-model="form.newpassword2"
                            type="text"
                            placeholder="请再次输入密码"
                        />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click.stop="visible_ = false">取 消</el-button>
                <el-button type="primary" @click="onReset">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { editInfo } from "@/api/admin/user";

export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        const validatePhone = (rule, value, callback) => {
            //   if (value === '') {
            //     callback(new Error('手机号码不能为空'));
            //   } else if (isPhone(value)) {
            //     callback(new Error('请输入正确的手机号码'));
            //   } else {
            //     callback();
            //   }
        };
        const validatePassword = (rule, value, callback) => {
            const pattern = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/;
            if (value === '') {
                callback(new Error('密码不能为空'));
            } else if (value.length < 6) {
                callback(new Error('请输入8-16位密码'));
            } else if (pattern.test(value)) {
                callback(new Error('密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位'));
            } else {
                callback();
            }
        };
        const validateConfirmPassword = (rule, value, callback) => {
            if ((value === '' || this.form.newpassword1 !== value)) {
                callback(new Error('两次密码不一致'));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            form: {
                password: '',
                newpassword1: '',
                newpassword2: '',
            },
            rules: {
                password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
                phone: [{ validator: validatePhone, trigger: 'blur' }],
                newpassword1: [{ required: true, validator: validatePassword, trigger: 'blur' }],
                newpassword2: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
            },
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo
        }),
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
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
        onReset() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    const data = { ...this.form };
                    //   data.
                    console.log('form', this.form);
                    editInfo(this.form).then((response) => {
                        this.$notify.success("修改成功");
                        // 修改后注销当前token,重新登录
                        this.$store.dispatch("LogOut").then(() => {
                            location.reload();
                        });
                    });
                }
            });

        }
    },
};
</script>

<style lang="scss" scoped>
.container {
    // font-size: 18px;
    color: #3b4859;
    font-weight: 700;
    .el-dialog__title {
        color: #3b4859;
    }
    .content {
        &::v-deep .el-form-item__label {
            color: #3b4859;
            font-weight: 700;
        }
        &::v-deep .el-input__inner {
            color: #3b4859;
            font-weight: 700;
        }
        &::v-deep .el-form-item__content {
            height: 40px;
            line-height: 40px;
        }
    }
}
</style>
