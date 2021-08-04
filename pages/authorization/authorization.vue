<template>
	<view>
		<view class="page">
			<view class="title">
				<image :src="data.logo" mode="aspectFill" style="width: 40rpx;height: 40rpx;border-radius: 8rpx;">
				</image>
				<view class="title-name">
					{{data.name}} | 申请
				</view>
			</view>
			<view class="info">
				获取您的头像、昵称以及手机号
			</view>
			<view style="display: flex;align-items: center;padding: 24rpx 0;border-bottom: 1px dotted #EDEDED;">
				<image :src="userData.avatar" mode="aspectFill"
					style="height: 112rpx;width: 112rpx;border-radius: 50%;"></image>
				<view style="margin-left: 24rpx;">
					<view class="" style="color: #272727;font-size: 32rpx;line-height: 44rpx;">
						{{userData.realName}}
					</view>
					<view class="" style="color: #999999;font-size: 24rpx;line-height: 34rpx;margin-top: 16rpx;">
						{{userData.phone}}
					</view>
				</view>
			</view>
		</view>
		<!-- <input type="text" v-model="url" /> -->
		<view class="bottom" v-if="userData.userKey">
			<button type="default" style="width: 686rpx;background-color: #415BFD;color: #FFFFFF;border-radius: 64rpx;"
				@tap="auth">授权</button>
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
				data: '',
				userData: '',
			};
		},
		methods: {
			auth() {
				window.open('https://platform.cltg365.com/govdemo/gmlogin?govmadeTag=' + this.userData.userKey, '_blank');
			},
			close() {
				if (isAndroid) {
					// 获取安卓传递过来的token
					window.android.invoke_native("finish", null, "androidRst")
					return
				} else if (isIOS) {
					// 获取ios传递过来的token   
					window.webkit.messageHandlers.IOSClose.postMessage(null)
					return
				}
			},
			goLogin() {
				if (isAndroid) {
					// 获取安卓传递过来的token
					window.android.invoke_native("goLogin", null, "androidRst")
					return
				} else if (isIOS) {
					// 获取ios传递过来的token   
					window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
					return
				}
			},
			handleToken(type) {
				if (isAndroid) {
					// 获取安卓传递过来的token
					window.android.invoke_native("getToken", `{resultType:${type}}`, "androidRst")
					return
				} else if (isIOS) {
					// 获取ios传递过来的token
					window.webkit.messageHandlers.IOSGetToken.postMessage(type)
					return
				}
			},
			androidRst(res) {
				if (res.resultType == "getUser") {
					this.getUser(res.token)
				}
			},
			getIosToken(res) {
				if (res.type == "getUser") {
					this.getUser(res.token)
				}
			},
			getUser(token) {
				if (this.$isEmpty(token)) {
					this.goLogin();
					this.close();
				} else {
					uni.request({
						header: {
							"Authorization": 'Bearer ' + token
						},
						url: '/api/admin/third/user/key',
						method: "GET",
						success: (res) => {
							if (res.data.data.businessCode == 1000) {
								this.userData = res.data.data.data;
							}
						}
					})
				}
			}
		},
		onLoad(option) {
			this.data = option
			window.androidRst = this.androidRst
			window.getIosToken = this.getIosToken
		},
		onShow() {
			this.handleToken('getUser')
		}
	}
</script>

<style lang="scss">
	.page {
		padding: 32rpx;

		.title {
			display: flex;
			align-items: center;
			color: #999999;
			font-size: 28rpx;
			line-height: 40rpx;

			.title-name {
				padding-left: 16rpx;
			}
		}

		.info {
			margin-top: 24rpx;
			color: #272727;
			font-size: 36rpx;
			line-height: 50rpx;
			font-weight: bold;
			padding-bottom: 32rpx;
			border-bottom: 1px dotted #EDEDED;
		}
	}

	.bottom {
		align-items: center;
		height: 148rpx;
		display: flex;
		box-shadow: 0px -4rpx 6rpx rgba(174, 191, 211, 0.13);
	}
</style>
