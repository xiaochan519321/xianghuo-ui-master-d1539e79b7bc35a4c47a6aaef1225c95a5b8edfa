<template>
  <div class="mod-config">
    <basic-container>
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList()"
      >
      </el-form>

      <div class="avue-crud">
        <el-table :data="dataList" border v-loading="dataListLoading" headerCellClassName="header-cell-bg-color">
          <el-table-column
            prop="username"
            header-align="center"
            align="center"
            label="用户ID"
          >
          </el-table-column>
          <el-table-column
            prop="userType"
            header-align="center"
            align="center"
            label="用户类型"
          >
		  	<template slot-scope="{row}">
				<span>{{typeOption[row.userType]}}</span>
			</template>
          </el-table-column>
          <el-table-column
            prop="accountType"
            header-align="center"
            align="center"
            label="提现类型"
          >
		  	<template slot-scope="{row}">
				<span>{{accountOption[row.accountType]}}</span>
			</template>
          </el-table-column>
          <el-table-column
            prop="account"
            header-align="center"
            align="center"
			min-width="120"
            label="提现账号"
          >
          </el-table-column>
          <el-table-column
            prop="accountName"
            header-align="center"
            align="center"
            label="提现人姓名"
          >
          </el-table-column>
          <el-table-column
            prop="money"
            header-align="center"
            align="center"
            label="提现金额"
          >
		  	<template slot-scope="{row}">
				<el-button type="text">{{row.money}}</el-button>
			</template>
          </el-table-column>
          <el-table-column
            prop="auditStatus"
            header-align="center"
            align="center"
            label="审核状态"
          >
		  	<template slot-scope="{row}">
				<span>{{auditOption[row.auditStatus]}}</span>
			</template>
          </el-table-column>
          <el-table-column
            prop="auditTime"
            header-align="center"
            align="center"
			min-width="140"
            label="审核时间"
          >
          </el-table-column>
          <el-table-column
            prop="auditRemark"
            header-align="center"
            align="center"
            label="审核说明"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
			min-width="140"
            label="创建时间"
          >
          </el-table-column>
          <el-table-column
		   		v-if="permissions.sysenchashmentrecord_examine"
				header-align="center"
				fixed="right"
				width="120"
				align="center"
				label="操作">
				<template slot-scope="{row}">
					<el-button type="primary" v-if="row.auditStatus == 1" size="mini" @click="onDispose(row)">处理申请</el-button>
				</template>
          </el-table-column>
        </el-table>
      </div>

      <div class="avue-crud__pagination">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          background
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <table-form
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></table-form>
    </basic-container>
	<dialog-dispose ref="dialogDispose" @success="getDataList"/>
  </div>
</template>

<script>
import { fetchList, delObj } from "@/api/admin/sysenchashmentrecord";
import TableForm from "./sysenchashmentrecord-form";
import { mapGetters } from "vuex";
import DialogDispose from './modules/DialogDispose'
export default {
  data() {
    return {
      dataForm: {
        key: "",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
	  typeOption: {
		  '1': '普通用户',
		  '2': '代理商'
	  },
	  accountOption: {
		  1: '支付宝',
		  2: '微信',
		  3: '银行卡'
	  },
	  auditOption: {
		  1: '待审核',
		  2: '审核通过',
		  3: '审核不通过'
	  }
    };
  },
  components: {
    TableForm,
	DialogDispose
  },
  created() {
    this.getDataList();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
	  onDispose (item) {
		this.$refs.dialogDispose.showEdit(item)
	  },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      fetchList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
        })
      ).then((response) => {
        this.dataList = response.data.data.records;
        this.totalPage = response.data.data.total;
      });
      this.dataListLoading = false;
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      this.$confirm("是否确认删除ID为" + id, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delObj(id);
        })
        .then((data) => {
          this.$message.success("删除成功");
          this.getDataList();
        });
    },
  },
};
</script>
