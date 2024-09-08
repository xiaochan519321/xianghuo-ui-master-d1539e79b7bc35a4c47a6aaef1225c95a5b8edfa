<template>
    <div class="dialog-flag-dfh-components">
        <modal
            title="插旗备注"
            width="750px"
            height="400px"
            :visible="visible_"
            :loading="loading"
            @close="onClose"
            @confirm="onConfirm"
        >
            <div class="px30 pt30" slot="content">
                <el-form ref="ruleForm" :model="data" :rules="rules" label-width="70px">
                    <el-form-item label="旗帜：" prop="sellerRemarkStars">
                        <el-radio-group v-model="data.sellerRemarkStars">
                            <el-radio
                                :label="item.value"
                                v-for="(item, index) in flagOptions"
                                :key="index"
                            >
                                <i
                                    class="el-icon-s-flag font16"
                                    :style="`color: ${colors(item.value)}`"
                                ></i>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注：" prop="sellerWords">
                        <el-input
                            type="textarea"
                            :rows="6"
                            max="50"
                            placeholder="备注内容，最大不得超过500个字符"
                            v-model="data.sellerWords"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </modal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Modal from './Modal';

export default {
    components: {
        Modal,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object,
            default: () => {
                return {
                    sellerRemarkStars: '0',
                    sellerWords: '',
                };
            },
        },
    },
    data() {
        return {
            flagOptions: [
                {
                    label: '灰旗',
                    value: '0',
                }, {
                    label: '紫旗',
                    value: '1',
                }, {
                    label: '蓝旗',
                    value: '2',
                }, {
                    label: '绿旗',
                    value: '3',
                }, {
                    label: '橙旗',
                    value: '4',
                }, {
                    label: '红旗',
                    value: '5',
                },
            ],
            rules: {
                sellerRemarkStars: [
                    { required: true, message: '请选择旗色', trigger: 'blur' }
                ],
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
            },
        },
        colors() {
            return function (index) {
                switch (+index) {
                    case 0: return '#808080';
                    case 1: return '#7f6ff6';
                    case 2: return '#70cce2';
                    case 3: return '#66c186';
                    case 4: return '#f08e48';
                    case 5: return '#ed6c72';
                    default:
                        break;
                }
            };
        },
    },
    methods: {
        onClose() {
            this.visible_ = false;
        },
        onConfirm() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.$emit('on-success', this.data);
                }
            })
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
