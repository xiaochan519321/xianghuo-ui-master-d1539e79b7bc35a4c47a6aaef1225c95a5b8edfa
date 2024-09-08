<template>
  <div class="item">
    <div style="padding-left:30px">
      <p>会员里面会赠送500积分,🌞积分使用规则
        <i style="color:red;font-size:14px">(需要软件 可以联系右上角客服)</i>:
      </p>
      <span>
        【同行店铺】
        1、免费解密100次，超过100次按1积分/次
        2、导出1个店铺1积分（0.1元），不限店铺内链接数量
      </span>
      <span>
        【爆款跟卖】
        不筛选一次性导出1000个商品10积分（1元）
        精细化选品导出100个商品10积分（1元）
      </span>
      <span>
        【整店采集】
        一天有5次免费采集名额，超出按50积分/店铺，不论店铺链接数量
      </span>
      <span>
        【整店可视化】
        导出1个店铺50积分（5元），支持在线扫码查看商品详情，筛选及导出商品链接
      </span>
    </div>
    <div style="float:left;margin-top:50px">
      <el-image 
        style="width: 23%; height: 350px;border-radius: 5%;margin-left: 1.5%"
        :preview-src-list="list1"
        :src='url1'>
      </el-image>
      <el-image 
        style="width: 23%; height: 350px;border-radius: 5%;margin-left: 1.5%"
        :preview-src-list="list2"
        :src='url2'>
      </el-image>
      <el-image 
        style="width: 23%; height: 350px;border-radius: 5%;margin-left: 1.5%"
        :preview-src-list="list3"
        :src='url3'>
      </el-image>
      <el-image 
        style="width: 23%; height: 350px;border-radius: 5%;margin-left: 1.5%"
        :preview-src-list="list4"
        :src='url4'>
      </el-image>
    </div>
  </div>
</template>
<script>
export default {
  name: 'choose',
  data() {
    return {
      url1: require('@/assets/img1.png'),
      list1: [
        require('@/assets/img1.png')
      ],

      url2: require('@/assets/img2.png'),
      list2: [
        require('@/assets/img2.png')
      ],

      url3: require('@/assets/img3.png'),
      list3: [
        require('@/assets/img3.png')
      ],

      url4: require('@/assets/img4.png'),
      list4: [
        require('@/assets/img4.png')
      ]
    }
  },
  created () {},
  computed: {},
  methods: {},
  mounted() {},
}
</script>

<style scoped lang="scss">
.item{
  width: 100%;
  height: 100%;
}
p {
  font-size: 22px;
  width: 100%;
  line-height: 40px;
}
span {
  font-size: 14px;
  width: 100%;
  float: left;
  margin-top: 15px;
}
</style>