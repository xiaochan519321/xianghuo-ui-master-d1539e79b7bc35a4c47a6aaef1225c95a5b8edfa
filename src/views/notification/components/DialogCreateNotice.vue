<template>
    <div class="container">
        <el-dialog title="创建通知" :visible.sync="visible_" width="40%" :before-close="handleClose">
            <div class="content">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <!-- 操作选项 -->
                    <el-row :gutter="20">
                        <el-col>
                            <el-form-item label="操作选项：" prop="noticeType">
                                <el-select v-model="form.noticeType" placeholder="通知类型" clearable>
                                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in typeList" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 通知成员 -->
                    <el-row :gutter="20" v-if="form.noticeType">
                        <el-col>
                            <el-form-item label="通知成员：">
                                <el-cascader
                                    class="mr15"
                                    v-if="form.noticeType == 5"
                                    key="multipleCascader"
                                    :options="sitesOptions"
                                    :props="{ multiple: true, emitPath: false }"
                                    placeholder="全部站点"
                                    :show-all-levels="false"
                                    v-model="bindSelectSite"
                                    collapse-tags
                                    clearable
                                    @change="selectSite"
                                ></el-cascader>
                                <template v-else>
                                    <el-cascader
                                        class="mr15"
                                        key="radioCascader"
                                        :options="sitesOptions"
                                        :props="{ checkStrictly: true, emitPath: false }"
                                        placeholder="全部站点"
                                        :show-all-levels="false"
                                        v-model="bindSelectSite"
                                        filterable
                                        clearable
                                        @change="selectSite"
                                    ></el-cascader>
                                    <el-select
                                        class="mr15"
                                        v-model="params.userId"
                                        clearable
                                        :disabled="params.tenantId===''"
                                        @clear="fetchData"
                                        @change="fetchData"
                                        placeholder="全部商家"
                                    >
                                        <el-option
                                            v-for="item in merchantOptions"
                                            :key="item.userId"
                                            :label="item.merchantName"
                                            :value="item.userId"
                                        ></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 发布时间 -->
                    <el-row :gutter="20">
                        <el-col>
                            <div class="flex">
                                <el-form-item label="发布状态：">
                                    <el-switch
                                        v-model="form.publishNow"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-text="立即发布"
                                        inactive-text="定时发布"
                                    ></el-switch>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row v-if="!form.publishNow">
                        <el-col :span="15">
                            <el-form-item
                                label="发布时间："
                                prop="publishTime"
                            >
                                <el-date-picker
                                    v-model="form.publishTime"
                                    type="datetime"
                                    :picker-options="pickerOption"
                                    placeholder="请选择发布日期时间"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 通知标题 -->
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="通知标题：" prop="title">
                                <el-input v-model="form.title" placeholder="请输入通知标题" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 通知内容 -->
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="通知内容：" prop="content">
                                <el-input
                                    type="textarea"
                                    :rows="8"
                                    v-model="form.content"
                                    placeholder="请输入通知内容"
                                    clearable
                                    maxlength="1024"
                                    show-word-limit
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click.stop="handleClose">取 消</el-button>
                <el-button type="primary" @click.stop="submit">发 布</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { remote } from '@/api/admin/dict'
import { mapGetters } from 'vuex';
import { dateFormat } from '@/filters/'

export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    watch: {
        'form.noticeType': {
            handler (val, oldVal) {
                this.bindSelectSite = ''
                this.params.tenantId = ''
                if (val == 5) {
                    this.params.userId = ''
                }
            }
        }
    },
    data() {
        return {
            dialogVisible: true,
            // 站点选项
            sitesOptions: [],
            // 商家下拉框
            merchantOptions: [],

            // 查询参数
            params: {
                userId: '',
                tenantId: '', // 仅管理员登录时调用接口，后端才效验
            },
            // 1 notifyAllUser (通知所有用户) 如果为 true 不需要传 members 对象
            // members: [
            //     {
            //         tenantId: "1",
            //         userIds: [1]
            //     }
            // 2 publishNow true 为 立即发布，如果是 false 需要传 publishTime （发布时间）
            form: {
                title: '',
                content: '',
                noticeType: null,
                publishTime: '',
                publishNow: true,
                notifyAllTenant: true,
                members: [
                    {
                        notifyAllUser: true,
                        tenantIds: [],
                        userIds: [],
                    }
                ]
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                    { min: 5, max: 1024, message: '长度在 5 到 1024 个字符', trigger: 'blur' }
                ],
                publishTime: [{ required: true, message: '请选择发布日期时间', trigger: 'change' }],
                noticeType: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
            },
            typeList: [],
            pickerOption: {
                disabledDate(time) {
                    return time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
                },
            },
            bindSelectSite: ''
        };
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ]),
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
            }
        },
    },
    created() {
        this.onLoadType()
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        // 获取通知类型字典
        async onLoadType () {
            const { data } = await remote('notice_type')
            console.log('data', data)
            this.typeList = data.data || []
        },
        async fetchData() {
            this.loading = true;
            const type = +this.$route.query.type;
            const arr = [
                await this.$API.fetchSitesTree(),
                await this.$API.systemMerchantList(
                    {
                        ...this.params
                    }),
            ];
            Promise.all(arr).then(res => {
                // 站点列表
                if (res[0]) {
                    const datas = res[0].data.data;
                    if (datas) {
                        this.sitesOptions = datas.map((v) => {
                            return this.sum(v)
                        });
                    }
                }
                this.merchantOptions = res[1].data.data || []
                this.loading = false;
            });
        },
        handleClose() {
            this.form = {
                title: '',
                content: '',
                noticeType: null,
                publishTime: '',
                publishNow: true,
                notifyAllTenant: true,
                members: [
                    {
                        notifyAllUser: true,
                        tenantIds: [],
                        userIds: [],
                    }
                ]
            };
            this.$emit('close')
        },
        // 选择站点
        selectSite(val) {
            console.log('val', val)
            this.params.tenantId = val
            this.params.userId = ''
            console.log('params', this.params)
            this.fetchData()
        },
        // 遍历站点层级数据
        sum(e) {
            if (e.children) {
                return {
                    label: e.name,
                    value: e.id,
                    children: e.children.map(v => this.sum(v)),
                }
            } else {
                return {
                    label: e.name,
                    value: e.id,
                }
            }
        },
        //
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // 判断是否选择了 分站、商家
                    if (this.params.tenantId && this.params.tenantId.length) {
                        this.form.notifyAllTenant = false;
                        this.form.members[0].tenantIds = this.form.noticeType == 5 ? this.params.tenantId : [this.params.tenantId]
                        if (this.params.userId) {
                            this.form.members[0].notifyAllUser = false;
                            this.form.members[0].userIds[0] = this.params.userId
                        }
                    }
                    // 不是 立即发布，需要转换一下时间戳
                    if (!this.form.publishNow) {
                        this.form.publishTime = dateFormat(this.form.publishTime);
                    }
                    this.$emit('submit', this.form);
                    this.$nextTick(() => {
                        this.form = {
                            title: '',
                            content: '',
                            noticeType: null,
                            publishTime: '',
                            publishNow: true,
                            notifyAllTenant: true,
                            members: [
                                {
                                    notifyAllUser: true,
                                    tenantIds: [],
                                    userIds: [],
                                }
                            ]
                        }
                    })
                }
            });
        }
    },
};
</script>

<style lang="scss" scoped>
</style>
