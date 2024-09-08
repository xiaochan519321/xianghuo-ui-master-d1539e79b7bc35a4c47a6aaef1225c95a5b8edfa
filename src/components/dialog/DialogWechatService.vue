<template>
  <div class="dialog-service-container">
    <el-dialog-custom width="600px" :visible="visible" @close="visible = false">
      <!-- 商务客服 -->
      <div class="content flex flex-col items-center" v-if="isAgree">
        <div class="font16 font-w-600 pt30">
          <div class="pl20 font24 font-weight:800" style="color: #000">
            最新通知：
          </div>
          <div
            style="
              width: 600px;
              padding: 20px;
              line-height: 24px;
              white-space: normal;
              word-wrap: break-word;
              overflow-wrap: break-word;
            "
          >
             拍单已恢复 额度不够联系客服
          </div>
          <i class="iconfont icon-close2 font28" @click="visible = false"></i>
        </div>
        <!-- <div class="mt10 activeCode" style="width: 100%" v-if="active == 1">
          <el-image
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 180px;
            "
            src="/img/wx/bow.jpg"
          />
        </div>

        <div class="code p10 mt10" v-else>
          <el-image :src="`${siteConfig.contactQrcode}`" v-if="siteConfig" />
        </div> -->
        <p class="mt15 lh20 font13">
          <!-- <span>联系客服，请用飞书扫一扫</span> -->
          <!-- <span>剩下事务联系客服处理</span> -->
        </p>
      </div>

      <!-- 宅急送 -->
      <div class="content flex flex-col items-center" v-if="impatient">
        <div class="font16 font-w-600 pt30">
          <div class="pl20 font24 font-weight:800" style="color: #000">
            宅急送通知：
          </div>
          <!-- <h2 style="text-align: center;font-size: 20px;font-weight: 800;color: #000;">现在联系客服领取赔付</h2> -->
          <!-- <div
            style="width: 600px; padding: 20px; line-height: 24px; white-space: normal; word-wrap: break-word; overflow-wrap: break-word;"
          >
          现在拍单已经恢复正常，现在起售后可以正常处理。之前的售后订单包含损失，现在正在修复，可以统计一下发给客服，统一补偿面单或者积分。另由于之前软件出现的问题，造成大家处理不及时，所以会增加个人号拍单功能，供求大家进行使用，个人号拍单功能时间大概在一周左右上线。以后软件有什么需求大家可以私聊我一下，尽量满足所有人的需求，这段时间给大家带来不便，抱歉。
        </div> -->
          <div
            style="
              width: 600px;
              padding: 20px;
              line-height: 24px;
              white-space: normal;
              word-wrap: break-word;
              overflow-wrap: break-word;
            "
          >
            &nbsp; &nbsp; &nbsp;
            &nbsp;我们已经上线丰巢系统取件码的功能，如果消费者遇到取件码无法取出的问题，可以咨询丰巢客服中心，提供原始运单号和宅急送运单号，丰巢那边可以协助客户远程开门。我们在物流信息的最后一条也会指引。第二版本会将取件码直接推送到电商平台，到时候在行通知。
          </div>
          <i class="iconfont icon-close2 font28" @click="visible = false"></i>
        </div>
        <!-- <div class=" mt10 activeCode" style="width: 100%;" v-if="active == 1">
          <el-image :style="style" src="/img/wx/service01_v2.jpg" />
          <el-image :style="style" src="/img/wx/service02_v2.jpg" />
          <el-image :style="style" src="/img/wx/service03_v2.jpg" />
          <el-image :style="style" src="/img/wx/service04_v2.jpg" />
          <el-image :style="style" src="/img/wx/service05_v2.jpg" />
        </div>
        <div class="code p10 mt10" v-else>
          <el-image :src="`${siteConfig.contactQrcode}`" v-if="siteConfig" />
        </div>
        <p class="mt15 lh20 font13">
          <span>联系客服，请用飞书扫一扫</span>
        </p> -->
      </div>

      <!-- 公告 -->
      <div class="content flex flex-col items-center" v-if="Notice">
        <template>
          <div class="font16 font-w-600 pt30">
          <div class="pl20 font24 font-weight:800" style="color: #000">
            最新通知：
          </div>
          <h2
            style="
              text-align: center;
              font-size: 20px;
              font-weight: 800;
              color: #000;
            "
          >
            现在联系客服领取赔付
          </h2>
          <div
            style="
              width: 600px;
              padding: 20px;
              line-height: 24px;
              white-space: normal;
              word-wrap: break-word;
              overflow-wrap: break-word;
            "
          >
            现在拍单已经恢复正常，现在起售后可以正常处理。之前的售后订单包含损失，现在正在修复，可以统计一下发给客服，统一补偿面单或者积分。另由于之前软件出现的问题，造成大家处理不及时，所以会增加个人号拍单功能，供求大家进行使用，个人号拍单功能时间大概在一周左右上线。以后软件有什么需求大家可以私聊我一下，尽量满足所有人的需求，这段时间给大家带来不便，抱歉。
          </div>

          <i class="iconfont icon-close2 font28" @click="visible = false"></i>
        </div>
        <div class="mt10 activeCode" style="width: 100%" v-if="active == 1">
          <el-image :style="style" src="/img/wx/service01_v2.jpg" />
          <el-image :style="style" src="/img/wx/service02_v2.jpg" />
          <el-image :style="style" src="/img/wx/service03_v2.jpg" />
          <el-image :style="style" src="/img/wx/service04_v2.jpg" />
          <el-image :style="style" src="/img/wx/service05_v2.jpg" />
        </div>
        <div class="code p10 mt10" v-else>
          <el-image :src="`${siteConfig.contactQrcode}`" v-if="siteConfig" />
        </div>
        </template>
        <p class="mt15 lh20 font13">
          <span>联系客服，请用飞书扫一扫</span>
        </p>
      </div>
    </el-dialog-custom>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ElDialogCustom from '@/components/base/ElDialogCustom'
