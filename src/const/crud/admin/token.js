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

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  viewBtn: true,
  addBtn: false,
  editBtn: false,
  searchMenuSpan: 6,
  column: [{
    label: '用户ID',
    prop: 'id',
    align: 'center',
    slot: true,
  }, {
    label: '用户名',
    prop: 'username',
    align: 'center',
    search: true,
    slot: true,
  }, {
    label: '令牌',
    prop: 'access_token',
    align: 'center',
    overHidden: true
  }, {
    label: '类型',
    prop: 'token_type',
    align: 'center'
  }, {
    label: '过期时间',
    prop: 'expires_in',
    align: 'center'
  }]
}
