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
 * Neither the name of the lzyq developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lzyq
 */
import {getDetails} from '@/api/admin/user'


var validateUsername = (rule, value, callback) => {
  getDetails(value).then(response => {
    if (window.boxType === 'edit') callback()
    const result = response.data.data
    if (result !== null) {
      callback(new Error('用户名已经存在'))
    } else {
      callback()
    }
  })
}
export const tableOption = {
  border: false,
  index: true,
  indexLabel: '序号',
  stripe: false,
  menuAlign: 'center',
  searchMenuSpan:6,
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  dialogWidth: '512',
  column: [{
    label: 'id',
    prop: 'userId',
    span: 24,
    hide: true,
    editDisabled: true,
    display: false
  }, {
    label: '用户名',
    prop: 'username',
    editDisabled: true,
    slot: true,
    // search: true,
    searchLabelWidth: 67,
    span: 24,
    rules: [{
      required: true,
      message: '请输入用户名'
    },
      {
        min: 3,
        max: 20,
        message: '长度在 3 到 20 个字符',
        trigger: 'blur'
      },
      {validator: validateUsername, trigger: 'blur'}
    ]
  }, {
    label: '密码',
    prop: 'password',
    type: 'password',
    value: '',
    hide: true,
    span: 24,
    rules: [{
      pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/,
      message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位',
      trigger: 'blur'
    }]
  }, {
    label: '手机号',
    prop: 'phone',
    value: '',
    span: 24,
    rules: [{
      required: true,
      min: 11,
      max: 11,
      message: '长度在 11 个字符',
      trigger: 'blur'
    }]
  }, 
//   {
//     label: '角色',
//     prop: 'role',
//     formslot: true,
//     slot: true,
//     overHidden: true,
//     span: 24,
//     rules: [{
//       required: true,
//       message: '请选择角色',
//       trigger: 'blur'
//     }]
//   }, 
  {
    label: '所属店铺',
    prop: 'shopIds',
    formslot: true,
    typeslot: true,
    slot: true,
    overHidden: true,
    span: 24,
    rules: [{
      required: true,
      message: '请选择店铺',
      trigger: 'blur'
    }]
  }, {
    label: '状态',
    prop: 'lockFlag',
    type: 'radio',
    slot: true,
    border:true,
    span: 24,
    rules: [{
      required: true,
      message: '请选择状态',
      trigger: 'blur'
    }],
    dicData: [{
      label: '有效',
      value: '0'
    }, {
      label: '锁定',
      value: '9'
    }]
  }, {
    width: 180,
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    editDisabled: true,
    addDisplay: false,
    span: 24
  }]
}
