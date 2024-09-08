<template>
  <div class="item">
    <div style="padding-left:30px">
      <p>注册链接：
        <i style="color:red;font-size:16px">https://member.guanxingshu.com/#/register?inCode=1MGE0</i>
      </p>
    </div>
    <div style="float:left;margin-top:20px">
      <el-image 
        style="width:80%; height:350px;border-radius:5%;margin-left:10%;margin-top:10px;"
        :preview-src-list="list1"
        :src='url1'>
      </el-image>
      <el-image 
        style="width:80%; height:350px;border-radius:5%;margin-left:10%;margin-top:10px;"
        :preview-src-list="list2"
        :src='url2'>
      </el-image>
      <el-image 
        style="width:80%; height:350px;border-radius:5%;margin-left:10%;margin-top:10px;"
        :preview-src-list="list3"
        :src='url3'>
      </el-image>
      <el-image 
        style="width:80%; height:350px;border-radius:5%;margin-left:10%;margin-top:10px;"
        :preview-src-list="list4"
        :src='url4'>
      </el-image>
      <el-image 
        style="width:80%; height:350px;border-radius:5%;margin-left:10%;margin-top:10px;"
        :preview-src-list="list5"
        :src='url5'>
      </el-image>
    </div>
  </div>
</template>
<script>
export default {
  name: 'choose',
  data() {
    return {
      url1: require('@/assets/tool1.png'),
      list1: [
        require('@/assets/tool1.png')
      ],

      url2: require('@/assets/tool2.png'),
      list2: [
        require('@/assets/tool2.png')
      ],

      url3: require('@/assets/tool3.png'),
      list3: [
        require('@/assets/tool3.png')
      ],

      url4: require('@/assets/tool4.png'),
      list4: [
        require('@/assets/tool4.png')
      ],

      url5: require('@/assets/tool5.png'),
      list5: [
        require('@/assets/tool5.png')
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