<template>
  <div class="execution">
    <el-form ref="dataForm" :model="dataForm" label-width="80px" :rules="rules" class="price-config-form" status-icon>
      <el-form-item label="原省市区">
        <el-input v-model="yssq" disabled placeholder="详细地址"  ></el-input>
      </el-form-item>
      <el-form-item label="省市区" prop="ssq">
         <el-cascader
            :options="ssqData"
            v-model="dataForm.ssq"
            style="width:100%;"
          >
          </el-cascader>
      </el-form-item>
      <el-form-item label="收件人">
        <el-input v-model="dataForm.encryptPostReceiver" placeholder="请输入收件人姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="dataForm.encryptPostTel" placeholder="请输入收件人联系方式"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="encryptDetail">
        <el-input v-model="dataForm.encryptDetail" placeholder="详细地址"></el-input>
      </el-form-item>
      <el-form-item label="自动识别" prop="autoEncrypt" class="auto-encrypt-input">
        <el-input type="textarea" v-model="dataForm.autoEncrypt" placeholder="请直接粘贴省市区，收件人姓名和联系方式、详细地址后，点击自动匹配会立即识别" :rows="3"></el-input>
      </el-form-item>
    </el-form>
    <el-tag size="" type="danger">如遇到尚未解密/解密失败的订单，请输入抖店完整地址即可立即解密</el-tag>
  </div>
</template>

<script>
  import {editPddArea} from '@/api/dfh/order'
  import AddressParse from 'address-parse'

  export default {
    name: 'pddArea',
    data() {
      return{
        row: '',
        timestamp: '',
        yssq: '',
        ssqData:[],
        dataForm:{
          ssq: [],
          encryptDetailText: '',
        },
        rules: {
          encryptDetail: [
            { required: true, message: '详细地址必填', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
        timestamp: 'show'
    },
    methods: {
      ok(){
        var than = this;
        console.log('dataForm', this.dataForm)
        this.$refs['dataForm'].validate((valid) => {
          this.dataForm.postReceiver = this.dataForm.encryptPostReceiver;
          this.dataForm.postTel = this.dataForm.encryptPostTel;
          this.dataForm.encryptDetailText = this.dataForm.encryptDetail;
          if (valid) {
            editPddArea(this.dataForm).then(data => {
              than.$message.success('操作成功')
              than.$emit('ok');
              than.dataForm = {};
            }).catch(() => {
              loading();
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      show() {
        var ssqData = require('.././data.json');
        this.ssqData = ssqData;
        this.dataForm = this.row;
        this.yssq = this.dataForm.province +" / "+ this.dataForm.city +" / "+ this.dataForm.town
        if (undefined == this.dataForm.pddAddress || '' == this.dataForm.pddAddress || null == this.dataForm.pddAddress) {
            if (null == this.dataForm.street) {
              this.dataForm.encryptDetailText = this.dataForm.encryptDetail;
            } else {
              //this.dataForm.encryptDetailText = '';
              this.dataForm.encryptDetailText = this.dataForm.street + this.dataForm.encryptDetail;
            }
        } else{
          this.dataForm.encryptDetailText = this.dataForm.pddAddress;
        }
        if (null != this.dataForm.pddSsq) {
          this.dataForm.ssq = this.dataForm.pddSsq.split(',');
        }
      },
      handleAutoEncrypt () {
          if (!this.dataForm.autoEncrypt) {
              this.$message.warning('请先输入自动识别内容')
              return
          }
          const [result] = AddressParse.parse(this.dataForm.autoEncrypt)
          let province = ''
          let city = ''
          let area = ''
          try {
            //   匹配省
            this.ssqData.some(pro => {
                if (pro.label === result.province) {
                        province = pro.value
                        //   匹配市
                        pro.children && pro.children.some(cit => {
                            if (cit.label === result.city) {
                                city = cit.value
                                cit.children && cit.children.some(are => {
                                    if (are.label === result.area) {
                                        area = are.value
                                        return true
                                    }
                                })
                                return true
                            }
                        })
                        return true
                }
            })
          } catch (err) {
              province = ''
              city = ''
              area = ''
          }
          console.log('province', province)
          console.log('city', city)
          console.log('area', area)
          this.dataForm = {
              ...this.dataForm,
              postReceiver: result.name || '',
              postTel: result.mobile || '',
              encryptDetail: result.details || '',
              ssq: [province, city, area]
          }
      },
    },

  }
</script>

<style lang="scss" scoped>
    .price-config-form {
        ::v-deep.el-form-item.auto-encrypt-input {
            .el-form-item__label {
                color: #E6A23C;
            }
        }
    }
</style>
