export const drag = {
	// 当被绑定的元素插入到 DOM 中时……
	inserted(el, binding) {
        let firstTime = ''
        let lastTime = ''
		el.onmousedown = function(event) {
            // 为了区分点击还是拖拽，使⽤时间差来判断，200毫秒内为点击，200毫秒外为拖拽，初始化为点击
            var boxer = document.querySelector(".float-window")
            boxer.setAttribute('drag-flag', false)
            firstTime = new Date().getTime()
            const translates = getTranslates(boxer)
			let eleEvent = event || window.event //event的兼容,同时得到clientX,的值
			let x = eleEvent.clientX - el.offsetLeft
			let y = eleEvent.clientY - el.offsetTop
			let left = event.clientX - x
			let top = event.clientY - y
            let leftRes = left - window.innerWidth + 76 + translates[0]
            let topRes = top - 200 + translates[1]

			document.onmousemove = function(eve) {
                // 判断下当前时间与初始时间差，⼤于200毫秒则判断状态为拖拽
                lastTime = new Date().getTime()
                if (lastTime - firstTime > 100) {
                    boxer.setAttribute('drag-flag', true)
                }
				left = eve.clientX - x
				top = eve.clientY - y
                // 76为浮窗宽度, 200为默认定位置
                leftRes = left - window.innerWidth + 76 + translates[0]
                topRes = top - 200 + translates[1]
				el.style.transform = `translate(${leftRes}px, ${topRes}px)`
                
			};
			document.onmouseup = function () {
                // 加上拖拽元素时的初始值
                const contrastLeft = left + translates[0]
                if (contrastLeft >= window.innerWidth / 2) {
                    // 在屏幕的右边
                    leftRes = 0
                } else {
                    // 在屏幕的左边
                    leftRes = -window.innerWidth + 76
                }
				el.style.transform = `translate(${leftRes}px, ${topRes}px)`
				document.onmousemove = null
				document.onmouseup = null
                eleEvent = null
                x = null
                y = null
                left = null
                top = null
                leftRes = null
                topRes = null
                boxer = null
			};
		}
    }
}

function getTranslates (element) {
    let result = []
    //获取矩阵信息
    var translates = document.defaultView.getComputedStyle(element, null).transform
     
    //清除最后一个),便于后续取值
    let str = translates.replace(")","")
     
    //分割成数组
    let split = str.split(',')

    result = [Number(split[split.length-2]), Number(split[split.length-1])]
    return result
}