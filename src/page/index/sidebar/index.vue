<template>
  <div class="avue-sidebar" id="avue-sidebar">
    <logo />
    <el-scrollbar style="height:calc(100% - 48px)">
      <div v-if="validatenull(menu)" class="avue-sidebar--tip">没有发现菜单</div>
      <el-menu
        :default-active="nowTagValue"
        :show-timeout="200"
        :collapse="keyCollapse"
        mode="vertical"
      >
        <sidebar-item
          :menu="menu"
          :screen="screen"
          :props="website.menu.props"
          :collapse="keyCollapse"
          first
        />
      </el-menu>
    </el-scrollbar>
    <div class="breadcrumb" :style="{width:isCollapse? '64px' : '100%'}">
      <i class="icon-navicon" style="cursor:pointer; color: #BBBDBF; font-size: 24px;" @click="setCollapse" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import logo from '../logo'
import sidebarItem from './sidebarItem'
import { debounce } from '@/scripts/utils/index';

export default {
  name: 'Sidebar',
  inject: ["Index"],
  components: { sidebarItem, logo },
  created() {
    this.Index.openMenu(this.menuId);
  },
  computed: {
    ...mapState({
      showCollapse: state => state.common.showCollapse,
      isCollapse: state => state.isCollapse,
    }),
    ...mapGetters(['website', 'menu', 'tag', 'keyCollapse', 'screen', 'isCollapse']),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route)
    }
  },
  mounted() {
    this.setSliderBarCollapse()
    window.addEventListener('resize', debounce(() => this.setSliderBarCollapse()), 10)
  },
  methods: {
    setSliderBarCollapse() {
      const width = window.innerWidth;
      if(width < 1500) {
        if(!this.isCollapse) {
          this.$store.commit('SET_COLLAPSE')
        }

      } else {
        if(this.isCollapse) {
          this.$store.commit('SET_COLLAPSE')
        }
      }
    },
    setCollapse() {
      this.$store.commit('SET_COLLAPSE')
    },
  }
}
</script>
