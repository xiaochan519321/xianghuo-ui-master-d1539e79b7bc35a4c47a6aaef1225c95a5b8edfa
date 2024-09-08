<template>
  <div class="error404">
    <div class="error404-body-con">
      <el-card class="box-card">
        <div class="img">
          <img src="/img/404.png" alt />
        </div>
        <div class="error404-btn-con">
          <el-button size="large" style="width: 200px;" type="primary" @click="onDown">前往下载客户端</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  methods: {
    backPage() {
      this.$router.go(-1)
    },
    goHome() {
      this.$router.push({
        path: '/'
      })
    },
    onDown () {
        
    },
  }
}
</script>
<style lang="scss" scoped>
.error404 {
  &-body-con {
    width: 700px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 38%;
    transform: translate(-50%, -50%);
  }
  &-btn-con {
    text-align: center;
    padding: 20px 0;
    margin-bottom: 40px;
  }
}
</style>
