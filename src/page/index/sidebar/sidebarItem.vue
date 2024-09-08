<template>
  <div class="menu-wrapper">
    <template v-for="item in menu">
      <el-menu-item
        v-if="validatenull(item[childrenKey]) && vaildRoles(item) && item.id != 10217"
        :index="item[pathKey]"
        :key="item[labelKey]"
        :class="{'is-active':vaildAvtive(item)}"
        @click="open(item)"
        >
        <i :class="item[iconKey]"/>
        <span
        slot="title"
        :alt="item[pathKey]">{{ item[labelKey] }}</span>
      </el-menu-item>
      <el-submenu
        v-else-if="!validatenull(item[childrenKey])&&vaildRoles(item)"
        :index="item[pathKey]"
        :key="item[pathKey]">
        <template slot="title">
          <i :class="item[iconKey]"/>
          <span
            slot="title"
            :class="{'el-menu--display':collapse && first}">{{ item[labelKey] }}</span>
          <el-badge
            is-dot 
            class="item" 
            v-if="unreadInfo.expiredShopNum && item.id === 10070">
          </el-badge>
          <el-badge
            is-dot 
            class="item" 
            v-if="unreadInfo.shippedOrderNum && item.id === 10001">
          </el-badge>
          <el-badge
            is-dot 
            class="item" 
            v-if="unreadInfo.afterSalesOrderNum && item.id === 10168">
          </el-badge>
        </template>
        <template v-for="(child,cindex) in item[childrenKey]">
          <el-menu-item
            v-if="validatenull(child[childrenKey])"
            :index="child[pathKey]"
            :class="{'is-active':vaildAvtive(child)}"
            :key="child[labelKey]"
            @click="open(child)">
            <i :class="child[iconKey]"/>
            <span slot="title">
              {{ child[labelKey] }}
              <!-- 店铺列表显示已失效店铺数量 -->
              <template v-if="unreadInfo.expiredShopNum && child.id === 10003">
                <el-badge class="badge" :value="value" v-if="unreadInfo.expiredShopNum >= 99"></el-badge>
                <el-badge class="badge" :value="unreadInfo.expiredShopNum" v-else></el-badge>
              </template>
              <!-- 代发订单显示已发货订单数量 -->
              <template v-if="unreadInfo.shippedOrderNum && child.id === 10018">
                <el-badge class="badge" :value="value" v-if="unreadInfo.shippedOrderNum >= 99"></el-badge>
                <el-badge class="badge" :value="unreadInfo.shippedOrderNum" v-else></el-badge>
              </template>
              <!-- 售后订单显示待处理订单数量 -->
              <template v-if="unreadInfo.afterSalesOrderNum && child.id === 10169">
                <el-badge class="badge" :value="value" v-if="unreadInfo.afterSalesOrderNum >= 99"></el-badge>
                <el-badge class="badge" :value="unreadInfo.afterSalesOrderNum" v-else></el-badge>
              </template>
            </span>
          </el-menu-item>
          <sidebar-item
            v-else
            :menu="[child]"
            :key="cindex"
            :props="props"
            :screen="screen"
            :collapse="collapse"/>
        </template>
      </el-submenu>
    </template>
    <template>
      <el-menu-item index="kuaipai" class="custom-menu-item" key="kuaipaievent"
        v-if="userInfo.identity == 'merchant'"
        @click="onHandlePay">
        <i :class="'el-icon-s-cooperation'" style="width: 18px;"/>
        <span
          slot="title"
          >{{ '支付中心' }}</span>
        <el-menu-item
          v-if="false"
          index="paycenter"
          key="paycenter"
          class="custom-menu-item"
          @click="onHandlePay">
          <i class="el-icon-shopping-bag-2" style="width: 18px;"/>
          <span slot="title">支付中心</span>
        </el-menu-item>
        <el-menu-item
          v-if="false"
          index="pddrefund"
          key="pddrefund"
          class="custom-menu-item"
          @click="onHandleRefund">
          <i class="el-icon-document" style="width: 18px;"/>
          <span slot="title">采购售后</span>
        </el-menu-item>
        <el-menu-item
          v-if="false"
          index="taoteAuth"
          key="taoteAuth"
          class="custom-menu-item"
          @click="onHandleTaote">
          <i class="el-icon-connection" style="width: 18px;"/>
          <span slot="title">淘特授权</span>
        </el-menu-item>
        <el-menu-item
          v-if="false"
          index="taoteRefund"
          key="taoteRefund"
          class="custom-menu-item"
          @click="onHandleTaoteRefund">
            <i class="el-icon-s-order" style="width: 18px;"/>
            <span slot="title">淘特售后</span>
        </el-menu-item> 
      </el-menu-item>
    </template>
    <template v-if="false">
      <el-submenu index="tool" key="toolevent">
        <template slot="title">
          <i :class="'icon-shangpinliebiao'" style="width: 18px;"/>
          <span
            slot="title"
            :class="{'el-menu--display':collapse && first}">{{ '无货专用工具' }}</span>
        </template>
        <el-menu-item
          index="illegal"
          key="illegal"
          class="custom-menu-item"
          @click="$router.push('/illegal/index')">
            <i class="el-icon-shopping-bag-2" style="width: 18px;"/>
            <span slot="title">筛选违规</span>
        </el-menu-item>
        <el-menu-item
          index="choose"
          key="choose"
          class="custom-menu-item"
          @click="$router.push('/choose/index')">
            <i class="el-icon-document" style="width: 18px;"/>
            <span slot="title">同行选品</span>
        </el-menu-item>
      </el-submenu>
    </template>
    <!-- 打开客户端 -->
    <scheme-dialog ref="scheme" @close="schemeLoading = false"/>
  </div>
