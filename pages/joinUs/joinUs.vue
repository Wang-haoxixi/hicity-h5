<template>
	<view class="joinUs">
		<view class="namebox inpbox">
			<view class="name">
				姓名
			</view>
			<view class="inp">
				<input :adjust-position='false' v-model="data.name" placeholder-class="placeholderStyle" type="text" placeholder="请输入您的姓名" />
			</view>
		</view>
		<view class="contactWaybox inpbox">
			<view class="contactWay">
				联系方式
			</view>
			<view class="inp">
				<input v-model="data.mobile" placeholder-class="placeholderStyle" type="number" placeholder="请输入您的联系方式" />
			</view>
		</view>
		<view class="areabox inpbox">
			<view class="area">
				地区
			</view>
			<view class="inp" @tap="goChooseCity">
				<input disabled v-model="regionName" placeholder-class="placeholderStyle" type="text" placeholder="请输入所在地区" />
			</view>
		</view>
		<view class="corporationbox">
			<view class="corporation">
				合作意向
			</view>
			<view class="areaInp">
				<textarea v-model="data.cooperationIntention" placeholder-class="textareaPlaceholderStyle" placeholder="说明您的合作意向"></textarea>
			</view>
		</view>

		<view class="bottom-box">
			<button type="primary" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	let u = navigator.userAgent;
	let isAndroid = u.indexOf('Android') > -1; //安卓终端
	let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

	export default {
		data() {
			return {
				data: {
					name: '',
					mobile: '',
					cityId: '',
					cooperationIntention: '',
				},
				tk: null,
				regionName: '', //城市Id
			};
		},
		onLoad() {
			this.handleToken()
		},
		methods: {
			// 获取token
			handleToken() {
				if (isAndroid) {
					// 获取安卓传递过来的token
					window.android.invoke_native("getToken", '', "androidRst")
				} else if (isIOS) {
					// 获取ios传递过来的token
					window.webkit.messageHandlers.IOSGetToken.postMessage(null)
				}
			},
			// 操作城市
			handleCity() {
				if (isAndroid) {
					// 获取安卓传递过来的token
					window.android.invoke_native("chooseCity", null, "getCityId")
				} else if (isIOS) {
					// 获取ios传递过来的token
					window.webkit.messageHandlers.IOSGetCityId.postMessage(null)
				}
			},
			// 去选择城市
			goChooseCity() {
				this.handleCity()
			},
			// 提交
			submit() {
				uni.request({
					url: '/api/dms/partne/create',
					header: {
						// "Authorization": 'Bearer ' + '5d842f0e-5bc3-4be3-8f96-0662671efba4'
						"Authorization": 'Bearer ' + this.tk
					},
					method: "POST",
					data: this.data,
					complete: (res) => {
						// uni.showToast({
						// 	title: JSON.stringify(res),
						// 	duration: 20000,
						// 	icon: "none",
						// });
						if (res.statusCode == 200) {
							if (res.data.code != 0) {
								return uni.showToast({
									title: '加入失败',
									duration: 1500,
									icon: "none",
								});
							}
							// 加入成功
							if (isAndroid) {
								uni.showToast({
									title: '加入成功',
									duration: 1500,
									icon: "none",
								});
								window.android.invoke_native("finish", '', "androidRst")
							} else if (isIOS) {
								uni.showToast({
									title: '加入成功',
									duration: 1500,
									icon: "none",
								});
								window.webkit.messageHandlers.IOSClose.postMessage(null)
							}
						} else if (res.statusCode == 401) {
							console.log('tk过期..')
							// 去登录页
							window.android.invoke_native("goLogin", null, "androidRst")
						} else {
							uni.showToast({
								title: '请检查您的网路状态',
								duration: 1500,
								icon: "none",
							});
						}
					},
				})
			},

			androidRst(res) {
				this.tk = res.token
				// alert('原生传过来的数据:' + res.token)
			},
			getToken(res) {
				this.tk = res.token
				// uni.showToast({
				// 	title: "token:" + res.token,
				// 	icon: 'none'
				// });
				// alert('ios传过来的数据:' + res) //ios不生效
			},

			// 获取城市信息
			getCityId(res) {
				// alert('城市id:' + res.id + "," + "城市名称:" + res.regionName)
				this.data.cityId = res.id
				this.regionName = res.regionName
			},
			getIosCityId(res) {
				// uni.showToast({
				// 	title: '城市id:' + res.id + "," + "城市名称:" + res.regionName,
				// 	icon: 'none'
				// });
				this.data.cityId = res.id
				this.regionName = res.regionName
			}
		},
		created() {
			// 安卓
			window.androidRst = this.androidRst
			// ios
			window.getToken = this.getToken

			window.getCityId = this.getCityId
			window.getIosCityId = this.getIosCityId
		},

	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.joinUs {
		height: 100%;
		background-color: #F9F9F9;
		padding: 0 32rpx;

		.placeholderStyle {
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
			text-align: right;
		}

		.textareaPlaceholderStyle {
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
		}

		.inpbox {
			box-sizing: border-box;
			width: 100%;
			height: 112rpx;
			padding: 0 32rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			margin-bottom: 24rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		input {
			text-align: right;
		}

		.corporationbox {
			width: 100%;
			height: 308rpx;
			background-color: #FFFFFF;
			padding: 36rpx 32rpx;
			box-sizing: border-box;

			.corporation {
				margin-bottom: 20rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
			}

			.areaInp {
				height: 180rpx;
				width: 100%;

				textarea {
					width: 100%;
					height: 100%;
				}
			}
		}

		.bottom-box {
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
			padding: 16rpx 32rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			box-shadow: 0rpx 6rpx 12rpx rgba(0, 0, 0, 0.24);

			button {
				border-radius: 80rpx;
			}
		}
	}
</style>
