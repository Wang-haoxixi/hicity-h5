<template>
	<view>
		<view class="" style="padding:0rpx 32rpx;">
			<view class="" style="padding: 32rpx 0rpx;">
				<view class="" style="color: #000000;font-weight: bold;font-size: 36rpx;line-height: 50rpx;margin-bottom: 20rpx;">
					{{details.name}}
				</view>
				<view class="" style="color: #FF4603;font-weight: bolder;font-size: 36rpx;line-height: 50rpx;margin-bottom: 16rpx;">
					{{details.salaryLable}}
				</view>
				<view class="" style="display: flex;align-items: center;justify-content: flex-start">
					<view class="">
						{{details.city}}
					</view>
					<view class="" style="width: 2rpx;height: 22rpx;background-color: #EDEDED;margin: 0rpx 20rpx;">
						
					</view>
					<view class="">
						{{details.educationLable}}
					</view>
					<view class="" style="width: 2rpx;height: 22rpx;background-color: #EDEDED;margin: 0rpx 20rpx;">
						
					</view>
					<view class="">
						{{details.experienceLable}}
					</view>
					<view class="" style="width: 2rpx;height: 22rpx;background-color: #EDEDED;margin: 0rpx 20rpx;">
						
					</view>
				</view>
			</view>
			<view class="" style="width:100%;height: 2rpx;background: #EDEDED;opacity: 0.5;">		
			</view>
		</view>
		<view class="" style="position: relative;">
			<image src="../../static/positionBgimg.png" mode="aspectFit" style="width: 100%;height: 200rpx;"></image>
			<view class="" style="position: absolute;top: 62rpx;left: 62rpx;right: 50rpx;" @tap="goDownloadApp">
				<view class="" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="" style="display: flex;align-items: center;">
						<image :src="details.createByAvatar" mode="aspectFill" style="width: 76rpx;height: 76rpx;border-radius: 50%;margin-right: 16rpx;"></image>
						<view class="" style="flex: 1;">
							<view class="" style="color: #333333;font-size: 24rpx;line-height: 34rpx;margin-bottom: 8rpx;">
								{{details.createByName}}
							</view>
							<view class="" style="color: #999999;font-size: 22rpx;line-height: 32rpx;">
								{{details.identity}}
							</view>
						</view>
					</view>
					<image src="../../static/icon-right.png" mode="" style="width: 44rpx;height: 44rpx;"></image>
				</view>
			</view>
		</view>
		<view class="" style="margin-top: 18rpx;padding:0rpx 32rpx;">
			<view class="" style="margin-bottom: 32rpx;color: #333333;font-size: 32rpx;line-height: 44rpx;font-weight: bold;">
				职位详情
			</view>
			<view class="" style="margin-bottom: 22rpx;display: flex;align-items: center;justify-content: flex-start;flex-wrap: wrap;">
				<view class="" v-for="(item,index) of details.lableInfoList" :key="index" style="margin-right: 10rpx;margin-bottom: 10rpx; color: #666666;font-size: 22rpx;line-height: 32rpx;padding: 8rpx 16rpx;background-color: #F9F9F9;border-radius: 10rpx;">
					{{item.positionLable}}
				</view>
			</view>
			<view class="" style="color: #333333;font-size: 28rpx;line-height: 48rpx;">
				<text>
					{{details.describe}}
				</text>
			</view>
			<view class=""  style="margin-bottom: 32rpx;margin-top: 48rpx; color: #333333;font-size: 32rpx;line-height: 44rpx;font-weight: bold;">
				工作地点
			</view>
			<view class="" style="padding-bottom: 48rpx;border-radius: 10rpx;">
				<map v-if="covers[0].latitude!=''" style="width:100%; height: 376rpx;border-radius: 10rpx;" :latitude="details.latitude" :longitude="details.longitude" :markers="covers"></map>
			</view>
		</view>
		<!-- <view class="publishCommentBox" id="bottomHeight" style="width: 100%;padding: 16rpx 32rpx;">
			<view class=""  @tap="goDownloadApp" style="color: #FFFFFF;background-color: #1676FF;border-radius: 50rpx;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 28rpx;line-height: 40rpx;font-weight: bold;">
				打开APP
			</view>
		</view> -->
		<image src="../../static/openApp.png" mode="" class="openImg" @tap="goDownloadApp"></image>
	</view>
</template>

<script>
	var wx = require('jweixin-module')
	export default {
		data() {
			return {
				id:'',
				details:{},
				bottomHeight:'',
				 covers: [{
					latitude: '',
					longitude:'',
					iconPath: '../../static/icon_mapMarker.png',
					callout:{
						content:'',
						display:'ALWAYS',
						color:'#303031',
						fontSize:14,
						borderRadius:14,
						padding:5,
						textAlign:'center',
					},
					url:''
				}]
			};
		},
		onLoad(options) {
			this.id=options.id
			this.getDetails(this.id)
			this.getConfig()
			// this.$nextTick(function(){
			// 	uni.createSelectorQuery()
			// 		.in(this)
			// 		.select('#bottomHeight')
			// 		.boundingClientRect()
			// 		.exec(ret => {
			// 			this.bottomHeight =  ret[0].height
			// 	});
			// })
		},
		methods:{
			getDetails(id){
				uni.request({
					url: '/api/dms/open/recruit/detail/',
					data:{
						recruitPositionId:id
					},
					success: (res) => {
						if (res.data.data.businessCode!==1000) {
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
						}else{
							this.details = res.data.data.data
							// console.log(this.details)
							this.covers[0].latitude = this.details.latitude
							this.covers[0].longitude = this.details.longitude
							this.covers[0].callout.content = this.details.detailsAddress
						}
					}
				})
			},
			goDownloadApp(){
				uni.navigateTo({
					url:'../downloadApp/downloadApp?id=' + this.id + '&type=position'
				})
			},
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
								jsApiList: ['wx-open-launch-weapp','updateAppMessageShareData','updateTimelineShareData'],
								openTagList: ['wx-open-launch-weapp'] // 跳转小程序时必填
							});
						// }
					}
				})
				wx.ready(res => {
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
					    desc: '我分享了一条职场动态', // 分享描述
					    link: unescape(that.url), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					    imgUrl: 'https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/hicity/logo_square.png', // 分享图标
					    success: function () {
					      // 设置成功
					    }
					  })
					  wx.updateTimelineShareData({ 
					      title: that.details.name, // 分享标题
					      link: unescape(that.url), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					      imgUrl: 'https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/hicity/logo_square.png', // 分享图标
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
		}
	}
</script>

<style lang="scss">
.publishCommentBox {
	background: #FFFFFF;
	height: 112rpx;
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
