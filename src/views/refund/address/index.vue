<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange">
          <template slot="menuLeft">
            <el-button
              class="filter-item"
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addDialog = true">添加
            </el-button>
          </template>
      </avue-crud>
    </basic-container>
    <el-dialog
        class="add-addr-dialog"
        title="新增退货地址"
        :close-on-click-modal="false"
        :visible.sync="addDialog"
        @close="dialogVisible = true"
        width="512px">
        <el-form ref="addrForm" :model="addrForm" :rules="addrRules" label-width="100px">
            <el-form-item label="联系人：" prop="userName">
              <el-input type="text" v-model.trim="addrForm.userName" placeholder="请输入联系人姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="mobile">
              <el-input type="text" v-model.trim="addrForm.mobile" placeholder="请输入联系人电话"></el-input>
            </el-form-item>
            <el-form-item label="店铺名称：" prop="shopId">
              <el-select
                v-model="addrForm.shopId"
                clearable
                collapse-tags
                style="width: 100%"
                placeholder="请选择店铺"
              >
                <el-option
                  v-for="item in shopList"
                  :key="item.id"
                  :label="item.shopName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="退货地址：" prop="city">
              <el-cascader
                style="width: 100%"
                v-model="addrForm.city"
                :props="cityProps"
                :options="cityOption">
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址：" prop="detail">
                <el-input type="textarea" :rows="3" resize="none" v-model="addrForm.detail" placeholder="请输入详细地址"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialog = false">取 消</el-button>
            <el-button type="primary" @click="onAddrSave" :loading="addrLoading">保 存</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import { addressList, refundNewAddr, getShopList, syncAddress } from '@/api/refund/order'
  import { tableOption } from '@/const/crud/refund/index'
  import { cityData } from '@/util/cityData'
  import { isvalidatemobile } from "@/util/validate"
  export default {
    name: 'Address',
    data() {
      const validatePhone = (rule, value, callback) => {
        if (isvalidatemobile(value)[0]) {
          callback(new Error(isvalidatemobile(value)[1]));
        } else {
          callback();
        }
      };
      return {
        tableData: [],
        searchForm: {},
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
        shopList: [],
        addDialog: false,
        cityProps: {
          label: 'name',
          value: 'code'
        },
        addrForm: {
          userName:'',
          mobile: '',
          city:'',
          detail:'',
          shopId:''
        },
        addrRules: {
          userName: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' }
          ],
          mobile: [
            { required: true, validator: validatePhone, trigger: 'blur' }
          ],
          city: [
            { required: true, message: '请选择完整省市区', trigger: 'change' }
          ],
          detail: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
          shopId: [
            { required: true, message: '请选择店铺', trigger: 'blchangeur' }
          ]
        },
        addrLoading: false
      }
    },
    computed: {
      cityOption () {
        return cityData
      },
    },
    mounted() {
      getShopList().then(response => {
        this.shopList = response.data.data
      }).catch(() => {})
    },
    methods: {
      getList(params) {
        this.tableLoading = true
        addressList(Object.assign(params, this.searchForm)).then(response => {
          this.tableData = response.data.data
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      searchChange(form, done) {
        this.searchForm = form
        this.getList(form)
        done()
      },
      refreshChange() {
        this.getList(this.page)
      },
      // 同步地址
      async onAsync (showMsg = true, defaultId) {
        this.asyncLoading = true
        const { data } = await syncAddress({shopId: this.addrForm.shopId})
        if (data.code === 0) {
          showMsg && this.$message.success('正在同步中，请稍后...')
          this.asyncLoading = false
          if (!defaultId) this.dialogLoading = false
          defaultId && this.getList(defaultId)
        }
      },
      // 处理因同步问题导致的错误引导用户同步
      agienSync (msg) {
        this.$confirm(msg, '温馨提示', {
          customClass: 'address-sync-confirm',
          confirmButtonText: '开始同步',
          showCancelButton: false,
          closeOnClickModal: false,
          type: 'warning'
        }).then(res => {
          this.onAsync()
        })
      },
      // 新增退货地址
      onAddrSave () {
        this.$refs['addrForm'].validate(async (valid) => {
          if (valid) {
            this.addrLoading = true
            const {userName, mobile, detail, city,shopId} = this.addrForm
            const params = {
              userName,
              mobile,
              detail,
              provinceId: city[0],
              cityId: city[1],
              townId: city[2],
              streetId: city[3],
              shopId: shopId
            }
              try {
                const { data } = await refundNewAddr(params)
                this.addrLoading = false
                console.log('data', data)
                if (data.code == 0) {
                  this.addrForm = {}
                  this.getList()
                  this.$message.success('新增成功')
                  this.addDialog = false
                } else if (data.code == 40001) {
                  this.addDialog = false
                  this.agienSync(data.msg)
                }
              } catch (err) {
                this.addrLoading = false
              }
            } else {
              console.log('error submit!!');
              return false;
            }
        });
      },
    }
  }
</script>
<style scoped>
::v-deep .el-input--mini .el-input__icon {
    line-height: 28px;
    display: none !important;
}
</style>
