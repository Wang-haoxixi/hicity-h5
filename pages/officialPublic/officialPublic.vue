<template>
	<!-- 热门咨询详情 -->
		<view class="comment">
			<!-- 详情内容 -->
			<view class="detail-box" v-if="detail">
				<view class="title">{{detail.officialNewsName}}</view>
				<view class="publish-time">发布时间：{{detail.createTime}}</view>
				<jyf-parser class="parser" :html="detail.officialNewsContent" :tag-style="tagStyle" lazy-load></jyf-parser>
			</view>
			<view class="noData" v-if="!detail">
				暂无数据
			</view>
			<!-- 背景蒙层 -->
			<!-- <view :class="{inpBg:isShowBg}" @tap="closeBg"></view> -->
			<!-- 底部发布评论部分 -->
			<!-- <view class="publishCommentBox" :class="{safebox:!isShowBg}" @tap="goDownloadApp">
				<view class="inpBox">
					<input class="uni-input" disabled="true"/>
				</view>
				<view class="zan-pinglun" v-show="!isShowBg">
					<view>
						<image src='../../static/icon-big-praise.png' class="img"></image>
						<text>{{isEmpty(detail.likesNum)? '0' : detail.likesNum}}</text>
					</view>
					<view>
						<image src="../../static/pinglun.png" class="img"></image>
						<text>{{isEmpty(commentData.total)? '0' : detail.likesNum}}</text>
					</view>
				</view>
				<view class="sendbox" :class="{'activesend':input1.trim().length==0?false:true}" v-show="isShowBg">
					发送
				</view>
			</view> -->
			<image src="../../static/openApp.png" mode="" class="openImg" @tap="goDownloadApp"></image>
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
				url:''
			};
		},
		onLoad(options) {
			this.id = options.id,
			this.getDetails(this.id)
			this.getConfig()
		},
		methods:{
			isEmpty,
			gettime,
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
		}
	}
</script>

<style lang="scss">
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

		.browse-num {
			margin-top: 64rpx;
			height: 34rpx;
			line-height: 34rpx;
			font-size: 24rpx;
			color: #999999;
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
