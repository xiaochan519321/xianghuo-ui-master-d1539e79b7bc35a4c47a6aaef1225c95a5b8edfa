`<!--
  -    Copyright (c) 2018-2025, lzyq All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of thelayq.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lzyq
  -->

<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <el-row>
        <el-col
          :span="24"
          style="margin-top:15px;">
          <el-card class="box-card">
            <el-form
              ref="form"
              :label-position="labelPosition"
              :rules="rules"
              :model="form"
              :inline="true"
              label-width="150px">
              <el-tabs v-model="tabName" >
                <el-tab-pane label="站点信息" name="first">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        label="免费域名"
                        prop="freeDomain">
                        <el-input
                          v-model="form.freeDomain"
                          :disabled="true"
                          placeholder="系统自动分配免费域名"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="网站域名"
                        prop="domain">
                        <el-input
                          v-model="form.domain"
                          :disabled="formEdit"
                          placeholder="请输入网站域名"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="网站备案号"
                        prop="icp">
                        <el-input
                          v-model="form.icp"
                          :disabled="formEdit"
                          placeholder="请输入网站备案号"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        label="网站名称"
                        prop="name">
                        <el-input
                          v-model="form.name"
                          :disabled="formEdit"
                          placeholder="请输入网站名称"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="网站标题"
                        prop="title">
                        <el-input
                          v-model="form.title"
                          :disabled="formEdit"
                          placeholder="请输入网站标题"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="公司名"
                        prop="company">
                        <el-input
                          v-model="form.company"
                          :disabled="formEdit"
                          placeholder="请输入公司名"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>

                    <el-col :span="8">
                      <el-form-item
                        label="公司地址"
                        prop="address">
                        <el-input
                          v-model="form.address"
                          :disabled="formEdit"
                          placeholder="请输入公司地址"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="咨询热线"
                        prop="phone">
                        <el-input
                          v-model="form.phone"
                          :disabled="formEdit"
                          placeholder="请输入咨询热线"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        label="网站描述"
                        prop="describe">
                        <el-input
                          type="textarea"
                          style="width: 105%"
                          :autosize = "{ minRows: 5, maxRows: 1000 }"
                          resize="none"
                          v-model="form.describe"
                          :disabled="formEdit"
                          placeholder="请输入网站描述"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="网站关键词"
                        prop="keyword">
                        <el-input
                          type="textarea"
                          style="width: 105%"
                          :autosize = "{ minRows: 5, maxRows: 1000 }"
                          resize="none"
                          v-model="form.keyword"
                          :disabled="formEdit"
                          placeholder="请输入网站关键词"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="关于我们"
                        prop="features">
                        <el-input
                          type="textarea"
                          style="width: 105%"
                          :autosize = "{ minRows: 5, maxRows: 1000 }"
                          resize="none"
                          v-model="form.features"
                          :disabled="formEdit"
                          placeholder="请输入关于我们"/>
                      </el-form-item>
                    </el-col>
                  </el-row>

                </el-tab-pane>
                <el-tab-pane label="站点LOGO" name="second">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="网站icon" prop="icon">
                        <el-upload
                          :disabled="formEdit"
                          :headers="headers"
                          :show-file-list="false"
                          :on-success="handleIconSuccess"
                          :before-upload="beforeIconUpload"
                          class="avatar-uploader"
                          action="/admin/sys-file/upload"
                        >
                          <img v-if="form.icon" id="icon" :src="iconUrl" class="avatar" />
                          <i v-else class="el-icon-plus avatar-uploader-icon" />
                        </el-upload>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="网站logo" prop="htLogo">
                        <el-upload
                          :disabled="formEdit"
                          :headers="headers"
                          :show-file-list="false"
                          :before-upload="beforeHtLogoUpload"
                          :on-success="handleHtLogoSuccess"
                          class="avatar-uploader"
                          action="/admin/sys-file/upload"
                        >
                          <img v-if="form.htLogo" id="htLogo" :src="htLogoUrl" class="avatar" />
                          <i v-else class="el-icon-plus avatar-uploader-icon" />
                        </el-upload>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="客服二维码" prop="contactQrcode">
                        <el-upload
                          :disabled="formEdit"
                          :headers="headers"
                          list-Type="picture-img"
                          :show-file-list="false"
                          :on-success="handleContactQrcodeSuccess"
                          class="avatar-uploader"
                          action="/admin/sys-file/upload"
                        >
                          <img v-if="form.contactQrcode" id="contactQrcode" :src="contactQrcodeUrl" class="avatar" />
                          <i v-else class="el-icon-plus avatar-uploader-icon" />
                        </el-upload>
                      </el-form-item>
                    </el-col>

                    <!--                    <el-col :span="8">
                                          <el-form-item label="前台网站logo" prop="qtLogo">
                                            <el-upload
                                              :disabled="formEdit"
                                              :headers="headers"
                                              :show-file-list="false"
                                              :on-success="handleQtLogoSuccess"
                                              class="avatar-uploader"
                                              action="/admin/sys-file/upload"
                                            >
                                              <img v-if="form.qtLogo" id="qtLogo" :src="qtLogoUrl" class="avatar" />
                                              <i v-else class="el-icon-plus avatar-uploader-icon" />
                                            </el-upload>
                                          </el-form-item>
                                        </el-col>-->
                  </el-row>
<!--                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="网站头部logo" prop="headerLogo">
                        <el-upload
                          :disabled="formEdit"
                          :headers="headers"
                          :show-file-list="false"
                          :before-upload="beforeHeaderLogoUpload"
                          :on-success="handleHeaderLogoSuccess"
                          class="avatar-uploader"
                          action="/admin/sys-file/upload"
                        >
                          <img v-if="form.headerLogo" id="headerLogo" :src="headerLogoUrl" class="avatar" />
                          <i v-else class="el-icon-plus avatar-uploader-icon" />
                        </el-upload>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="网站底部logo" prop="buttomLogo">
                        <el-upload
                          :disabled="formEdit"
                          :headers="headers"
                          :show-file-list="false"
                          :on-success="handleButtomLogoSuccess"
                          class="avatar-uploader"
                          action="/admin/sys-file/upload"
                        >
                          <img v-if="form.buttomLogo" id="buttomLogo" :src="buttomLogoUrl" class="avatar" />
                          <i v-else class="el-icon-plus avatar-uploader-icon" />
                        </el-upload>
                      </el-form-item>
                    </el-col>

                  </el-row>-->
                </el-tab-pane>

<!--                <el-tab-pane label="客服配置" name="third">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        label="客服弹窗状态"
                        prop="contactAutoOpen">
                        <el-select
                          v-model="form.contactAutoOpen"
                          :disabled="formEdit"
                          style="width: 93%"
                          placeholder="请选择客服弹窗状态">
                          <el-option label="不自动弹出" :value="0"></el-option>
                          <el-option label="登录后自动弹出" :value="1"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="客服按钮文案"
                        prop="contactBtnText">
                        <el-input
                          style="width: 105%"
                          autosize
                          resize="none"
                          v-model="form.contactBtnText"
                          :disabled="formEdit"
                          placeholder="请输入客服按钮文案"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="客服标题"
                        prop="contactTitle">
                        <el-input
                          style="width: 105%"
                          autosize
                          resize="none"
                          v-model="form.contactTitle"
                          :disabled="formEdit"
                          placeholder="请输入客服标题"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="客服描述"
                        prop="contactDesc">
                        <el-input
                          type="textarea"
                          style="width: 105%"
                          autosize
                          resize="none"
                          v-model="form.contactDesc"
                          :disabled="formEdit"
                          placeholder="请输入客服描述"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="客服二维码" prop="contactQrcode">
                        <el-upload
                          :disabled="formEdit"
                          :headers="headers"
                          list-Type="picture-img"
                          :show-file-list="false"
                          :on-success="handleContactQrcodeSuccess"
                          class="avatar-uploader"
                          action="/admin/sys-file/upload"
                        >
                          <img v-if="form.contactQrcode" id="contactQrcode" :src="contactQrcodeUrl" class="avatar" />
                          <i v-else class="el-icon-plus avatar-uploader-icon" />
                        </el-upload>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="客服按钮图标" prop="contactBtnIcon">
                        <el-upload
                          :disabled="formEdit"
                          :headers="headers"
                          list-Type="picture-img"
                          :show-file-list="false"
                          :on-success="handleContactBtnIconSuccess"
                          class="avatar-uploader"
                          action="/admin/sys-file/upload"
                        >
                          <img v-if="form.contactBtnIcon" id="contactBtnIcon" :src="contactBtnIconUrl" class="avatar" />
                          <i v-else class="el-icon-plus avatar-uploader-icon" />
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-tab-pane>-->
              </el-tabs>
              <el-row>
                <el-col :span="8"></el-col>
                <el-col :span="16">
                  <el-form-item v-if="formStatus == 'update'" size="medium">
                    <el-button
                      type="primary"
                      @click="update">更新
                    </el-button>
                    <el-button @click="reset">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-form>

          </el-card>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { handleImg, openWindow } from "@/util/util";
import { getCurrentSite,addObj, delObj, fetchTree, getObj, putObj } from '@/api/admin/site'
import { mapGetters } from 'vuex'
import store from "@/store";

export default {
  name: 'syssiteinfo',
  data() {
    return {
      tabName: "first",
      imgDomain: "http://bucket.damaijia.co/",
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      typeOptions: ['0', '1'],
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
      listQuery: {
        name: undefined
      },
      iconUrl: "",
      qtLogoUrl: "",
      htLogoUrl: "",
      headerLogoUrl: "",
      buttomLogoUrl: "",
      contactQrcodeUrl: "",
      contactBtnIconUrl: "",
      contactAutoOpen: undefined,
      contactBtnText: undefined,
      contactTitle: undefined,
      contactDesc: undefined,
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        parentId: [
          { required: true, message: '请选择父级节点', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入网站名称', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
        ],
        title: [
          { required: true, message: '请输入网站标题', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请上传网站浏览器icon', trigger: 'blur' }
        ],
        htLogo: [
          { required: true, message: '请上传后台网站logo', trigger: 'blur' }
        ],
        contactQrcode: [
          { required: true, message: '请上传网站客服二维码', trigger: 'blur' }
        ]
        /*qtLogo: [
          { required: true, message: '请上传前台网站logo', trigger: 'blur' }
        ],*/
        /*headerLogo: [
          { required: true, message: '请上传网站头部logo', trigger: 'blur' }
        ],
        buttomLogo: [
          { required: true, message: '请上传网站底部logo', trigger: 'blur' }
        ],*/

      },
      labelPosition: 'right',
      form: {
        name: undefined,
        parentId: undefined,
        type: undefined,
        features: undefined,
        company: undefined,
        address: undefined,
        phone: undefined,
        freeDomain: undefined,
        domain: undefined,
        icp: undefined,
        title: undefined,
        keyword: undefined,
        describe: undefined,
        icon: undefined,
        htLogo: undefined,
        contactQrcode: undefined,
        /*qtLogo: undefined,
        headerLogo: undefined,
        buttomLogo: undefined,
        contactBtnIcon: undefined,
        contactAutoOpen: undefined,
        contactBtnText: undefined,
        contactTitle: undefined,
        contactDesc: undefined,*/
        templateId: 1,
        lockFlag: undefined,
        id: undefined
      },
      currentId: 0,
      siteManager_btn_edit: false,
    }
  },
  created() {
    this.getFormData()
    this.siteManager_btn_edit = this.permissions['sys_site_edit']
  },
  computed: {
    ...mapGetters([
      'elements',
      'permissions'
    ])
  },
  methods: {
    reset(){
      this.getFormData()
    },
    getFormData() {
      getCurrentSite().then(response => {
        this.form = response.data.data
        this.currentId = this.form.id
        this.iconUrl = this.imgDomain + this.form.icon
        this.htLogoUrl = this.imgDomain + this.form.htLogo
        this.contactQrcodeUrl = this.imgDomain + this.form.contactQrcode
        /*this.qtLogoUrl = this.imgDomain + this.form.qtLogo
        this.headerLogoUrl = this.imgDomain + this.form.headerLogo
        this.buttomLogoUrl = this.imgDomain + this.form.buttomLogo
        this.contactBtnIconUrl = this.imgDomain + this.form.contactBtnIcon*/
      })
      this.formEdit = false
      this.formStatus = 'update'
    },

    beforeIconUpload(file){
      let width = 128
      let height = 128
      const isSize = new Promise(function(resolve, reject){
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function(){
          console.log('上传图片尺寸：%s*%s',img.width,img.height)
          let valid = img.width<=width && img.height <= height;
          valid ? resolve() : reject();
        }
        img.src = _URL.createObjectURL(file);
      }).then(()=>{
        return file;
      }, ()=>{
        this.$notify.error("图片尺寸规格要求：小于等于" + width + '*'+ height)
        return Promise.reject()
      })
      return isSize
    },
    beforeHtLogoUpload(file){
      let width = 850
      let height = 850
      const isSize = new Promise(function(resolve, reject){
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function(){
          let valid = img.width<=width && img.height <= height;
          valid ? resolve() : reject();
        }
        img.src = _URL.createObjectURL(file);
      }).then(()=>{
        return file;
      }, ()=>{
        this.$notify.error("图片尺寸规格要求：小于等于" + width + '*'+ height)
        return Promise.reject()
      })
      return isSize
    },
    beforeHeaderLogoUpload(file){
      let width = 101
      let height = 38
      const isSize = new Promise(function(resolve, reject){
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function(){
          let valid = img.width<=width && img.height <= height;
          valid ? resolve() : reject();
        }
        img.src = _URL.createObjectURL(file);
      }).then(()=>{
        return file;
      }, ()=>{
        this.$notify.error("图片尺寸规格要求：小于等于" + width + '*'+ height)
        return Promise.reject()
      })
      return isSize
    },
    handleIconSuccess(res, file) {
      this.iconUrl = URL.createObjectURL(file.raw);
      this.form.icon = res.data.url;
    },
    handleQtLogoSuccess(res, file) {
      this.qtLogoUrl = URL.createObjectURL(file.raw);
      this.form.qtLogo = res.data.url;
    },
    handleHtLogoSuccess(res, file) {
      this.htLogoUrl = URL.createObjectURL(file.raw);
      this.form.htLogo = res.data.url;
    },
    handleHeaderLogoSuccess(res, file) {
      this.headerLogoUrl = URL.createObjectURL(file.raw);
      this.form.headerLogo = res.data.url;
    },
    handleButtomLogoSuccess(res, file) {
      this.buttomLogoUrl = URL.createObjectURL(file.raw);
      this.form.buttomLogo = res.data.url;
    },
    handleContactQrcodeSuccess(res, file) {
      this.contactQrcodeUrl = URL.createObjectURL(file.raw);
      this.form.contactQrcode = res.data.url;
    },
    handleContactBtnIconSuccess(res, file) {
      this.contactBtnIconUrl = URL.createObjectURL(file.raw);
      this.form.contactBtnIcon = res.data.url;
    },

    update() {
      this.$refs.form.validate((valid,object) => {
        if (!valid){
          let prop = Object.keys(object)[0]
          if(prop==='icon' || prop.indexOf("Logo") !== -1 || prop.indexOf("contact") !== -1){
            this.tabName = "second"
          }else{
            this.tabName = "first"
          }
          return
        }
        putObj(this.form).then((response) => {
          if(response.data.code!=0){
            this.$notify.error('更新失败,'+response.data.msg)
          }else{
            this.getFormData()
            this.$notify.success('更新成功')
          }

        }).catch((e) => {
          this.$notify.error('更新失败')
        })
      })
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/info.scss";
</style>
