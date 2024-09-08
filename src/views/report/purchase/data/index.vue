<template>
  <div class="execution">
    <basic-container>
      <div class="header">
        <el-form :model="searchForm" ref="form" inline>
          <el-form-item label="店铺：">
            <el-select v-model="searchForm.id" placeholder="请选择店铺" clearable style="width: 232px">
              <el-option v-for="item in shopList" :key="item.id" :label="item.shopName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间：">
            <el-date-picker
                style="width: 366px"
                v-model="searchForm.createTimeArr"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left: 30px;">
            <el-button
              size="mini"
              style="width: 86px;"
              icon="el-icon-delete"
              @click.stop="resetForm('form')"
          >
              清空
          </el-button>
            <el-button
              type="primary"
              size="mini"
              style="width: 86px;"
              icon="el-icon-search"
              @click.stop="onClickComfirm"
          >
              搜索
          </el-button>
          </el-form-item>
        </el-form>
        <div class="right">
          <el-button  circle @click="onExport">
            <el-tooltip   content="下载" placement="top" >
              <i class="el-icon-download"></i>
            </el-tooltip>
            
          </el-button>
          <el-button  circle @click="getList">
            <el-tooltip   content="刷新" placement="top" >
              <i class="el-icon-refresh"></i>
            </el-tooltip>
            
          </el-button>
          <el-button  circle  @click="columnsShow">
            <el-tooltip   content="显隐" placement="top">
              <i class="el-icon-s-operation"></i>
            </el-tooltip>
          </el-button>
        </div>
      </div>
      <avue-crud
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        :headerCellClassName="() => {return 'header-cell-bg-color'}"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange">
        <template slot-scope="{type,size,row}" slot="menu">
          <el-button :size="size" :type="type" @click="showDetailDialog(row)">查看明细</el-button>
        </template>
      </avue-crud>

      <el-dialog title="采购明细" v-if="dialogTableVisible" :visible.sync="dialogTableVisible" width="80%">
        <PurchaseDetail :initShopId="shopId" :initStatisticsTime="statisticsTime"></PurchaseDetail>
      </el-dialog>

    </basic-container>
  </div>
</template>


<script>
import { fetchList, fetchExport } from "@/api/report/purchase/data";
import { tableOption } from "@/const/crud/report/purchase/data";
import { mapGetters } from "vuex";
import TimeFormats from '@/util/TimeFormats';
import PurchaseDetail from '@/views/report/purchase/details/index';
import {getAllShopList} from '@/api/dfh/shop';

export default {
  name: "purchaseData",
  data() {
    return {
      shopList: [],
      shopId: "",
      statisticsTime: "",
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      dialogTableVisible: false,
      fullscreenLoading: false
    };
  },
  async created() {
      const {data: { data }} = await getAllShopList()
      this.shopList = data
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permissions.generator_paygoodsorder_add,
          false
        ),
        delBtn: this.vaildData(
          this.permissions.generator_paygoodsorder_del,
          false
        ),
        editBtn: this.vaildData(
          this.permissions.generator_paygoodsorder_edit,
          false
        ),
      };
    },
  },
  methods: {
    returnParams(params) {
      let n = {}
      for(const key in params) {
        if(params[key] ) n[key] = params[key]
      }
      return n
    },
    resetForm(formName) {
        this.searchForm = this.$options.data().searchForm;
        this.onClickComfirm();
    },
    columnsShow() {
      console.log(this.$refs.crud)
      this.$refs.crud.$refs.dialogColumn.columnBox=true
    },
    onClickComfirm() {
      this.page.currentPage = 1;
      this.getList(this.page);
    },
    showDetailDialog(row) {
      this.shopId = row.shopId
      this.statisticsTime = row.statisticsTime
      this.dialogTableVisible = true
    },
    formats(val){
      return new TimeFormats().convertTime('',val);
    },
    openPreview(img) {
      this.$ImagePreview([{url:img}]);
    },
    getList(page, params) {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
          },
          params,
          this.returnParams(this.searchForm)
        )
      )
        .then((response) => {
          this.tableData = response.data.data.records;
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    onExport () {
        const formData = {
            current: this.page.currentPage,
            size: this.page.pageSize,
            ...this.returnParams(this.searchForm)
        }
        this.fullscreenLoading = true
        fetchExport(formData).then(res => {
            console.log(res);
            this.fullscreenLoading = false
            const type = 'application/gzip';
            const blob = new Blob([res.data], {type: type});
            const name = decodeURI(
                res.headers['content-disposition'].split('=')[1]);
            if (window.navigator.msSaveBlob) {  //没有此判断的话，ie11下的导出没有效果
                window.navigator.msSaveBlob(blob, name);
            } else {
                const downloadElement = document.createElement('a');
                const href = window.URL.createObjectURL(blob);
                //后台再header中传文件名
                downloadElement.href = href;
                downloadElement.download = name;
                document.body.appendChild(downloadElement);
                downloadElement.click();
                document.body.removeChild(downloadElement);// 下载完成移除元素
            }
            return Promise.resolve(true);
        }).catch(() => {
            this.fullscreenLoading = false
        })
    },
    searchChange(form, done) {
      this.searchForm = form;
      this.page.currentPage = 1;
      this.getList(this.page, form);
      done();
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    refreshChange() {
      this.getList(this.page);
    },
  },
  components: {
    "PurchaseDetail": PurchaseDetail
  },
};
</script>

<style lang="scss" scoped>
    .execution {
        background: #fff;
        border-radius: 12px;
        padding: 16px 16px 50px;
        margin-top: 16px;
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          ::v-deep .el-form-item {
            margin-bottom: 0px;
          }
        }
        ::v-deep .avue-crud__menu {
          display: none;
        }
    }
</style>
