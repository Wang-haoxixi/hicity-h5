<template>
	<view class="">
		<!-- 热门咨询详情 -->
			<view class="comment">
				<!-- 详情内容 -->
				<view class="detail-box" v-if="detail">
					<view class="title">{{detail.officialNewsName}}</view>
					<view class="publish-time">发布时间：{{detail.createTime}}</view>
					<jyf-parser class="parser" :html="detail.officialNewsContent" :tag-style="tagStyle" lazy-load></jyf-parser>
					<!-- notice -->
					<view class="notice">
						<!-- 转载 -->
						<view v-if="detail.dataType=='2'">
							<!-- detail.author有无作者 -->
							原文{{ detail.author && `由${ detail.author }` }}发布于{{ detail.newsSource }}，由<text style="color: #5f5f5f;">{{ detail.createByName }}</text> 转载至超能平台，未经许可，禁止转载。内容、版权和其它问题，请在30日内与本平台联系，我们将在第一时间处理。
						</view>
						<!-- 原创 -->
						<view v-else-if="detail.dataType=='1'">
							本文由 <text style="color: #5F5F5F;">{{detail.createByName}}</text> 发布于超能平台，未经许可，禁止转载。
						</view>
					</view>
					
					<view class="tag-box" v-if="detail.labelList && detail.labelList.length>0">
						<view class="tag-item u-f-ajc" v-for="(item,index) in detail.labelList" :key='index'>
							{{item.name}}
						</view>
					</view>
					<view class="browse-num">帖子浏览数：{{detail.browseNum}}</view>
				</view>
				<view class="noData" v-if="!detail">
					暂无数据
				</view>
				<view class="recommend-box" v-if="activityList.length>0">
					<view class="recommend-box-title">
						相关活动
					</view>
					<view class="activity-list-box">
						<view class="activity-item u-f-ac" v-for="(item,index) in activityList" :key='index'
							@tap="toActivity(item)">
							<image :src="item.poster"></image>
							<view class="activity-content u-f1">
								<view class="activity-title multiLineEllipsis">
									{{item.name}}
								</view>
								<view class="price-box">
									<!-- 免费票情况 -->
									<view v-if="item.ticketingType == '1'">
										<view class="pay" v-if="item.rangePriceOrNot">
											<text>￥</text><text>0</text><text>起</text>
										</view>
										<view class="gratis" v-else>
											免费
										</view>
									</view>
									<!-- 付费票情况 -->
									<view v-else>
										<view class="pay" v-if="item.rangePriceOrNot">
											<text>￥</text><text>{{ item.rmb }}</text><text>起</text>
										</view>
										<view class="pay" v-else>
											<text>￥</text><text>{{item.rmb}}</text>
										</view>
									</view>
								</view>
								<view class="date-address u-f-ac">
									<view>{{item.startTime.substring(0,10).replace(/-/g,".")}}</view>
									<view class="line"></view>
									<view class="hiddenEllipsisNowrap" style="width: 220rpx;">{{item.city}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<image src="../../static/openApp.png" mode="" class="openImg" @tap="goDownloadApp"></image>
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
	import jyfParser from "@/components/jyf-Parser/jyf-parser";
	import {
		gettime
	} from "@/common/time.js"
	import {
		isEmpty
	} from '@/common/utils.js'
	var wx = require('jweixin-module')
	export default {
		components: {
			jyfParser
		},
		data() {
			return {
				id:'',
				detail:{},
				tagStyle: {
					body: 'line-height: 1.8;',
					img: 'background-size: contain|cover;width:100%;height:auto;display: block;',
					p: 'text-indent: 2em',//首行缩进两个字符
				},
				url:'',
				activityList: [], // 活动数组
				modal:'',
				user:'',
				isAndroid:'',
				isIOS:'',
			};
		},
		onLoad(options) {
			this.id = options.id,
			this.getDetails(this.id)
			this.getConfig()
			this.getActivityList()
		},
		methods:{
			isEmpty,
			gettime,
			toActivity(item){
				// console.log(item)
				this.goApp(item)
			},
			// 相关活动
			getActivityList() {
				uni.request({
					url: '/api/cms/open/news_activity/detail_list',
					data: {
						officialNewsId: this.id
					},
					success: (res) => {
						// console.log('res...', res)
						this.activityList = res.data.data.data
					},
				})
			},
			getContent(content){
				return content.replace(new RegExp(/\t/g), "&nbsp;&nbsp;&nbsp;").replace(new RegExp(/ /g), "&nbsp;")
			},
			getDetails(id){
				uni.request({
					url: '/api/cms/open/official_details/',
					data:{
						officialNewsId:id
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
			goDownloadApp(){
				uni.navigateTo({
					url:'../downloadApp/downloadApp?id=' + this.id + '&type=officialPublic'
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
					    title: that.detail.officialNewsName, // 分享标题
					    desc: '我分享了一篇官方发布', // 分享描述
					    link: unescape(that.url), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					    imgUrl:that.detail.officialNewsUrlList.length>0 && !that.isEmpty(that.detail.officialNewsUrlList[0].newsUrl)?that.detail.officialNewsUrlList[0].newsUrl:'https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/hicity/logo_square.png', // 分享图标
					    success: function () {
					      // 设置成功
					    }
					  })
					  wx.updateTimelineShareData({ 
					      title: that.detail.officialNewsName, // 分享标题
					      link: unescape(that.url), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					      imgUrl:that.detail.officialNewsUrlList.length>0 && !that.isEmpty(that.detail.officialNewsUrlList[0].newsUrl)?that.detail.officialNewsUrlList[0].newsUrl:'https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/hicity/logo_square.png', // 分享图标
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
			goApp(item) {
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
						window.location.href = "hicity://wecan/activityDetails?id=" + item.id
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
						window.location = "https://www.wecan.vip/hicity/?type=activityDetails&id="+ item.id
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
		}
	}
</script>

<style lang="scss">
	.recommend-box{
		padding: 0rpx 32rpx;
		padding-top: 64rpx;
		.recommend-box-title{
			color: #272727;
			font-size: 32rpx;
			font-weight: bold;
			padding-bottom: 32rpx;
		}
		.recommend-list-box{
			.recommend-item{
				padding-bottom: 48rpx;
				.recommend-content{
					color: #272727;
					font-size: 32rpx;
					line-height: 48rpx;
					margin-right: 32rpx;
				}
				>image{
					width: 224rpx;
					height: 152rpx;
					border-radius: 8rpx;
				}
			}
		}
		.activity-list-box{
			.activity-item{
				padding-bottom: 48rpx;
				.activity-content{
					.activity-title{
						font-size: 28rpx;
						font-weight: 500;
						line-height: 40rpx;
						color: #272727;
					}
					.price-box{
						margin: 16rpx 0 6rpx 0;
						.gratis{
							font-size: 32rpx;
							line-height: 40rpx;
							color: #15CBA1;
						}
						.pay{
							color: #FD672A;
							>text:nth-of-type(1),text:nth-of-type(3){
								font-size: 24rpx;
							}
							>text:nth-of-type(2){
								font-size: 32rpx;
								margin: 0 6rpx;
							}
						}
					}
					.date-address{
						color: #999999;
						line-height: 40rpx;
						font-size: 24rpx;
						.line{
							background-color: #CECECE;
							width: 2rpx;
							height: 20rpx;
							margin: 0 12rpx;
						}
					}
				}
				>image{
					width: 300rpx;
					height: 180rpx;
					border-radius: 8rpx;
					margin-right: 24rpx;
				}
			}
		}
	}
	.notice{
		padding-top: 20rpx;
		color: #999999;
		font-size: 24rpx;
		line-height: 40rpx;
	}
	
	.tag-box{
		padding-top: 32rpx;
		display: flex;
		// justify-content: space-between;
		.tag-item{
			font-size: 26rpx;
			color: #272727;
			width: 212rpx;
			height: 72rpx;
			background-color: #F5F7F8;
			border: 2rpx solid #EDEDED;
			border-radius: 8rpx;
			margin-right: 24rpx;
		}
	}
	
	.browse-num {
		margin-top: 32rpx;
		height: 34rpx;
		line-height: 34rpx;
		font-size: 24rpx;
		color: #999999;
	}
page {
		background-color: #FFFFFF;
		height: 100%;
	}

	.comment {
		height: 100%;
	}

	.noData {
		height: 200rpx;
		font-size: 24rpx;
		color: #CCCCCC;
		text-align: center;
		line-height: 200rpx;
	}

	.detail-box {
		padding: 36rpx 32rpx 32rpx;

		.title {
			line-height: 52rpx;
			font-size: 36rpx;
			color: #333333;
			font-weight: bold;
		}

		.publish-time {
			margin-top: 20rpx;
			height: 34rpx;
			height: 34rpx;
			font-size: 24rpx;
			color: #999999;
		}

		.parser {
			margin-top: 48rpx;
		}
	}

	.hr {
		height: 16rpx;
		background: #F9F9F9;
	}

	.comment-box {
		padding: 32rpx 32rpx 100rpx 32rpx;
		@extend %safe-bottom-box;

		.commentBar {
			height: 70rpx;
			display: flex;

			.commentBar-item {
				.commentTitle {
					color: #1676FF !important;
					font-weight: 500;
					color: #333333;
					font-size: 32rpx;
					margin-right: 15rpx;
					position: relative;

					::after {
						content: '';
						width: 20rpx;
						height: 6rpx;
						position: absolute;
						bottom: -26rpx;
						left: 41%;
						background-color: #1676FF;
					}
				}
			}
		}

		.noContent {
			padding-top: 16rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
			text-align: center;

			>image {
				width: 280rpx;
				height: 180rpx;
			}

			>view {
				padding-top: 48rpx;
			}
		}

		.load-more {
			padding: 40rpx 0;
		}

		.commentBody {
			.first-comment:last-of-type {
				margin-bottom: 0;
			}

			// height: 100%;
			.first-comment {
				margin: 32rpx 0;
				padding-bottom: 32rpx;
				border-bottom: 2rpx solid #EDEDED;

				.first-comment-top {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;

					.imgBox {
						width: 76rpx;
						height: 76rpx;

						>image {
							width: 100%;
							height: 100%;
							border-radius: 100%;
						}
					}

					.name-time {
						flex: 1;
						display: flex;
						flex-direction: column;
						// justify-content: center;
						margin-left: 20rpx;

						.name {
							font-size: 28rpx;
							font-weight: 500;
							color: #333333;
						}

						.time {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;
							margin-top: 6rpx;
						}
					}

					.zan-selected {
						width: 100rpx;
						height: 48rpx;
						border: 2rpx solid #1676FF;
						border-radius: 40rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						>image {
							width: 28rpx;
							height: 28rpx;
							margin-right: 6rpx;
						}

						>text {
							width: 30rpx;
							font-size: 22rpx;
							font-weight: 400;
							color: #1676FF;
							text-align: center;
						}
					}

					.zan {
						width: 100rpx;
						height: 48rpx;
						border: 2rpx solid #EDEDED;
						border-radius: 40rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						>image {
							width: 28rpx;
							height: 28rpx;
							margin-right: 6rpx;
						}

						>text {
							width: 30rpx;
							font-size: 22rpx;
							font-weight: 400;
							color: #999999;
							text-align: center;
						}
					}
				}

				.first-comment-bottom {
					margin-top: 20rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;
				}

				.second-comment {
					margin-top: 32rpx;
					display: flex;
				}

				.second-comment-avatar {
					width: 48rpx;
					image {
						width: 48rpx;
						height: 48rpx;
						border-radius: 50%;
					}
				}

				.second-comment-content {
					margin-left: 16rpx;
					flex: 1;

					.name {
						font-size: 28rpx;
						font-weight: 500;
						color: #333333;
						height: 48rpx;
						line-height: 48rpx;
					}

					.text {
						font-size: 28rpx;
						font-weight: 400;
						line-height: 48rpx;
						color: #333333;
					}

					.time {
						font-size: 24rpx;
						font-weight: 400;
						line-height: 32rpx;
						color: #999999;
					}

				}

				.more {
					font-size: 28rpx;
					font-weight: 400;
					margin-top: 16rpx;
					color: #1676FF;
					margin-left: 66rpx;
				}
			}
		}
	}

	.inpBg {
		background-color: rgba(0, 0, 0, 0.10);
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
	}

	.safebox {
		@extend %safe-bottom;
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

		.inpBox {
			flex: 2;
			display: flex;
			align-items: center;

			.uni-input {
				box-sizing: border-box;
				margin-left: 28rpx;
				width: 100%;
				height: 80rpx;
				background-color: #F9F9F9;
				border-radius: 160rpx;
				padding: 0 30rpx;
			}

			.placeholderStyle {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
		}

		.sendbox {
			width: 120rpx;
			line-height: 112rpx;
			text-align: center;
			font-size: 32rpx;
		}

		.activesend {
			color: #1676FF;
		}

		.zan-pinglun {
			flex: 1;
			display: flex;
			justify-content: space-evenly;
			align-items: center;

			>view {
				display: flex;
				flex-direction: column;
				align-items: center;

				.img {
					width: 48rpx;
					height: 48rpx;
				}

				>text {
					font-size: 20rpx;
					font-weight: 400;
					color: #999999;
				}
			}

		}
	}
	.openImg{
		width: 148rpx;
		height: 148rpx;
		position: fixed;
		right: 14rpx;
		bottom: 128rpx;
	}
</style>
