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
      <div class="filter-container">
        <el-button-group>
          <el-button
            v-if="siteManager_btn_add"
            type="primary"
            icon="plus"
            @click="handlerAdd">添加
          </el-button>
          <el-button
            v-if="siteManager_btn_edit"
            type="primary"
            icon="edit"
            @click="handlerEdit">编辑
          </el-button>
          <el-button
            v-if="siteManager_btn_del"
            type="primary"
            icon="delete"
            @click="handleDelete">删除
          </el-button>
          <el-button
            v-if="siteManager_btn_init_balance"
            type="primary"
            icon="delete"
            @click="handleRecharge">初始化站点余额
          </el-button>
          <el-button
            v-if="siteManager_btn_init_member_config"
            type="primary"
            icon="delete"
            @click="handleMemboConfig">站点赠送套餐配置
          </el-button>
        </el-button-group>
      </div>

      <el-row>
        <el-col
          :span="5"
          style="margin-top:15px;">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            class="filter-tree"
            node-key="id"
            highlight-current
            default-expand-all
            @node-click="getNodeData"/>
        </el-col>
        <el-col
          :span="19"
          style="margin-top:15px;">
          <el-card class="box-card">
            <el-form
              ref="form"
              :label-position="labelPosition"
              :rules="rules"
              :model="form"
              :inline="true"
              label-width="120px">
              <!--<el-form-item
                label="父级节点"
                prop="parentId">
                <el-input
                  v-model="form.parentId"
                  disabled
                  placeholder="请选择父级节点"/>
              </el-form-item>-->
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
                      <el-form-item label="站点类型" prop="type">
                        <el-select
                          v-model="form.type"
                          :disabled="formEdit || (!formEdit && !profitsRateFlag)"
                          style="width: 93%"
                          placeholder="请选择站点类型">
                          <el-option v-if="mainSiteOptionFlag" label="主站" value="1" disabled></el-option>
                          <el-option label="分站" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
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
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        label="充值倍数"
                        prop="profitsRate">
                        <el-input
                          v-model="form.profitsRate"
                          :disabled="formEdit || (!formEdit && !profitsRateFlag)"
                          placeholder="请输入充值倍数">
                        </el-input>
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
                  <el-row>
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
                <el-tab-pane v-if="rootSiteFlag && mainSiteOptionFlag" label="站点权限" name="fourth">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        label="分站数量"
                        prop="subSiteNum">
                        <el-input
                          type="number"
                          style="width: 105%"
                          autosize
                          resize="none"
                          v-model="form.subSiteNum"
                          :disabled="formEdit"
                          placeholder="请输入分站数量"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-tab-pane>
              </el-tabs>

              <el-row>
                <el-col :span="16">
                  <el-form-item v-if="formStatus === 'update'">
                    <el-button
                      type="primary"
                      @click="update">更新
                    </el-button>
                    <el-button @click="onCancel">取消</el-button>
                  </el-form-item>
                  <el-form-item v-if="formStatus === 'create'">
                    <el-button
                      type="primary"
                      @click="create">保存
                    </el-button>
                    <el-button @click="onCancel">取消</el-button>
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
import { handleImg } from "@/util/util";
import { addObj, delObj, fetchTree, getObj, putObj, initBalance } from '@/api/admin/site'
import { mapGetters } from 'vuex'
import store from "@/store";