import { getStore } from '@/util/store'

export default {
  components: {
    ElDialogCustom
  },
  data() {
    return {
      visible: true,
      active: 0,
      style: {
        width: '100px',
        height: '100px',
        marginLeft: '10px'
      },
      isAgree: true,
      impatient: false,
      Notice: false
    }
  },
  computed: {
    ...mapGetters(['siteConfig'])
  },
  mounted() {
    this.initData()
    this.impatientHandler()
    this.NoticeHandler()
    this.active = getStore({ name: 'tenantId' })
  },
  beforeDestroy() {
    this.$bus.$off('wechat')
  },
  methods: {
    // 商务客服
    initData() {
      this.$bus.$on('wechat', () => {
        this.isAgree = false
        this.Notice = true
        this.impatient = false
        this.visible = true
      })
    },
    // 宅急送
    impatientHandler() {
      this.$bus.$on('impatient', () => {
        // this.isAgree = false
        // this.Notice = false
        // this.visible = true;
        this.isAgree = false
        this.Notice = false
        this.impatient = true
        this.visible = true
      })
    },
    NoticeHandler() {
      this.$bus.$on('Notice', () => {
        // this.Notice = true
        // this.visible = true;
        this.isAgree = true
        this.Notice = false
        this.impatient = false
        this.visible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-service-container {
  ::v-deep .el-dialog {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0);
  }
  .color-l {
    color: $themeColor;
  }
  .content {
    height: 400px;
    background: #fff;
    border-radius: 6px;
    box-sizing: border-box;
    position: relative;

    .iconfont {
      position: absolute;
      right: 10px;
      top: 5px;
      color: #333;
      cursor: pointer;
    }
    .code {
      width: 179px;
      height: 179px;
      border-radius: 8px;
      box-sizing: border-box;
    }
  }
}
</style>
