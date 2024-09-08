<template>
  <div style="margin: 20px">
    <div style="display: flex">
      <div style="margin-left: 10px">
        <el-select size="mini" v-model="userStatus" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div :style="margin">
        <el-select size="mini" v-model="userType" placeholder="请选择">
          <el-option
            v-for="item in usertype"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <el-button
          size="mini"
          @click="screenBtn()"
          :style="margin"
          type="primary"
          >筛选</el-button
        >
      </div>
      <div>
        <el-button
          size="mini"
          :style="margin"
          type="primary"
          @click="cancelBtn()"
          >清空</el-button
        >
      </div>
      <div>
        <el-button
          size="mini"
          :style="margin"
          type="primary"
          @click="loginBtn()"
          >登录</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%; margin: 20px 20px 20px 10px"
      border
      :header-cell-style="{ fontWeight: 800, color: '#000' }"
    >
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="loginId" align="center" label="账号" width="180">
      </el-table-column>
      <el-table-column
        prop="accessToken"
        align="center"
        label="账号token"
        width="350"
      >
      </el-table-column>
      <el-table-column prop="uid" align="center" label="账号UID" width="180">
      </el-table-column>
      <el-table-column prop="uin" align="center" label="账号UIN" width="250">
      </el-table-column>
      <el-table-column align="center" label="账号状态" width="100">
        <template slot-scope="{ row }">
          <span v-if="row.userStatus == '0'">在线</span>
          <span v-if="row.userStatus == '1'">离线</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号类型" width="100">
        <template slot-scope="{ row }">
          <span v-if="row.userType == '7'">下单中</span>
          <span v-if="row.userType == '8'">停用1</span>
          <span v-if="row.userType == '9'">停用2</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="curPlaceOrderCount"
        align="center"
        label="已下单总单量"
        width="180"
      >
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button @click="loginClick(scope.row)" type="text" size="small"
            >登录</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <DialogLogin
        ref="dialogLogin"
        :userInfo="userInfo"
        @returnHandler="returnHandler"
      ></DialogLogin>
    </el-dialog>
  </div>
</template>
  
  <script>
import { pddUserList } from "../../../api/pdduser";
import DialogLogin from "../components/DialogLogin.vue";
export default {
  components: {
    DialogLogin,
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      options: [
        {
          value: 0,
          label: "在线",
        },
        {
          value: 1,
          label: "离线",
        },
      ],
      userStatus: "",
      usertype: [
        {
          value: 7,
          label: "下单中",
        },
        {
          value: 8,
          label: "停用1",
        },
        {
          value: 9,
          label: "停用2",
        },
      ],
      userType: "",
      margin: {
        marginLeft: "20px",
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      userInfo: {},
    };
  },
  created() {
    this.getUser();
    this.getUserList();
  },
  methods: {
    async getUser() {
      const data = {
        usertype: 7,
        page: this.currentPage,
        size: 1000,
        userstatus: "0",
      };
      const res = await pddUserList(data);
      this.total = res.data.data.data.total;
    },
    // 获取列表
    async getUserList() {
      const data = {
        usertype: 7,
        page: this.currentPage,
        size: this.pageSize,
        userstatus: "0",
      };
      const res = await pddUserList(data);
      this.tableData = res.data.data.data.rows;
    },
    // 分页切换
    async handleCurrentChange(newPage) {
      this.currentPage = newPage;
      if (this.userStatus === "" || this.userType === "") {
        this.getUserList();
      } else {
        this.getScreenList();
      }
    },
    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      if (this.userStatus === "" || this.userType === "") {
        this.getUserList();
      } else {
        this.getScreenList();
      }
    },
    // 获取筛选列表
    async getScreenList() {
      const data = {
        usertype: this.userType,
        page: this.currentPage,
        size: this.pageSize,
        userstatus: this.userStatus,
      };
      const res = await pddUserList(data);
      this.tableData = res.data.data.data.rows;
    },
    // 筛选
    async screenBtn() {
      if (this.userStatus === "" || this.userType === "") {
        this.$message({
          showClose: true,
          message: "请选择",
          type: "error",
        });
        return;
      }
      const data = {
        usertype: this.userType,
        page: this.currentPage,
        size: 1000,
        userstatus: this.userStatus,
      };
      const res = await pddUserList(data);
      this.total = res.data.data.data.total;
      this.currentPage = 1;
      this.getScreenList();
    },
    // 清空
    cancelBtn() {
      this.userStatus = "";
      this.userType = "";
    },
    // 登录
   async loginBtn() {
      this.dialogVisible = true;
    },
    // 登录
    loginClick(item) {
      this.dialogVisible = true;
      this.userInfo = item;
    },
    // 关闭弹窗
    handleClose(done) {
      this.$confirm("确定要取消登录吗？")
        .then((_) => {
          done();
          if (this.userInfo) {
            this.userInfo = {};
            this.$refs.dialogLogin.clearTimer();
          }
        })
        .catch((_) => {});
    },
    // 返回
    returnHandler() {
      this.dialogVisible = false;
      if (this.userInfo) {
        this.userInfo = {};
        this.$refs.dialogLogin.clearTimer();
      }
    },
  },
};
</script>