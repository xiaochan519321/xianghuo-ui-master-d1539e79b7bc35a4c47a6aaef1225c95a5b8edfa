<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px">
        <el-form-item label="配置模板名称" prop="name" >
          <el-input v-model="dataForm.name" placeholder="配置模板名称"></el-input>
        </el-form-item>
        <el-form-item label="推广分佣状态" prop="profitSwitch">
          <el-radio v-model="dataForm.profitSwitch"  :label="1">开启</el-radio>
          <el-radio v-model="dataForm.profitSwitch"  :label="0">关闭</el-radio>
        </el-form-item>
        <el-form-item label="分佣比例" prop="agentProfitRate">
          <el-input v-model="dataForm.agentProfitRate" placeholder="分佣比例（%）"></el-input>
        </el-form-item>
        <!-- <el-form-item label="最高分佣比率" prop="agentMaxProfitRate">
          <el-input v-model="dataForm.agentMaxProfitRate" placeholder="一级代理最高分佣比率（%）"></el-input>
        </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="canSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {getObj, addObj, putObj} from '@/api/admin/profitconfig'
    import { max } from 'moment';

    export default {
    data () {
      return {
        visible: false,
        canSubmit: false,
        dataForm: {
          id: 0,
          name: '',
          cardSwitch: '',
          profitSwitch: '',
          profitType: '',
          agentMaxProfitRate: '',
          agentProfitRate: '',
          secondMaxProfitRate: '0',
          secondProfitRate: '0',
          tenantId: '',
          createTime: '',
          updateTime: '',
          delFlag: ''
        },
        dataRule: {
          name: [
            { required: true, message: '配置模板名称不能为空', trigger: 'blur' }
          ],
          cardSwitch: [
            { required: true, message: '卡密功能开关（0-关闭，1-开启）不能为空', trigger: 'blur' }
          ],
          profitSwitch: [
            { required: true, message: '推广分佣状态（0-关闭，1-开启）不能为空', trigger: 'blur' }
          ],
          profitType: [
            { required: true, message: '分佣模式（1.一级代理分佣 2.级代理分佣 3.3级分佣）不能为空', trigger: 'blur' }
          ],
          // agentMaxProfitRate: [
          //   { required: true, message: '一级代理最高分佣比率（%）不能为空', trigger: 'blur' }
          // ],
          agentProfitRate: [
            { required: true, message: '分佣比例（%）不能为空', trigger: 'blur' },
            { type:'integer', message: "值要求为1-100的整数", min: 1, max:100, trigger:'blur', transform:Number}
          ],
          // secondMaxProfitRate: [
          //   { required: true, message: '二级级代理最高分佣比率（%）不能为空', trigger: 'blur' }
          // ],
          // secondProfitRate: [
          //   { required: true, message: '二级代理分佣比率（%）不能为空', trigger: 'blur' }
          // ],
          tenantId: [
            { required: true, message: '站点ID不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '修改时间不能为空', trigger: 'blur' }
          ],
          delFlag: [
            { required: true, message: '逻辑删除(1删除,0未删除)不能为空', trigger: 'blur' }
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
                addObj(this.dataForm).then(data => {
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