export default {
  name: 'syssite',
  data() {
    return {
      tabName: "first",
      imgDomain: "http://bucket.damaijia.co/",
      freeDay : 0,
      list: null,
      total: null,
      profitsRateFlag: true,
      dialogFormVisible: false,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      typeOptions: ['0', '1'],
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
      listQuery: {
        name: undefined
      },
      memberCombos:[],
      iconUrl: "",
      htLogoUrl: "",
      /*qtLogoUrl: "",*/
      /*headerLogoUrl: "",
      buttomLogoUrl: "",*/
      contactQrcodeUrl: "",
      contactBtnIconUrl: "",
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      memberConfig:{
        comboCode : undefined,
        freeDay : 0,
        tenantId : this.currentId
      },
      memberConfigRules: {
        comboCode: [
          { required: true, message: '请选择套餐', trigger: 'blur' }
        ],
        freeDay: [
          { required: true, message: '请输入免费天数', trigger: 'blur' }
        ]
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
        profitsRate: [
          { required: true, message: '请输入充值倍数', trigger: 'blur' },
          // { type:'number', message: "值要求为1-3.3", min:1, max:3.3, trigger:'blur', transform:Number}
        ],
        type: [
          { required: true, message: '请选择站点类型', trigger: 'blur' }
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
        ],*/
       /* buttomLogo: [
          { required: true, message: '请上传网站底部logo', trigger: 'blur' }
        ],*/

      },
      labelPosition: 'right',
      form: {
        name: undefined,
        parentId: undefined,
        type: undefined,
        freeDomain: undefined,
        domain: undefined,
        icp: undefined,
        title: undefined,
        profitsRate: 0,
        keyword: undefined,
        describe: undefined,
        company: undefined,
        address: undefined,
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
        features: undefined,
        subSiteNum: 1,
        templateId: 1,
        lockFlag: undefined,
        id: undefined,
        phone: undefined
      },
      mainSiteOptionFlag: true,
      rootSiteFlag:false,
      currentId: '',
      currentSiteType: '', //站点类型（1主站，2分站）
      currentParentId: '',
      siteManager_btn_add: false,
      siteManager_btn_edit: false,
      siteManager_btn_del: false,
      siteManager_btn_init_balance: false,
      siteManager_btn_init_member_config: false,
    }
  },
  created() {
    this.getList()
    this.siteManager_btn_add = this.permissions['sys_site_add']
    this.siteManager_btn_edit = this.permissions['sys_site_edit']
    this.siteManager_btn_del = this.permissions['sys_site_del']
    this.siteManager_btn_init_balance = this.permissions['sys_site_init_balance']
    this.siteManager_btn_init_member_config = this.permissions['member_config_init']
  },
  computed: {
    ...mapGetters([
      'elements',
      'permissions',
      'userInfo'
    ])
  },
  methods: {
    checkFreeDay(param){
      getByComboCode(param,this.currentId).then(rep => {
        if(rep.data.data && rep.data.data.freeDay){
          this.freeDay = rep.data.data.freeDay
        }else{
          this.freeDay = 0
        }
      }).catch((e) => {
      });
    },
    getList() {
      fetchTree(this.listQuery).then(response => {
        this.treeData = response.data.data
        this.rootSiteFlag = this.treeData && this.treeData.length>0 && this.treeData[0].id==='1'
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData(data,node) {
      this.mainSiteOptionFlag = data.parentId === '0' || data.parentId === '1';
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      getObj(data.id).then(response => {
        this.form = response.data.data
        this.currentSiteType = this.form.type
        this.iconUrl = this.imgDomain + this.form.icon
        this.htLogoUrl = this.imgDomain + this.form.htLogo
        this.contactQrcodeUrl = this.imgDomain + this.form.contactQrcode
        /*this.qtLogoUrl = this.imgDomain + this.form.qtLogo*/
        //this.headerLogoUrl = this.imgDomain + this.form.headerLogo
        //this.buttomLogoUrl = this.imgDomain + this.form.buttomLogo
        //this.contactBtnIconUrl = this.imgDomain + this.form.contactBtnIcon

      })

      this.currentId = data.id
      this.currentParentId = data.parentId
      this.profitsRateFlag = data.id !== this.userInfo.tenantId

      if(this.userInfo.tenantId !== data.parentId){
        this.formEdit = true
        this.formStatus = ''
      }
    },
    handlerEdit() {
      if(!this.currentId){
        this.$notify.error('请选择站点')
        return
      }
      if (this.form.id && (this.userInfo.tenantId === this.currentParentId || this.userInfo.tenantId === this.currentId)) {
        this.formEdit = false
        this.formStatus = 'update'
      }else{
        this.formEdit = true
        this.formStatus = ''
        this.$notify.error('不能跨级编辑站点信息')
        return
      }
    },
    handlerAdd() {
      this.resetForm()
      this.mainSiteOptionFlag = this.rootSiteFlag;
      if(!this.currentId){
        this.$notify.error('请选择父级站点')
        return
      }
      if(this.currentSiteType === 2){
        this.$notify.error('暂不支持分站建站')
        return
      }
      if(this.userInfo.tenantId === this.currentId){
        this.formEdit = false
        this.formStatus = 'create'
        this.profitsRateFlag = true
      }else{
        this.$notify.error('只能在本级站点下建站')
      }
      this.form.profitsRate = 3.3;

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
    handleIconSuccess(res, file) {
      this.iconUrl = URL.createObjectURL(file.raw);
      this.form.icon = res.data.url;
      handleImg(this.form.icon, "icon");
    },
    handleQtLogoSuccess(res, file) {
      this.qtLogoUrl = URL.createObjectURL(file.raw);
      this.form.qtLogo = res.data.url;
      handleImg(this.form.qtLogo, "qtLogo");
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
    handleHtLogoSuccess(res, file) {
      this.htLogoUrl = URL.createObjectURL(file.raw);
      this.form.htLogo = res.data.url;
      handleImg(this.form.htLogo, "htLogo");
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
    handleHeaderLogoSuccess(res, file) {
      this.headerLogoUrl = URL.createObjectURL(file.raw);
      this.form.headerLogo = res.data.url;
      handleImg(this.form.headerLogo, "headerLogo");
    },
    handleButtomLogoSuccess(res, file) {
      this.buttomLogoUrl = URL.createObjectURL(file.raw);
      this.form.buttomLogo = res.data.url;
      handleImg(this.form.buttomLogo, "buttomLogo");
    },
    handleContactQrcodeSuccess(res, file) {
      this.contactQrcodeUrl = URL.createObjectURL(file.raw);
      this.form.contactQrcode = res.data.url;
      handleImg(this.form.contactQrcode, "contactQrcode");
    },
    handleContactBtnIconSuccess(res, file) {
      this.contactBtnIconUrl = URL.createObjectURL(file.raw);
      this.form.contactBtnIcon = res.data.url;
      handleImg(this.form.contactBtnIcon, "contactBtnIcon");
    },
    handleDelete() {
      if(!this.currentId){
        this.$notify.error('请选择要删除的站点')
        return
      }
      if(this.currentId===this.userInfo.tenantId){
        this.$notify.error('不能删除当前账号所属站点')
        return
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.currentId).then((res) => {
          if(res.data.code!==0){
            this.$notify.error(res.data.msg)
            return
          }
          this.getList()
          this.resetForm()
          this.onCancel()
          this.$notify.success('删除成功')
        })
      })
    },
    handleRecharge() {
      if(!this.currentId){
        this.$notify.error('请选择站点')
        return
      }
      if(this.currentId === this.userInfo.tenantId){
        this.$notify.error('只能给下级分站初始化金额')
        return
      }
      this.$prompt('请输入金额', '初始化站点余额', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
        inputErrorMessage: '金额需大于0.01元'
      }).then(({ value }) => {
        console.log("充值金额",value);
        let siteBalance = {
          tenantId : this.currentId,
          money: value
        }
        initBalance(siteBalance).then((res) => {
          if(res.data.code!==0){
            this.$notify.error(res.data.msg)
            return
          }
          this.$notify.success('站点余额初始化成功')
        }).catch((e) => {
          this.$notify.error('服务异常')
        });
      }).catch((e) => {
      });
    },
    handleMemboConfig() {
      if(!this.currentId){
        this.$notify.error('请选择站点')
        return
      }
      if(this.currentId === this.userInfo.tenantId){
        this.$notify.error('只能给下级分站设置')
        return
      }
      this.dialogFormVisible = true
      this.memberConfig.tenantId = this.currentId
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
        putObj(this.form).then((res) => {
          if(res.data.code!==0){
            this.$notify.error(res.data.msg)
            return
          }
          this.getList()
          this.onCancel()
          this.$notify.success('更新成功')
        })
      })
    },
    create() {
      this.$refs.form.validate((valid,object) => {
        if (!valid){
          let prop = Object.keys(object)[0]
          if(prop.indexOf("contact") !== -1){
            this.tabName = "third"
          }else if(prop==='icon' || prop.indexOf("Logo") !== -1){
            this.tabName = "second"
          }else{
            this.tabName = "first"
          }
          return
        }
        addObj(this.form).then(() => {
          this.getList()
          this.onCancel()
          this.$notify.success('创建成功')
        })
      })
    },
    saveMemberConfig(){
      this.$refs.memberConfig.validate((valid) => {
        if (!valid) return
        initMemberConfig(this.memberConfig).then((res) => {
          if(res.data.code!==0){
            this.$notify.error(res.data.msg)
            return
          }
          this.closeMemberConfig()
          this.$notify.success('操作成功')
        }).catch((e) => {
          this.$notify.error('服务异常')
        });

      })
    },
    closeMemberConfigDialog(done){
      this.closeMemberConfig()
      done()
    },
    closeMemberConfig(){
      this.dialogFormVisible = false
      this.memberConfig.freeDay = 0
      this.memberConfig.comboCode = undefined
    },
    onCancel() {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm() {
      Object.keys(this.form).forEach(key=>{this.form[key] = undefined})
      this.form.parentId = this.currentId
      this.form.templateId = 1
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/info.scss";
</style>
