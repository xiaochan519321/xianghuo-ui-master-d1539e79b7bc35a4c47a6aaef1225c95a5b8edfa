<template>
  <div>
        <el-form
            :rules="rules"
            ref="priceConfigForm"
            :model="priceConfigForm"
            class="price-config-form"
            status-icon
            label-width="105px">
            <el-row :gutter="30">
                <el-col :sm="7" :md="7" :lg="7">
                    <el-form-item label="一个月" prop="onemonthPrice">
                        <el-input
                            type="number"
                            clearable
                            v-model="priceConfigForm.onemonthPrice"
                            placeholder="请输入价格"
                        >
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="7" :md="7" :lg="7">
                    <el-form-item label="全局底价" prop="onemonthLimitPrice">
                        <el-input
                            type="number"
                            clearable
                            v-model="priceConfigForm.onemonthLimitPrice"
                            placeholder="请输入一个月底价"
                        >
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :sm="7" :md="7" :lg="7">
                    <el-form-item label="半年" prop="halfyearPrice">
                        <el-input
                            type="number"
                            clearable
                            v-model="priceConfigForm.halfyearPrice"
                            placeholder="请输入价格"
                        >
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="7" :md="7" :lg="7">
                    <el-form-item label="全局底价" prop="halfyearLimitPrice">
                        <el-input
                            type="number"
                            clearable
                            v-model="priceConfigForm.halfyearLimitPrice"
                            placeholder="请输入半年底价"
                        >
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :sm="7" :md="7" :lg="7">
                    <el-form-item label="一年" prop="oneyearPrice">
                        <el-input
                            type="number"
                            clearable
                            v-model="priceConfigForm.oneyearPrice"
                            placeholder="请输入价格"
                        >
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="7" :md="7" :lg="7">
                    <el-form-item label="全局底价" prop="oneyearLimitPrice">
                        <el-input
                            type="number"
                            clearable
                            v-model="priceConfigForm.oneyearLimitPrice"
                            placeholder="请输入一年底价"
                        >
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    <el-button v-if="permissions.sys_memberrightprice_add" style="float:right;margin-bottom:2%;margin-right:5%;" type="primary" @click="saveUpdate">保存编辑</el-button>
  </div>
</template>
<script>
import {getByRightId, saveUpdate} from '@/api/admin/memberright'
import {mapGetters} from 'vuex'

export default {
    name: 'priceConfig',
    data() {
      return{
        priceConfigForm: {}, // 价格配置表单数据
        row: {},
        rules: {
            onemonthPrice: [
              { required: true, message: '一个月价格必填', trigger: 'blur' }
            ],
            onemonthLimitPrice: [
              { required: true, message: '一个月全局低价必填', trigger: 'blur' }
            ],
            halfyearPrice: [
              { required: true, message: '半年价格必填', trigger: 'blur' }
            ],
            halfyearLimitPrice: [
              { required: true, message: '半年全局低价必填', trigger: 'blur' }
            ],
            oneyearPrice: [
              { required: true, message: '一年价格必填', trigger: 'blur' }
            ],
            oneyearLimitPrice: [
              { required: true, message: '一年全局低价必填', trigger: 'blur' }
            ]

          }
      }
    },
    computed: {
        ...mapGetters(['permissions']),
    },
    watch: {
        row: 'getByRightId'
    },
    methods: {
        saveUpdate() {
            this.$refs['priceConfigForm'].validate((valid) => {
                if (valid) {
                    saveUpdate(this.priceConfigForm).then(data => {
                        this.$message.success('保存成功')
                    }).catch(() => {
                        loading();
                    });
                } else {
                    this.$message.warning('必填项不能为空')
                }
            });
        },
        getByRightId() {
            getByRightId(this.row.id).then((res) => {
                if (res.data.data) {
                    this.priceConfigForm = res.data.data;
                } else {
                    this.priceConfigForm = {};
                }
                this.priceConfigForm.rightId = this.row.id;
            });
        }
    }
  }
</script>