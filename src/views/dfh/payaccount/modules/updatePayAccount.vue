<template>
  <div>
    <el-form :model="form" ref="checkForm">
      <el-form-item label="绑定店铺">
        <el-select v-model="form.shopIds" multiple placeholder="请选择要绑定的店铺" style="width: 80%;">
          <el-option
            v-for="item in shopList"
            :key="item.id"
            :label="item.shopName"
            :value="item.id"
          />
        </el-select>
        <el-form-item
          label="绑定账号ID"
          prop="id"
          style="position: absolute; z-index: 1; display: none"
        >
          <el-input v-model="form.id" :readonly="false"></el-input>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { addBinding } from "@/api/dfh/dfhpaybinding";
import { getAllShopList } from "@/api/dfh/shop";
export default {
  data() {
    return {
      shopList: [],
      form: {
        shopName: "",
        id: 0,
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      getAllShopList().then((res) => {
        console.log(res.data.data);
        this.shopList = res.data.data;
      });
    },
    addBinding() {
      var than = this;
      let params = {
        payAccountId: than.form.id,
        shopIds: than.form.shopIds ? than.form.shopIds : []
      };
      console.log(than.form);
      this.$refs["checkForm"].validate((valid) => {
        if (valid) {
          addBinding(params)
            .then((data) => {
              this.$message.success("绑定成功");
              this.$emit("ok");
              than.checkForm = {};
            })
            .catch(() => {
              loading();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>