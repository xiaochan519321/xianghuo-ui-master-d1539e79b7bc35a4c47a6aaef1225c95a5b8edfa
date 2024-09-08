<template>
  <div class="execution" v-loading="subLoading">
    <basic-container>
    <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getList()">
        <el-form-item>
          <el-button v-if="permissions.syssalesbinding_add" icon="el-icon-plus" type="primary" @click="salesbinding()">绑定</el-button>
        </el-form-item>
      </el-form> -->
      <avue-crud
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template slot="lockFlag" slot-scope="scope">
          <el-tag :type="scope.label == '锁定'? 'danger':''">{{ scope.label }}</el-tag>
        </template>
        <template slot="menuLeft">
            <el-button size="small" @click="onMutiBind">批量绑定</el-button>
        </template>
        <template slot="rowTemp">
        <div class="execution">
          <el-form ref="rowForm" :model="rowForm" label-width="80px" class="price-config-form" status-icon>
          <el-form-item label="绑定销售名" prop="username">
        <el-input v-model="rowForm.username"></el-input>
      </el-form-item>
      <el-form-item label="绑定销售ID" prop="userId">
        <el-input v-model="rowForm.userId"></el-input>
      </el-form-item>
        </el-form>
         </div>
        </template>
        <template slot-scope="{row}" slot="menu">
           <el-button size="mini" type="text" @click="btnbinding(row)" v-if="!row.bindingId">绑定销售</el-button>
           <el-button size="mini" type="text" class="option-color" @click="salesdel(row)" v-else>解绑销售</el-button>
        </template>
        
      </avue-crud>
    </basic-container>
  </div>
</template>
 

<script>
import {
  feathData,
  binding,
  delObj
} from "@/api/admin/sales/customer";
import { tableOption } from "@/const/crud/admin/sales/customer";
import { mapGetters } from "vuex";

export default {
  components: {},
  name: "binding",
  props: {
      height: {
          type: String,
          default: 'auto'
      }
  },
  data() {
    return {
      searchForm: {},
      rowForm:{},
      tableData: [],
      // agentStatusItem: [],
      // selectTypeItem:[],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      scData: [],
      subLoading: false
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.syssalesbinding_add, false),
        delBtn: this.vaildData(this.permissions.giftrecord_del, false),
        editBtn: this.vaildData(this.permissions.syssalesbinding_add, false),

      };
    },
  },
  methods: {
    //   批量绑定
      onMutiBind () {
        if (!this.scData.length) return this.$message.warning('请至少勾选一个客户进行操作')
        this.subLoading = true
        let params = {
          userId: this.rowForm.userId,
          merchantId: [],
          merchantUserId: [],
        };
        this.scData.forEach((item) => {
          params.merchantId.push(item.merchantId);
          params.merchantUserId.push(item.userId);
        });
        binding(params).then((response) => {
            this.$message.success("绑定成功");
            this.subLoading = false
            this.getList(this.page);
        })
      },
    getList(page, params) {
        this.tableLoading = true;
        console.log(this.rowForm);
        feathData(
            Object.assign(
                {
                current: page.currentPage,
                size: page.pageSize,
                },
                params,
                this.searchForm
            )
        )
        .then((response) => {
            console.log('response', response)
            this.tableData = response.data.data.records;
            this.page.total = response.data.data.total;
            this.tableLoading = false;
        })
        .catch(() => {
            this.tableLoading = false;
        });
    },

    salesdel(row){
       delObj(row.merchantId).then((response) => {
            this.$message.success("解绑成功");
            this.getList(this.page);
          })
          .catch(() => {
            this.$message.error("解绑失败");
          });
    },

    btnbinding(row){
      if (row == undefined) {
          this.$message.error("未选择需要绑定的商户");
          return;
        }
        this.subLoading = true
        console.log(this.rowForm);
        let params = {
          userId: this.rowForm.userId,
          merchantId: [],
          merchantUserId: [],
        };
        params.merchantId.push(row.merchantId);
        params.merchantUserId.push(row.userId);
        binding(params).then((response) => {
            this.$message.success("绑定成功");
            this.getList(this.page);
            this.subLoading = false
        })
    },
    selectionChange(list){
        this.scData = list;
    },
      
    // closeDialog(type) {
    //   if (selectionList.length > 3) {
    //     this.$confirm(
    //        "当前已选中超过1000个商家，超出后将默认取前1000个, 是否继续?",
    //       "提示",
    //       {
    //         confirmButtonText: "确定",
    //         cancelButtonText: "取消",
    //         type: "warning",
    //       }
    //     )
    //       .then(() => {
    //         let paramsObj = {
    //           type,
    //           selectionList: this.selectionList.slice(0, 3),
    //         };
    //         this.$emit("comWechatFooterBtn", paramsObj);
    //       })
    //       .catch(() => {
    //         this.$message({
    //           type: "info",
    //           message: "已取消,请重新选择",
    //         });
    //       });
    //   } else {
    //     let paramsObj = {
    //       type,
    //       selectionList,
    //     };
    //     this.$emit("comWechatFooterBtn", paramsObj);
    //   }
    // },

    // rowDel: function (row, index) {
    //     this.$confirm('是否确认删除ID为' + row.id, '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //     }).then(function () {
    //         return delObj(row.id)
    //     }).then(data => {
    //         this.$message.success('删除成功')
    //         this.getList(this.page)
    //     })
    // },
    // handleUpdate: function (row, index, done,loading) {
    //     putObj(row).then(data => {
    //         this.$message.success('修改成功')
    //         done()
    //         this.getList(this.page)
    //     }).catch(() => {
    //         loading();
    //     });
    // },
    // handleSave: function (row, done,loading) {
    //     addObj(row).then(data => {
    //         this.$message.success('添加成功')
    //         done()
    //         this.getList(this.page)
    //     }).catch(() => {
    //         loading();
    //     });
    // },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    searchChange(form, done) {
      this.searchForm = form;
      this.page.currentPage = 1;
      this.getList(this.page, form);
      done();
    },
    refreshTable () {
        this.$refs.crud.refreshTable()
    },
    refreshChange() {
      this.getList(this.page);
    },
  },
  created () {
      console.log('height', this.height)
      this.tableOption = {
          ...this.tableOption,
          height: this.height
      }
  },
};
</script>

<style lang="scss" scoped>
    .execution {
        ::v-deep.el-table {
            .el-table__fixed-right {
                .option-color {
                    color: #E6A23C;
                }
                .option-color:hover {
                    color: #e9b76d;
                }
            }
        }
    }
</style>