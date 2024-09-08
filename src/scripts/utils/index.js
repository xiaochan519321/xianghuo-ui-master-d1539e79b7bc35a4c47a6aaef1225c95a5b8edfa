
/**
 * 防抖
 * @callback fn 回调函数
 * @param { number } delay 定时器时长
 */
export const debounce = (fn, delay = 1500) => {
    let timeout;
    return function (event) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.call(this, event);
        }, delay);
    };
};

/**
 * 节流
 * @callback fn 回调函数
 * @param { number } delay 定时器时长
 */
export const throttle = (fn, delay = 1500) => {
    let lastTime = null;
    // 返回新的函数
    return function () {
        const nowTime = new Date();
        if (nowTime - lastTime > delay || !lastTime) {
            fn.apply(this, arguments);
            lastTime = nowTime;
        }
    };
};

/**
 * 节流 + 防抖
 * @callback fn 回调函数
 * @param { number } delay 定时器时长
 */
export const debounceThrottle = (fn, delay = 5000) => {
    let startTime = 0;
    let timer = null;
    return function (event) {
        const endTime = new Date().getTime();
        clearTimeout(timer);
        if (endTime - startTime > delay) {
            fn.apply(this, arguments);
            startTime = new Date().getTime();
        } else {
            timer = setTimeout(() => {
                fn.call(this, event);
            }, delay);
        }
    };
};

/**
 * 递归数组求和
 * @param {arr:Array} 目标数组
 * @param {target:number} 从0开始递增
 * @param {total:number} 递归上来的总和
 * @param {key:String} 数组中的key值
 */
export const getExtra = (arr, target, total, key) => {
    // eslint-disable-next-line max-len
    total += key ? (arr[target][key] && arr[target][key] !== '-' ? arr[target][key] : 0) : (arr[target] && arr[target] !== '-' ? arr[target] : 0);
    target++;
    if (target < arr.length) {
        return getExtra(arr, target, total, key);
    } else {
        return total;
    }
};

/**
 * 递归实现深拷贝
 * @param {obg:Any} 目标对象
 */
export const deepClone = (obj) => {
    const objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === 'object') {
        for (const key in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = deepClone(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
};

/**
 * 图片转base64
 * @param {path:String} 需要转换的图片路径
 */
export const getBase64Image = (path) => {
    const base64Img = (img) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
        const dataURL = canvas.toDataURL(`image/${ext}`);
        return dataURL;
    };
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = path;
        image.onload = () => {
            resolve(base64Img(image));
        };
    });
};

/**
 * 数组去重
 * @param {arr:Array} 需要去重的数组
 * @param {key:String} 数组中的key
 */
export const ArrayDeWeight = (arr, key = '') => {
    for (let i = 0, len = arr.length; i < len; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (key) {
                if (arr[i][key] === arr[j][key]) {
                    arr.splice(j, 1);
                    j--;
                    len--;
                }
            } else if (arr[i] === arr[j]) {
                arr.splice(j, 1);
                j--;
                len--;
            }
        }
    }
    return arr;
};
