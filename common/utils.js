// 是否为空
const isEmpty = (item) => {
	if (item == undefined || item == '' || item == null) {
		return true;
	} else {
		return false;
	}
}
const previewImage = (imgs, index) => {
	console.log(imgs)
	imgs.forEach((item, index) => {
		if (item.substring(0, 2) == '//') {
			imgs[index] = 'https:' + item;
		}
	})
	uni.previewImage({
		urls: imgs,
		current: index,
		longPressActions: {
			itemList: ['发送给朋友', '保存图片', '收藏'],
			success: function(data) {
				console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
			},
			fail: function(err) {
				console.log(err.errMsg);
			}
		}
	});
}

export {
	isEmpty,
	previewImage
}
