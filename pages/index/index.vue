<template>
	<view class="index">
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
			// http://192.168.0.159:8888/?type=advisoryDetails   http://192.168.0.159:8888/?id=100&status=0 
			// http://192.168.0.159:8888/?type=advisoryDetails&id=53
			// variable参数传"type"
			// 获取参数信息           
			getQueryVariable(variable) {
				//获取地址栏参数信息 - 从第一个 问号? 开始截取 URL中参数
				var query = window.location.search.substring(1);
				console.log('query参数', query) //type=advisoryDetails&id=53
				// 以‘&’符号将query分割为数组
				var arr = query.split('&');
				console.log('arr', arr) //["type=advisoryDetails", "id=53"]  
				for (var i = 0; i < arr.length; i++) {
					var pair = arr[i].split('=');
					console.log('pair', pair) //["type", "advisoryDetails"]  ["id", "53"]
					if (pair[0] == variable) { //若pair[0] == 'type',则返回页面参数
						console.log('pair[1]', pair[1]) //advisoryDetails
						return pair[1]; //返回数组第二个参数
					}
				}
				return;
			}
		},
		onLoad() {
			let that = this;
			// that.type = that.getQueryVariable('type');
			if (that.getQueryVariable('type') == 'advisoryDetails') { //热门咨询详情
				uni.redirectTo({
					url: '../advisoryDetails/advisoryDetails?id=' + that.getQueryVariable('id')
					// url: '../advisoryDetails/advisoryDetails?id=80'
				});
			} else if (that.getQueryVariable('type') == 'officialDetails') { //官方咨询
				uni.redirectTo({
					url: '../officialDetails/officialDetails?id=' + that.getQueryVariable('id')
				});
			} else if (that.getQueryVariable('type') == 'circleCard') { //官方咨询
				uni.redirectTo({
					url: '../circleCard/circleCard?id=' + that.getQueryVariable('id')
				});
			} else if (that.getQueryVariable('type') == 'partnerRecruitment') { //合伙人招募
				uni.redirectTo({
					url: '../partnerRecruitment/partnerRecruitment'
				});
			} else if (that.getQueryVariable('type') == 'joinUs') { //加入我们
				uni.redirectTo({
					url: '../joinUs/joinUs'
				});
			}
		}
	};
</script>

<style>
	.index {
		text-align: center;
	}

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
