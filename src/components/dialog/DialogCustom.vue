<template>
  <el-dialog :title="siteConfig.id == 1?'下载钉钉软件扫码添加在线客服咨询':'联系在线客服咨询'" :visible.sync="visible" class="dialog">
    <div class="imgs" v-if="siteConfig.id == 1">
      <img src="@/assets/custom/pp.png" alt />
    </div>
    <div class="imgs" v-if="siteConfig.id == 1810202544216821762">
      <img src="@/assets/custom/js.png" alt />
    </div>
    <div class="imgs" v-if="siteConfig.id == 1810565944151515137">
      <img src="@/assets/custom/jl.jpg" alt />
    </div>
    <div class="imgs" v-if="siteConfig.id == 1766060302561169409">
      <img src="@/assets/custom/lm-1.jpg" alt />
      <img src="@/assets/custom/lm-2.jpg" alt />
    </div>
    <div class="imgs" v-if="siteConfig.id == 1813891945346191362">
      <img src="@/assets/custom/jj.jpg" alt />
    </div>
    <div class="imgs" v-if="siteConfig.id == 1817835750357606401">
      <img src="@/assets/custom/pd.png" alt />
    </div>
    <!-- <div class="imgs" v-if="siteConfig.id == 1766061118298374146">
      <img src="@/assets/custom/df-1.jpg" alt />
      <img src="@/assets/custom/df-2.jpg" alt />
    </div>
    <div class="imgs" v-if="siteConfig.id == 1765661800223989761">
      <img src="@/assets/custom/ql-1.png" alt />
      <img src="@/assets/custom/ql-2.jpg" alt />
    </div> -->
    <p class="tip">为了更好的服务客户 请{{ siteConfig.id == 1?'下载钉钉软件':'' }}添加客服</p>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: "DialogCustom",
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    ...mapGetters(['siteConfig'])
  },
  methods: {
    show() {
      this.visible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog {
  ::v-deep .el-dialog {
    width: 400px;
  }
  ::v-deep .el-dialog__body {
    padding: 0px 10px 25px;

  }
  .imgs {
    display: flex;
    align-items: center;
   
    img {
      width: 180px;
      margin: 10px auto;
    }
  }
  .tip {
    margin-top: 20px;
    text-align: center;
    color: #666;
  }
}
</style>
