const data = {
    phone: /^1[3-9]\d{9}$/,
    amount: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
};

/**
 * 校验手机号
 * @param {value:number} 手机号
 */
export const isPhone = (value) => {
    return !data.phone.test(value);
};

/**
 * 校验金额
 * @param {value:number} 金额
 */
export const isAmount = (value) => {
    return !data.amount.test(value);
};
