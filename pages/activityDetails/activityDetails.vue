<template>
	<view>
		<view class="" style="padding: 22rpx 32rpx;">
			<image :src="details.poster" mode=""
				style="width: 100%;height: 412rpx;border-radius: 16rpx;margin-bottom: 32rpx;"></image>
			<view class=""
				style="color: #272727;font-size: 36rpx;line-height: 52rpx;font-weight: bold;margin-bottom: 16rpx;">
				{{details.name}}
			</view>
			<view class="" style="color: #999999;font-size: 24rpx;line-height: 34rpx;margin-bottom: 32rpx;">
				阅读
				<text style="padding-left: 8rpx;">{{details.browseNum}}</text>
			</view>
			<view class="" style="color: #5F5F5F;font-size: 26rpx;line-height: 40rpx;">
				<view class="" style="margin-bottom: 16rpx;display: flex;align-items: center;">
					<image src="../../static/icon_time.png" mode=""
						style="width: 32rpx;height: 32rpx;margin-right: 12rpx;"></image>
					<view class="">
						{{details.startTime}}~{{details.endTime}}
					</view>
				</view>
				<view class="" style="margin-bottom: 32rpx;display: flex;align-items: center;">
					<image src="../../static/icon_location_black.png" mode=""
						style="width: 32rpx;height: 32rpx;margin-right: 12rpx;"></image>
					<view class="">
						{{details.city}}{{details.field}}
					</view>
				</view>
			</view>
			<view class=""
				style="margin-bottom: 64rpx;display: flex;align-items: center;justify-content: flex-start;flex-wrap: wrap;">
				<view class="" v-for="(item,index) of details.label" :key="index"
					style="margin-right: 16rpx;margin-bottom: 16rpx; color: #5F5F5F;font-size: 22rpx;line-height: 32rpx;padding: 8rpx 16rpx;background-color: #F5F7F8;border-radius: 6rpx;">
					{{item}}
				</view>
			</view>
			<view class=""
				style="color: #272727;font-size: 32rpx;line-height: 44rpx;font-weight: bold;margin-bottom: 32rpx;">
				活动内容
			</view>
			<jyf-parser class="parser" :html="details.details" :tag-style="tagStyle" lazy-load
			></jyf-parser>
		</view>
		<!-- <wx-open-launch-weapp id="launch-btn" @launch="handleLaunch" @error="handleError" username="gh_995ee341f272"
			path="pages/index/index.html">
			<script type="text/wxtag-template">
				<style>
				  .btn { padding: 12px;}
				</style>
				<button class="btn">打开小程序</button>
			</script>
		</wx-open-launch-weapp> -->
		<!-- <view v-if="source==1" class="bottom" style="padding: 24rpx 32rpx;" id="bottomHeight">
			<view class="bottom-view" @tap="getConfig"
				style="color: #FFFFFF;background-color: #415BFD;border-radius: 50rpx;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 28rpx;line-height: 40rpx;font-weight: bold;">
				打开小程序
			</view>
		</view> -->
		<image src="../../static/openApp.png" mode="" class="openImg" @tap="goDownloadApp"></image>
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-Parser/jyf-parser";
	var wx = require('jweixin-module')
	export default {
		components: {
			jyfParser,
		},
		data() {
			return {
				id: '',
				details: {},
				tagStyle: {
					body: 'line-height: 1.8;',
					img: 'background-size: contain|cover;width:100%;height:auto;display: block;',
					p: 'text-indent: 2em',//首行缩进两个字符
				},
				bottomHeight: '',
				source:'',
				url:'',
				inviteId:''
			};
		},
		onLoad(options) {
			this.id = options.id
			this.inviteId =options.inviteId
			this.getDetails(this.id)
			this.getConfig()
		},
		methods: {
			// wx api 注册
			getConfig() {
				let that =this
				that.url =escape(window.location.href.split('#')[0])
				// let url =escape('https://h5.wecan.vip/?type=activityDetails&id=85')
				uni.request({
					url: '/api/admin/open/get_ticket?url=' + that.url,
					success: (res) => {
						// if (res.data.data.businessCode !== 1000) {
						// 	return uni.showToast({
						// 		title: res.data.data.msg,
						// 		duration: 1500,
						// 		icon: "none",
						// 	});
						// } else {
							wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								appId: 'wx872fa385e99e857f', // 必填，公众号的唯一标识，填自己的！
								timestamp: res.data.data.data.timestamp, // 必填，生成签名的时间戳，刚才接口拿到的数据
								nonceStr:res.data.data.data.noncestr, // 必填，生成签名的随机串
								signature: res.data.data.data.signature, // 必填，签名，见附录1
								jsApiList: ['wx-open-launch-weapp', 'chooseImage','previewImage','updateAppMessageShareData','updateTimelineShareData'],
								openTagList: ['wx-open-launch-weapp'] // 跳转小程序时必填
							});
						// }
					}
				})

				wx.ready(res => {
					// console.log(res);
					// this.$nextTick(() => {
					// 	let btn = document.getElementById('launch-btn');
					// 	btn.addEventListener('launch', e => {
					// 		console.log('success');
					// 	});
					// 	btn.addEventListener('error', e => {
					// 		alert('小程序打开失败');
					// 		console.log('fail', e.detail);
					// 	});
					// });
					wx.updateAppMessageShareData({
					    title: that.details.name, // 分享标题
					    desc: that.details.spot, // 分享描述
					    link: unescape(that.url), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					    imgUrl: that.details.poster, // 分享图标
					    success: function () {
					      // 设置成功
					    }
					  })
					  wx.updateTimelineShareData({ 
					      title: that.details.name, // 分享标题
					      link: unescape(that.url), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					      imgUrl: that.details.poster, // 分享图标
					      success: function () {
					        // 设置成功
					      }
					    })
				});

				// wx.error(res => {
				// 	// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
				// 	console.log(res);
				// });
			},
			// 监听跳转
			handleLaunch() {
				console.log('跳转');
			},
			// 监听错误
			handleError() {
				console.log('失败');
			},
			getDetails(id) {
				uni.request({
					url: '/api/dms/open/activity_publish/details_activity/',
					data: {
						id: id
					},
					success: (res) => {
						if (res.data.data.businessCode !== 1000) {
							uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
								success: () => {
									setTimeout(()=>{
										uni.redirectTo({
											url: '../404/404'
										});
									},1500)
								}
							});
						} else {
							this.details = res.data.data.data
							this.details.startTime = this.details.startTime.replace(/-/g, ".").substring(5, 16)
							this.details.endTime = this.details.endTime.replace(/-/g, ".").substring(5, 16)
						}
					}
				})
			},
			goDownloadApp() {
				uni.navigateTo({
					url: '../downloadApp/downloadApp?id=' + this.id + '&inviteId='+ this.inviteId+ '&type=activityDetails'
				})
				// location.href = 'weixin://dl/business/?t=uLzUKiAEgDh'
			},
		}
	}
</script>

<style lang="scss">
	// p{
	// 	text-indent: 0 !important;
	// }
	.bottom {
		width: 750rpx;
		position: fixed;
		bottom: 0rpx;
		background-color: #FFFFFF;
		box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.24);
		.bottom-view{
			padding: 24rpx;
		}
	}
	.safe-bottom {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
	.publishCommentBox {
		background: #FFFFFF;
		height: 116rpx;
		width: 100%;
		box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.24);
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
	}
	.openImg{
		width: 148rpx;
		height: 148rpx;
		position: fixed;
		right: 14rpx;
		bottom: 128rpx;
	}
</style>
