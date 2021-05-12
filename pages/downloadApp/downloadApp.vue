<template>
	<view>
		<!-- 微信浏览器页面 -->
		<view class="" v-if="isAndroid=='' && isIOS==''" style="padding: 0rpx 32rpx;display: flex;flex-direction: column; align-items: center;">
			<image src="../../static/logo.png" mode="" style="width: 192rpx;height: 192rpx;margin-top: 120rpx;"></image>
			<view class="" style="color: #272727;font-size: 40rpx;line-height: 56rpx;font-weight: bold;margin-top: 40rpx;margin-bottom: 120rpx;">
				超能城市
			</view>
			<view class="" style="width: 100%;height: 92rpx; background-color: #415BFD;font-weight: bold;color: #FFFFFF;font-size: 28rpx;line-height: 40rpx;text-align: center;line-height: 92rpx;border-radius: 50rpx;">
				立即下载
			</view>
			<view class="" style="font-size: 24rpx;line-height: 34rpx;margin-top: 40rpx;">
				<text style="color: #666666;">已经安装？</text>
				<text style="color: #415BFD;">戳这里</text>
			</view>
		</view>
		<!-- 外部浏览器页面 -->
		<view class="" v-else style="padding: 0rpx 32rpx;display: flex;flex-direction: column; align-items: center;">
			<image src="../../static/logo.png" mode="" style="width: 192rpx;height: 192rpx;margin-top: 360rpx;"></image>
			<view class="" style="color: #272727;font-size: 40rpx;line-height: 56rpx;font-weight: bold;margin-top: 40rpx;margin-bottom: 490rpx;">
				城市在握 成事在我
			</view>
			<view class="" v-if="isIOS" style="width: 100%;height: 92rpx; background-color: #415BFD;font-weight: bold;color: #FFFFFF;font-size: 28rpx;line-height: 40rpx;text-align: center;line-height: 92rpx;border-radius: 50rpx;">
				App Store下载
			</view>
			<view class="" v-else style="width: 100%;">
				<view class="" style="width: 100%;height: 92rpx; background-color: #415BFD;font-weight: bold;color: #FFFFFF;font-size: 28rpx;line-height: 40rpx;text-align: center;line-height: 92rpx;border-radius: 50rpx;">
					安全下载
				</view>
				<view class="" style="margin-top: 40rpx; width: 100%;height: 92rpx; background-color: #FFFFFF;border: 2rpx solid #415BFD; font-weight: bold;color: #415BFD;font-size: 28rpx;line-height: 40rpx;text-align: center;line-height: 92rpx;border-radius: 50rpx;">
					其他方式下载
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modal" @tap="modalhidden">
			<view class="cu-dialog"
				style="float: right;background-color: transparent;height:256rpx;width: 400rpx;margin-right: 22rpx;margin-top: 10rpx;">
				<view class="bg-img"
					style="background-image: url(../../static/tc-open.png);height:256rpx;width: 400rpx;margin-right: 22rpx;position: relative;">
					<view class="" v-if="user==0" style="position: absolute;left: 34rpx;bottom: 32rpx;color: #FFFFFF;font-size: 28rpx;line-height: 52rpx;display: flex;flex-direction: column; align-items: center;">
						<view style="display: flex;align-items: center;">
							<view class="">
								如已安装
							</view>
							<image src="../../static/littleLogo.png" mode="" style="width: 44rpx;height: 44rpx;"></image>
							<view class="">
								超能城市APP
							</view>
						</view>
						<view>请点击右上角</view>
						<view style="display: flex;align-items: center;">
							<view class="">
								选择
							</view>
							<image src="../../static/logo-safari.png" mode="" style="width: 40rpx;height: 40rpx;"></image>
							<view class="">
							 	Safari打开
							</view>
						</view>
					</view>
					<view class="" v-if="user==1" style="position: absolute;left: 34rpx;bottom: 32rpx;color: #FFFFFF;font-size: 28rpx;line-height: 52rpx;display: flex;flex-direction: column; align-items: center;">
						<view style="display: flex;align-items: center;">
							<view class="">
								如已安装
							</view>
							<image src="../../static/littleLogo.png" mode="" style="width: 44rpx;height: 44rpx;"></image>
							<view class="">
								超能城市APP
							</view>
						</view>
						<view>请点击右上角</view>
						<view>
							请选择浏览器打开
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modal:'',
				user:'',
				isAndroid:'',
				isIOS:'',
				id:''
			};
		},
		onLoad() {
			this.id = options.id
			this.goApp()
		},
		methods:{
			modalhidden() {
				this.modal = '';
			},
			goApp() {
				let that = this;
				// let token = uni.getStorageSync('token')
				// console.log(token)
				var ua = navigator.userAgent.toLowerCase();
				var isWeixin = ua.indexOf('micromessenger') != -1;
				if (isWeixin) {
					that.modal = 'show';
					// console.log(that.modal)
					// alert(that.modal)
					//微信内置浏览器判断机型
					if (/android/i.test(navigator.userAgent)){
			　　      // 安卓手机
						this.user="1";
					}
					if (/ipad|iphone|mac/i.test(navigator.userAgent)){
						//  苹果手机
						this.user="0";
					}
				} else {
					let u = navigator.userAgent;
					// // const lib = new CallApp(option);
					that.isAndroid = u.indexOf('Android') > -1; //安卓终端
					that.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
					if (that.isAndroid) {
						// console.log(666)
						// 安卓的scheme协议跳转
						// window.location.href = 'personalstyle://?id=' + that.data.userId;
						// window.location.href = `govmadeyoucan://ucan?token=${token}`;
						window.location.href = 'hicity://wecan/informationDetails?id=' + that.id;
						setTimeout(function() {
							let hidden = window.document.hidden || window.document.mozHidden || window.document
								.msHidden || window.document
								.webkitHidden;
							if (typeof hidden == 'undefined' || hidden == false) {
								// window.location.href = 'http://wn.woneng.net/uca';
							} else {
								window.close()
							}
						}, 2000);
					}
					if (that.isIOS) {
						// IOS下的scheme协议跳转
						// window.location.href = 'personalstyle://?id=' + that.data.userId;
						// window.location.href = 'govmadeyoucan://ucan?token=${token}';
						// window.location.href = 'govmadeyoucan://x-callback-url?x-error={{https://apps.apple.com/cn/app/id1556162940}}';
						// setTimeout(function() {
						// 	let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document
						// 		.webkitHidden;
						// 	if (typeof hidden == 'undefined' || hidden == false) {
						// 		// window.location.href = 'https://apps.apple.com/cn/app/id1508431149';
						// 		 // var timeOutDateTime = new Date();
						// 			// if (timeOutDateTime - loadDateTime < 5000) {
						// 			// 	window.location.href = "..."; //ios下载地址  
						// 			// } else {
						// 			// 	window.close();
						// 			// }
						// 		window.location.href = 'https://apps.apple.com/cn/app/id1556162940';
						// 	}else{
						// 		return
						// 	}
						// }, 2000);
						var loadDateTime = new Date();
						window.location = "hicity://wecan/informationDetails?id=" + that.id; //schema链接或者universal link
						window.setTimeout(function() { //如果没有安装app,便会执行setTimeout跳转下载页
							var timeOutDateTime = new Date();
							if (timeOutDateTime - loadDateTime < 5000) {
								window.location = "https://apps.apple.com/cn/app/id1556162940"; //ios下载地址  
							} else {
								window.close();
							}
						}, 2000)
					}
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
