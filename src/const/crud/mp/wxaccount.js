/*
 *    Copyright (c) 2018-2025, lzyq All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of thelayq.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lzyq
 */

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  searchMenuSpan: 6,
  column: [
    {
      label: '主键',
      prop: 'id',
      hide: true,
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '名称',
      prop: 'name',
      placeholder: '自定义名称',
      rules: [{
        required: true,
        message: '请输入名称',
        trigger: 'blur'
      }]
    },
    {
      label: '微信号',
      prop: 'account',
      overHidden: true,
      placeholder: '公众号设置->最下边原始ID',
      rules: [{
        required: true,
        message: '请输入微信号',
        trigger: 'blur'
      }]
    },
    {
      label: 'appid',
      prop: 'appid',
      overHidden: true,
      placeholder: '基本配置->公众号开发信息->开发者ID(AppID)',
      rules: [{
        required: true,
        message: '请输入appid',
        trigger: 'blur'
      }]
    },
    {
      label: '密钥',
      prop: 'appsecret',
      placeholder: '基本配置->公众号开发信息->开发者密码(AppSecret)',
      overHidden: true,
      rules: [{
        required: true,
        message: '请输入密钥',
        trigger: 'blur'
      }]
    },
    {
      label: '回调域名',
      prop: 'url',
      hide: true,
      value: window.location.protocol + '//' + window.location.host,
      placeholder: 'scheme://domain',
      rules: [{
        required: true,
        message: '输入不合法',
        trigger: 'blur'
      }]
    },
    {
      label: 'token',
      prop: 'token',
      placeholder: '自定义token，要与“基本配置->服务器配置->令牌(Token)”一致',
      overHidden: true,
      rules: [{
        required: true,
        message: '请输入token',
        trigger: 'blur'
      }]
    },
    {
      label: '加密密钥',
      prop: 'aeskey',
      placeholder: '基本配置->服务器配置->消息加解密密钥(EncodingAESKey)',
      overHidden: true,
      rules: [{
        required: true,
        message: '请输入加密密钥',
        trigger: 'blur'
      }]
    },{
      label: '扫码登录账号',
      prop: 'loginFlag',
      labelWidth:"120",
      type: 'radio',
      dicData: [{
        value: 0,
        label: '否'
      },{
        value: 1,
        label: '是'
      }],
      rules: [{
        required: true,
        message: '请选择是否为站点扫码登录公众号',
        trigger: 'blur'
      }]
    },
    {
      label: '公众号二维码',
      prop: 'qrUrl',
      type: 'upload',
      imgWidth: 60,
      imgFullscreen: true,
      editDisplay: false,
      addDisplay: false,
      listType: 'picture-img'
    }
  ]
}
