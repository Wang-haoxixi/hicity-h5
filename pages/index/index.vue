<template>
	<view class="">
		<image src="../../static/loading-white.gif" class="gif-white response" style="height:480rpx"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sendimg: '',
				token: '',
				articleId: '',
				type: ''
			};
		},
		methods: {
			// 获取参数信息
			getQueryVariable(variable) {
				//获取地址栏参数信息
				var query = window.location.search.substring(1);
				console.log('query参数', query) //id=1
				// 已‘&’符号将query分割为数组
				var vars = query.split('&');
				console.log('vars', vars) // ["id=1"]
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split('=');
					if (pair[0] == variable) {
						return pair[1]; //返回数组第二个参数
					}
				}
				console.log('pair', pair) //["id", "1"]
				return false;
			}
		},
		onLoad() {
			let that = this;
			// that.type = that.getQueryVariable('type');
			if (that.getQueryVariable('type') == 'advisoryDetails') { //热门咨询详情
				uni.redirectTo({
					url: '../advisoryDetails/advisoryDetails?id=' + that.getQueryVariable('id')
				});
			} else if (that.getQueryVariable('type') == 'officialDetails') { //官方发布
				uni.redirectTo({
					url: '../officialDetails/officialDetails?id=' + that.getQueryVariable('id')
				});
			}
		}
	};
</script>

<style>
	.cu-avatar {
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	page {
		padding-top: 100rpx;
		background-color: #fff;
		padding-bottom: 100rpx;
	}
</style>
