<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="用户类型（1-普通用户，2-代理商）" prop="userType">
      <el-input v-model="dataForm.userType" placeholder="用户类型（1-普通用户，2-代理商）"></el-input>
    </el-form-item>
    <el-form-item label="最低提现金额" prop="limitMoney">
      <el-input v-model="dataForm.limitMoney" placeholder="最低提现金额"></el-input>
    </el-form-item>
    <el-form-item label="每天最多提现次数" prop="maxCount">
      <el-input v-model="dataForm.maxCount" placeholder="每天最多提现次数"></el-input>
    </el-form-item>
    <el-form-item label="提现规则说明" prop="description">
      <el-input v-model="dataForm.description" placeholder="提现规则说明"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="canSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {getObj, addObj, putObj} from '@/api/admin/sysenchashmentrule'

    export default {
    data () {
      return {
        visible: false,
        canSubmit: false,
        dataForm: {
          id: 0,
          userType: '',
          limitMoney: '',
          maxCount: '',
          description: '',
          createTime: '',
          updateTime: '',
          delFlag: '',
          tenantId: ''
        },
        dataRule: {
          userType: [
            { required: true, message: '用户类型（1-普通用户，2-代理商）不能为空', trigger: 'blur' }
          ],
          limitMoney: [
            { required: true, message: '最低提现金额不能为空', trigger: 'blur' }
          ],
          maxCount: [
            { required: true, message: '每天最多提现次数不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '提现规则说明不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '修改时间不能为空', trigger: 'blur' }
          ],
          delFlag: [
            { required: true, message: '逻辑删除(1删除,0未删除)不能为空', trigger: 'blur' }
          ],
          tenantId: [
            { required: true, message: '站点ID不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.canSubmit = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            getObj(this.dataForm.id).then(response => {
                this.dataForm = response.data.data
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.canSubmit = false;
            if (this.dataForm.id) {
                putObj(this.dataForm).then(data => {
                    this.$notify.success('修改成功')
                    this.visible = false
                    this.$emit('refreshDataList')
                }).catch(() => {
                    this.canSubmit = true;
                });
            } else {
                addObj(this.dataForm).then(data => {
                    this.$notify.success('添加成功')
                    this.visible = false
                    this.$emit('refreshDataList')
                }).catch(() => {
                    this.canSubmit = true;
                });
            }
          }
        })
      }
    }
  }
</script>
