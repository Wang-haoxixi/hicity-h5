const gettime = time => {
	var result = ''
	var minute = 1000 * 60
	var hour = minute * 60
	var day = hour * 24
	var month = day * 30
	var now = new Date().getTime()
	//2020-11-24 00:00:02 如果time是这种格式，需要把“-”转换成 “/” str.replace(/-/g,"/"),兼容IOS安卓
	var lastTime = new Date(time.replace(/-/g, "/")).getTime()
	var diffValue = now - lastTime
	if (diffValue < 0) return
	var monthC = diffValue / month
	var weekC = diffValue / (7 * day)
	var dayC = diffValue / day
	var hourC = diffValue / hour
	var minC = diffValue / minute
	if (dayC >= 7) {
		result = "" + time.substring(0, 10)
	} else if (dayC >= 1 && dayC < 7) {
		result = "" + parseInt(dayC) + "天前"
		// result = "" + time
	} else if (hourC >= 1) {
		result = "" + parseInt(hourC) + "小时前"
	} else if (minC >= 5) {
		result = "" + parseInt(minC) + "分钟前"
	} else {
		result = "刚刚"
	}
	// console.log(result)
	return result
}

export {
	gettime
}
