<template>
	<view class="" :style="{backgroundImage:`url(${detail.bgImg})`}" style="background: no-repeat;background-size:100%;overflow: hidden;">
		<view class="" style="position: relative; border-radius: 32rpx; width: 686rpx;background-color: #FFFFFF; display: flex;flex-direction: column;align-items: center;margin: 0 auto; margin-top: 128rpx;">
			<view class="" style="position: absolute;top: -66rpx;">
				<image :src="detail.avatar" mode="aspectFill" style="width: 160rpx;height: 160rpx;border-radius: 50%;"></image>
			</view>
			<view class="" style="margin-top: 118rpx;">
				{{detail.name}}
			</view>
			<view class="" style="margin-top: 8rpx;">
				圈子ID：{{detail.circleId}}
			</view>
			<view class="" style="display: flex;align-items: center;font-size: 20rpx;line-height: 28rpx;margin-top: 8rpx;">
				<view class="" v-if="!$isEmpty(detail.city)" style="padding: 0rpx 8rpx;background-color: #5D8FE0;color: #FFFFFF;border-radius: 4rpx;margin-right: 8rpx;">
					{{detail.city}}
				</view>
				<view class="" v-if="!$isEmpty(detail.circleTypeLabel)" style="padding: 0rpx 8rpx;background-color: #868BFC;color: #FFFFFF;border-radius: 4rpx;margin-right: 8rpx;">
					{{detail.circleTypeLabel}}
				</view>
				<view class="info" v-if="!$isEmpty(detail.memberNum)">
					{{detail.memberNum+'人'}}
				</view>
			</view>
			<view class="introduce">
				{{$isEmpty(detail.introduction)?'他还没有写下任何圈子介绍～':detail.introduction}}
			</view>
			<view class="time">
				{{$isEmpty(detail.createTime)?'':'创建时间 '+detail.createTime.substring(0, 10)}}
			</view>
		</view>
		<view class="" style="padding: 0rpx 32rpx;">
			<view class="" style="background-color: #FFFFFF;margin-top: 24rpx;border-radius: 16rpx;padding: 0rpx 32rpx;">
				<view class="group">
					<view class="group-title">
						群成员
					</view>
					<view class="group-member">
						<!-- <image :src="$ossUrl('icon_arrowright_gray.png')" class="arrowright"></image> -->
						<image v-for="(item,index) in detail.userList" :key="index" :src="item.avatar" class="avatar"></image>
					</view>
				</view>
				<!-- <view class="" style="width: 100%;height: 1px;background: #EDEDED;opacity: 0.5;">
					
				</view>
				<view class="group">
					<button type="default" open-type="share" class="share">
						<view class="share-view">
							<view class="group-title">
								推荐给好友
							</view>
							<view class="group-member">
								<image :src="$ossUrl('icon_arrowright_gray.png')" class="arrowright">
								</image>
							</view>
						</view>
					</button>
				</view> -->
			</view>
		</view>
		<view class="bottom">
			<view class="bottom-view">
				<button type="primary" class="join" @tap="goApp">加入圈子</button>
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
				id:'',
				detail:{},
				modal:'',
				user:'',
				isAndroid:'',
				isIOS:'',
			};
		},
		methods: {
		},
		onLoad(options) {
			this.id = options.id
			this.getDetails()
			this.getConfig()
		},
		methods:{
			getDetails(){
				uni.request({
					url: '/api/admin/open/mp/circle/detail',
					data:{
						circleId:this.id
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
						}else{
							this.detail = res.data.data.data
						}
					}
				})
			},
			goApp() {
				let that = this;
				// let token = uni.getStorageSync('token')
				// console.log(token)
				var ua = navigator.userAgent.toLowerCase();
				var isWeixin = ua.indexOf('micromessenger') != -1;
				//苹果QQ内置浏览器
				var isQQ =ua.indexOf('qq')!=-1 && ua.indexOf('iphone') !=-1 && ua.indexOf('mqqbrowser')==-1
				if (isWeixin || isQQ) {
					that.modal = 'show';
					// console.log(that.modal)
					// alert(that.modal)
					//微信内置浏览器判断机型
					if (/android/i.test(navigator.userAgent)){
			　　      // 安卓手机
						that.user="1";
					}
					if (/ipad|iphone|mac/i.test(navigator.userAgent)){
						//  苹果手机
						that.user="0";
					}
				}
				else {
					let u = navigator.userAgent;
					// // const lib = new CallApp(option);
					that.isAndroid = u.indexOf('Android') > -1; //安卓终端
					that.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
					if (that.isAndroid) {
						// 安卓的scheme协议跳转
						// window.location.href = 'personalstyle://?id=' + that.data.userId;
						// window.location.href = `govmadeyoucan://`;
						window.location.href = "hicity://wecan/circleCard?id=" + that.id
						setTimeout(function() {
							let hidden = window.document.hidden || window.document.mozHidden || window.document
								.msHidden || window.document
								.webkitHidden;
							if (typeof hidden == 'undefined' || hidden == false) {
								window.location.href = 'http://wn.woneng.net/hicity';
							} else {
								window.close()
							}
						}, 2000);
					}
					if (that.isIOS) {
						// IOS下的scheme协议跳转
						var loadDateTime = new Date();
						// window.location = "hicity://wecan/" +that.type+ "?id=" + that.id; //schema链接或者universal link
						window.location = "https://www.wecan.vip/hicity/?type=circleCard&id="+ that.id
						// window.setTimeout(function() { //如果没有安装app,便会执行setTimeout跳转下载页
						// 	var timeOutDateTime = new Date();
						// 	if (timeOutDateTime - loadDateTime < 5000) {
						// 		window.location = "https://apps.apple.com/cn/app/1557181605"; //ios下载地址  
						// 	} else {
						// 		window.close();
						// 	}
						// }, 2000)
					}
				}
			},
			modalhidden() {
				this.modal = '';
			},
			modalshow(){
				this.modal = 'show';
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
					    title: `${that.detail.name}的名片，快加入我们圈子`, // 分享标题
					    desc: '圈子名片', // 分享描述
					    link: unescape(that.url), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					    imgUrl:that.$ossUrl('bg_share_circle_card.png'), // 分享图标
					    success: function () {
					      // 设置成功
					    }
					  })
					  wx.updateTimelineShareData({ 
					      title: `${that.detail.name}的名片，快加入我们圈子`, // 分享标题
					      link: unescape(that.url), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					      imgUrl: that.$ossUrl('bg_share_circle_card.png'), // 分享图标
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
	button::after{
		border: none;
	}
	page{
		background-color: #F5F7F8;
	}
	.join{
		padding: 0;
		margin: 0;
		border-radius: 64rpx;
		background-color: #415BFD;
		font-size: 30rpx;
		line-height: 42rpx;
		padding: 24rpx;
	}
	.share {
		background-color: #FFFFFF;
		padding: 0;
		margin: 0;
		width: 100%;
	
		.share-view {
			width: 100%;
			height: 100%;
			background-color: #FFFFFF;
			align-items: center;
			display: flex;
			justify-content: space-between;
		}
	
		.share-icon {
			height: 36rpx;
			width: 36rpx;
		}
	
		.share-text {
			text-align: left;
			padding-left: 16rpx;
			color: #272727;
			font-size: 30rpx;
			line-height: 42rpx;
		}
	
		.arrowright {
			width: 48rpx;
			height: 48rpx;
		}
	}
	.introduce {
		width: 590rpx;
		text-align: center;
		margin-top: 32rpx;
		color: #5F5F5F;
		font-size: 26rpx;
		line-height: 38rpx;
	}
	
	.time {
		margin-top: 32rpx;
		width: 590rpx;
		color: #999999;
		font-size: 24rpx;
		line-height: 34rpx;
		margin-bottom: 48rpx;
	}
	.group {
		padding: 36rpx 0rpx;
		background-color: #FFFFFF;
		align-items: center;
		display: flex;
	
		.group-title {
			color: #272727;
			font-size: 30rpx;
			line-height: 42rpx;
		}
	
		.group-member {
			display: flex;
			align-items: center;
			flex-direction: row-reverse;
			flex: 1;
	
			.arrowright {
				width: 48rpx;
				height: 48rpx;
				margin-left: 16rpx;
			}
	
			.avatar {
				margin-left: 16rpx;
				height: 64rpx;
				width: 64rpx;
				border-radius: 50%;
			}
		}
	}	
</style>