</template>
<script>
import { mapGetters,mapState } from 'vuex'
import { validatenull } from '@/util/validate'
import config from './config.js'
import { getExpiredShopNum,getShippedOrderNum,getAfterSaleOrderNum } from '../../../api/menu/api.js'
import schemeDialog from '@/components/scheme/scheme'
import { getClientStatus } from '@/api/info'
export default {
name: 'SidebarItem',
props: {
  menu: {
    type: Array
  },
  screen: {
    type: Number
  },
  first: {
    type: Boolean,
    default: false
  },
  props: {
    type: Object,
    default: () => {
      return {}
    }
  },
  collapse: {
    type: Boolean
  }
},
data() {
  return {
    schemeLoading: false,
    clientStatus: 0,
    config: config,
    unreadInfo: {},
    value: '99+',
    system: ''
  }
},
components: {
  schemeDialog
},
created() {
  console.log('menu', this.menu)
  if (window.electron) {
    this.system = 'webview'
  }
  this.onClientStatus()
},
mounted() {
  this.getExpiredShopNum();
  this.getShippedOrderNum();
  this.getAfterSaleOrderNum();
},
computed: {
  hasToolsAuth () {
    if (this.menu) {
      return this.menu.filter(item => item.id === 10217).length
    }
    return false
  },
  ...mapGetters(['roles', 'siteConfig']),
  ...mapState({
    userInfo: (state) => state.user.userInfo
  }),
  labelKey() {
    return this.props.label || this.config.propsDefault.label
  },
  pathKey() {
    return this.props.path || this.config.propsDefault.path
  },
  iconKey() {
    return this.props.icon || this.config.propsDefault.icon
  },
  childrenKey() {
    return this.props.children || this.config.propsDefault.children
  },
  nowTagValue() {
    return this.$router.$avueRouter.getValue(this.$route)
  }
},
methods: {
  getExpiredShopNum() {
    getExpiredShopNum().then(res => {
      this.unreadInfo.expiredShopNum = res.data.data;
    }).catch(() => {});
  },
  getShippedOrderNum() {
    getShippedOrderNum().then(res => {
      this.unreadInfo.shippedOrderNum = res.data.data;
    }).catch(() => {});
  },
  getAfterSaleOrderNum() {
    getAfterSaleOrderNum().then(res => {
      this.unreadInfo.afterSalesOrderNum = res.data.data;
    }).catch(() => {});
  },
  vaildAvtive(item) {
    const groupFlag = (item['group'] || []).some(ele =>
      this.$route.path.includes(ele)
    )
    return this.nowTagValue === item[this.pathKey] || groupFlag
  },
  vaildRoles(item) {
    item.meta = item.meta || {}
    return item.meta.roles ? item.meta.roles.includes(this.roles) : true
  },
  validatenull(val) {
    return validatenull(val)
  },
  open(item) {
    if (this.screen <= 1) this.$store.commit('SET_COLLAPSE')
    this.$router.$avueRouter.group = item.group
    this.$router.push({
      path: this.$router.$avueRouter.getPath({
        name: item[this.labelKey],
        src: item[this.pathKey]
      }),
      query: item.query
    }).catch(() => {})
  },
  // 支付中心
  onHandlePay () {
    if (window.electron) {
      window.electron.ipcRenderer.send('pay-window', {path:'/pay'})
    } else {
      this.$confirm('请确保当前已经登录，否则将无法获取!', '温馨提示', {
        confirmButtonText: '前往获取',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.onOpenClient()
      }).catch(() => {})
    }
  },
  // 启动客户端
  onOpenClient () {
    let number = 0
      if (this.clientStatus == 1) {
        window.location.href = 'kuaipai://client?router=dashboard'
      } else {
        this.$refs.scheme.schemeOpen(`kuaipai://client?router=dashboard`)
        this.schemeLoading = true
        timer = setInterval(async () => {
            const { data } = await getClientStatus()
            this.clientStatus = data.data
            if (data.data == 1 || number >= 3) {
              clearInterval(timer)
              timer = null
              number = null
              this.$refs.scheme.clearTimer()
            }
            number++
        }, 5000)
      }
  },
  // 检测客户端是否在线
  async onClientStatus () {
    const { data } = await getClientStatus()
    this.clientStatus = data.data
  },
  // PDD售后
  onHandleRefund () {
    window.electron.ipcRenderer.send('refund-window', {path: '/afterSale'})
  },
  onHandleTaote () {
    window.electron.ipcRenderer.send('refund-window', {path: '/taote'})
  },
  onHandleTaoteRefund () {
    window.electron.ipcRenderer.send('refund-window', {path: '/taoteRefund'})
  }
}
}
</script>
<style lang="scss" scoped>
.badge {
  padding-top: 5px;
  padding-left: 3px;
}
// .aside {
//   // font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif !important;
//   // font: 14px/1.5 Tahoma,Helvetica,Arial,'宋体',sans-serif;
//   // font: 12px/150% Arial,Verdana,"宋体";
//   // font: 12px/20px "SimSun","宋体","Arial Narrow",HELVETICA;
//   // font-family: ' EB Garamond';
//   // font-family: 'Montserrat', sans-serif;
//   // font-family: 'Arial' sans-serif !important;
//   // font: 12px/20px "SimSun","宋体","Arial Narrow",HELVETICA;
//   // font-family: 'STHeiti' !important;
//   // font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
//   // font-family: Arial, sans-serif;
//   // font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif !important;
//   // font: 12px/1 Tahoma,Helvetica,Arial,"\5b8b\4f53",sans-serif;
//   // font-family: 'SourceHanSansSC', sans-serif;
//   font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
//   font: 10px/1 Tahoma,Helvetica,Arial,"\5b8b\4f53",sans-serif;
//   // font-family: Helvetica,Arial,"Hiragino Sans GB","Microsoft Yahei","华文细黑",sans-serif !important;
//   // font-size: x-large;
//   font-size: large;
//   font-weight: 800;
//   // color: black !important;
// }
.item {
  padding-left: 5px;
}
  // .menu-wrapper {
  //     .custom-menu-item.is-active {
  //         background-color: #fff !important;
  //         i,span {
  //             color: #666 !important;
  //         }
  //     }
  // }
  // .el-menu-item:hover {
  //   color: #fff !important;
  // }
  // .el-submenu__title:hover {
  //   color: #fff !important;
  // }
  // .el-menu-item.is-active {
  //   background-color: #48b66f !important;
  // }
</style>
