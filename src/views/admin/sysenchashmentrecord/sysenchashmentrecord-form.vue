<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="用户ID" prop="memberId">
      <el-input v-model="dataForm.memberId" placeholder="用户ID"></el-input>
    </el-form-item>
    <el-form-item label="用户类型（1-普通用户，2-代理商）" prop="userType">
      <el-input v-model="dataForm.userType" placeholder="用户类型（1-普通用户，2-代理商）"></el-input>
    </el-form-item>
    <el-form-item label="提现账号类型（1-支付宝，2-微信，3-银行卡）" prop="accountType">
      <el-input v-model="dataForm.accountType" placeholder="提现账号类型（1-支付宝，2-微信，3-银行卡）"></el-input>
    </el-form-item>
    <el-form-item label="提现账号" prop="account">
      <el-input v-model="dataForm.account" placeholder="提现账号"></el-input>
    </el-form-item>
    <el-form-item label="提现人姓名" prop="accountName">
      <el-input v-model="dataForm.accountName" placeholder="提现人姓名"></el-input>
    </el-form-item>
    <el-form-item label="提现金额" prop="money">
      <el-input v-model="dataForm.money" placeholder="提现金额"></el-input>
    </el-form-item>
    <el-form-item label="审核状态（1-待审核，2-审核通过，3-审核不通过）" prop="auditStatus">
      <el-input v-model="dataForm.auditStatus" placeholder="审核状态（1-待审核，2-审核通过，3-审核不通过）"></el-input>
    </el-form-item>
    <el-form-item label="审核时间" prop="auditTime">
      <el-input v-model="dataForm.auditTime" placeholder="审核时间"></el-input>
    </el-form-item>
    <el-form-item label="审核说明" prop="auditRemark">
      <el-input v-model="dataForm.auditRemark" placeholder="审核说明"></el-input>
    </el-form-item>
    <el-form-item label="审核人" prop="auditUser">
      <el-input v-model="dataForm.auditUser" placeholder="审核人"></el-input>
    </el-form-item>
    
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="canSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {getObj, addObj, putObj} from '@/api/admin/sysenchashmentrecord'

    export default {
    data () {
      return {
        visible: false,
        canSubmit: false,
        dataForm: {
          id: 0,
          memberId: '',
          userType: '',
          accountType: '',
          account: '',
          accountName: '',
          money: '',
          auditStatus: '',
          auditTime: '',
          auditRemark: '',
          auditUser: '',
          createTime: '',
          updateTime: '',
          delFlag: '',
          tenantId: ''
        },
        dataRule: {
          memberId: [
            { required: true, message: '用户ID不能为空', trigger: 'blur' }
          ],
          userType: [
            { required: true, message: '用户类型（1-普通用户，2-代理商）不能为空', trigger: 'blur' }
          ],
          accountType: [
            { required: true, message: '提现账号类型（1-支付宝，2-微信，3-银行卡）不能为空', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '提现账号不能为空', trigger: 'blur' }
          ],
          accountName: [
            { required: true, message: '提现人姓名不能为空', trigger: 'blur' }
          ],
          money: [
            { required: true, message: '提现金额不能为空', trigger: 'blur' }
          ],
          auditStatus: [
            { required: true, message: '审核状态（1-待审核，2-审核通过，3-审核不通过）不能为空', trigger: 'blur' }
          ],
          auditTime: [
            { required: true, message: '审核时间不能为空', trigger: 'blur' }
          ],
          auditRemark: [
            { required: true, message: '审核说明不能为空', trigger: 'blur' }
          ],
          auditUser: [
            { required: true, message: '审核人不能为空', trigger: 'blur' }
          ],
          // createTime: [
          //   { required: true, message: '创建时间不能为空', trigger: 'blur' }
          // ],
          // updateTime: [
          //   { required: true, message: '修改时间不能为空', trigger: 'blur' }
          // ],
          // delFlag: [
          //   { required: true, message: '逻辑删除(1删除,0未删除)不能为空', trigger: 'blur' }
          // ],
          // tenantId: [
          //   { required: true, message: '站点ID不能为空', trigger: 'blur' }
          // ]
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
