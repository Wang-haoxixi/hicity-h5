// 是否为空
const isEmpty = (item) => {
	if (item == undefined || item == '' || item == null) {
		return true;
	} else {
		return false;
	}
}
export {
	isEmpty,
}
