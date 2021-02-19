<template>
	<!-- 热门咨询详情 -->
	<view class="comment">
		<!-- 详情内容 -->
		<view class="detail-box" v-if="detail">
			<view class="title">{{detail.title}}</view>
			<view class="publish-time">发布时间：{{ gettime(detail.createTime) }}</view>
			<jyf-parser class="parser" :html="detail.content" :tag-style="tagStyle" lazy-load></jyf-parser>
			<view class="browse-num">帖子浏览数：{{detail.browseNum}}</view>
		</view>
		<view class="noData" v-if="!detail">
			暂无数据
		</view>

		<view class="hr"></view>

		<!-- 评论部分 -->
		<view class="comment-box">
			<view class="commentBar">
				<view class="commentBar-item">
					<text class="commentTitle">全部评论</text><text>({{commentData.total}})</text>
				</view>
			</view>

			<view class="commentBody" v-if="!commentData.total==0">

				<view class="first-comment" v-for="(item,i) in commentData.records" :key='i'>
					<!-- 一级评论 -->
					<view @tap="tapCommentFirst({id:item.commentId,type:'commentFirst'})">
						<view class="first-comment-top">
							<view class="imgBox">
								<image :src="item.createByAvatar"></image>
							</view>
							<view class="name-time">
								<view class="name">
									{{item.createByName}}
								</view>
								<view class="time">
									{{ gettime(item.createTime) }}
								</view>
							</view>
							<view class="zan" @tap.stop='handlePraise(item)'>
								<image :src="!isZan?'../../static/zan.png':'../../static/zanSelect.png'"></image>
								<text>{{item.thumbNum}}</text>
							</view>
						</view>
						<text space="nbsp" class="first-comment-bottom">
							{{item.content}}
						</text>
					</view>

					<!-- 二级评论 -->
					<view @tap="tapCommentSecond({id:item2.commentId,type:'commentSecond'})" class="second-comment" v-for="(item2,i2) in item.replyVO.records"
					 :key='i2'>
						<view class="second-comment-avatar">
							<image :src="item2.createAvatar"></image>
						</view>
						<view class="second-comment-content">
							<view class="name">
								{{item2.createByName}}
							</view>
							<!-- 判断二级评论的父级id是否与自己的id相等,为true即回复的父级，false则回复的自己 -->
							<view class="text" v-if="item2.rankingCommentId===item.commentId">
								{{item2.content}}
							</view>
							<view class="text" v-else>
								<text space="nbsp"> 回复 </text><text style="color: #888888;" space="nbsp">{{item2.replyName}} :</text>
								{{item2.content}}
							</view>
							<view class="time">
								{{item2.createTime}}
							</view>
						</view>
					</view>
					<!-- 展开更多 -->
					<view v-if="item.replyVO.total >5 && item.replyVO.current<item.replyVO.pages" class="more" @tap='handleShowMore(item)'>
						展开更多回复
					</view>
				</view>
			</view>

			<view v-else class="noContent">
				暂无评论
			</view>

			<!-- 加载更多 -->
			<view class="load-more">
				<uni-load-more :contentText="{contentnomore:'- THE END -'}" :iconSize='18' v-if="commentData.records.length>10"
				 :status="pinglunPageStatus"></uni-load-more>
				<uni-load-more :contentText="{contentnomore:'- THE END -'}" :iconSize='18' v-if="commentData.records.length>0 && commentData.records.length<=10"
				 status="noMore"></uni-load-more>
			</view>

		</view>

		<!-- 背景蒙层 -->
		<view :class="{inpBg:isShowBg}" @tap="closeBg"></view>
		<!-- 底部发布评论部分 -->
		<view class="publishCommentBox">
			<view class="inpBox">
				<input @tap="tapInput({type:'commentDetails'})" @blur="inpBlur" ref='inputFocus' v-model="input1" class="uni-input"
				 placeholder-class='placeholderStyle' placeholder="说点什么吧~" />
			</view>
			<view class="zan-pinglun" v-show="!isShowBg">
				<view @tap='bottomGood()'>
					<image src="../../static/zan.png" class="img"></image>
					<text>312</text>
				</view>
				<view @tap="tapInput({type:'commentDetails'})">
					<image src="../../static/pinglun.png" class="img"></image>
					<text>1233</text>
				</view>
			</view>
			<view class="sendbox" :class="{'activesend':input1.trim().length==0?false:true}" v-show="isShowBg" @tap.stop="sendbtn">
				发送
			</view>
		</view>

	</view>
</template>

<script>
	let u = navigator.userAgent;
	let isAndroid = u.indexOf('Android') > -1; //安卓终端
	let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

	import jyfParser from "@/components/jyf-Parser/jyf-parser";
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import {
		gettime
	} from "@/common/time.js"
	export default {
		components: {
			jyfParser,
			uniLoadMore
		},
		data() {
			return {
				isShowBg: false, //输入框背景
				input1: '',
				msgType: null, //传给移动端的type值

				tagStyle: {
					body: 'line-height: 1.8;',
					img: 'background-size: contain|cover;width:100%;height:auto;'
				},
				id: null, //资讯id
				detail: {},
				//评论列表
				commentData: {
					records: []
				},
				comment: '',
				commentId: '', //被回复的评论id
				isZan: false, //是否被赞
				pinglunPageStatus: 'more', //加载更多评论显示效果

				promise: null,

				tk: null,

				contentD: null, //评论内容

				replyVOCurrent: 1, //回复数据的当前页
				parId: null, //被回复的评论
			};
		},

		created() {
			// androidRst getToken 方法挂window上
			window.androidRst = this.androidRst
			window.getIosToken = this.getIosToken
		},
		onLoad(option) {
			this.id = option.id
			// 文章详情
			uni.request({
				url: '/api/cms/open/news_details',
				data: {
					newsId: option.id
				},
				success: (res) => {
					console.log('res', res)
					if (res.data.code !== 0) {
						uni.redirectTo({
							url: '../404/404'
						});
					}
					this.detail = res.data.data.data
					console.log('detail', this.detail)
				}
			});
			this.getCommentList()
		},
		onReachBottom() {
			console.log('触底 ~')
			if (this.commentData.current < this.commentData.pages) {
				this.pinglunPageStatus = 'loading'
				uni.request({
					url: '/api/cms/open/news_comment_page',
					data: {
						dataId: this.id, //数据ID
						current: this.commentData.current + 1, //当前页
					},
					success: (res) => {
						console.log('评论列表res', res)
						if (res.data.code !== 0) {
							return uni.showToast({
								title: '获取评论列表失败',
								duration: 1500,
								icon: "none",
							});
						}
						this.commentData.current = res.data.data.data.current
						if (this.commentData.current < this.commentData.pages) {
							this.pinglunPageStatus = 'more'
						} else {
							this.pinglunPageStatus = 'noMore'
						}
						this.commentData.records = this.commentData.records.concat(res.data.data.data.records)
					}
				})
			}
		},
		methods: {
			// 评论详情
			comDetail() {
				let that = this
				if (this.contentD == '') {
					return uni.showToast({
						title: '内容不能为空',
						duration: 1500,
						icon: "none",
					});
				}
				uni.request({
					url: '/api/cms/common_comment/create',
					header: {
						// "Authorization": 'Bearer ' + 'dee062e6-3bfe-40df-8225-7ffd784762d7'
						"Authorization": 'Bearer ' + this.tk
					},
					method: "POST",
					data: {
						content: this.contentD, //评论内容
						dataId: this.id, //数据ID
						type: 2, //数据类型 1-官方发布 2-热门新闻
					},
					complete: (res) => {
						// uni.showToast({
						// 	title: JSON.stringify(res),
						// 	duration: 20000,
						// 	icon: "none",
						// });
						if (res.statusCode == 200) {
							if (res.data.code != 0) {
								return uni.showToast({
									title: '评论发布失败',
									duration: 1500,
									icon: "none",
								});
							}
							uni.showToast({
								title: '您已发布评论',
								duration: 1500,
								icon: "none",
							});
							
							// 刷新评论
							that.getCommentList()
						} else if (res.statusCode == 401) {
							uni.showToast({
								title: '登录过期',
								duration: 1500,
								icon: "none",
							});
							this.input1 = ''
							this.isShowBg = false
							setTimeout(() => {
								window.android.invoke_native("goLogin", null, "androidRst")
							}, 1500)

						} else {
							uni.showToast({
								title: '请检查您的网络',
								duration: 1500,
								icon: "none",
							});
						}
					},
				})
			},
			// 一级回复
			comFirst() {
				let that = this
				if (this.contentD == '') {
					return uni.showToast({
						title: '内容不能为空',
						duration: 1500,
						icon: "none",
					});
				}
				uni.request({
					url: '/api/cms/common_comment/reply',
					header: {
						// "Authorization": 'Bearer ' + '7b9bb3b6-2f7c-4aff-9275-1f9ec2c83d84'
						"Authorization": 'Bearer ' + this.tk
					},
					method: "POST",
					data: {
						content: this.contentD, //评论内容
						commentId: this.commentId, //评论ID
					},
					complete: (res) => {
						// uni.showToast({
						// 	title: JSON.stringify(res),
						// 	duration: 20000,
						// 	icon: "none",
						// });

						if (res.statusCode == 200) {
							if (res.data.code != 0) {
								return uni.showToast({
									title: '你的回复发布失败',
									duration: 1500,
									icon: "none",
								});
							}
							uni.showToast({
								title: '你的回复发布成功',
								duration: 1500,
								icon: "none",
							});
							// 刷新评论
							that.getCommentList()
						} else if (res.statusCode == 401) {
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
			// 二级回复
			comSecond() {
				let that = this
				if (this.contentD == '') {
					return uni.showToast({
						title: '内容不能为空',
						duration: 1500,
						icon: "none",
					});
				}
				uni.request({
					url: '/api/cms/common_comment/reply',
					header: {
						// "Authorization": 'Bearer ' + 'd472cd38-924b-4466-bab6-77d58dc722f7'
						"Authorization": 'Bearer ' + this.tk
					},
					method: "POST",
					data: {
						content: this.contentD, //评论内容
						commentId: this.commentId, //评论ID
					},
					complete: (res) => {
						// uni.showToast({
						// 	title: JSON.stringify(res),
						// 	duration: 20000,
						// 	icon: "none",
						// });

						if (res.statusCode == 200) {
							if (res.data.code != 0) {
								return uni.showToast({
									title: '你的回复发布失败',
									duration: 1500,
									icon: "none",
								});
							}
							uni.showToast({
								title: '你的回复发布成功',
								duration: 1500,
								icon: "none",
							});
							// 刷新评论
							that.getCommentList()
						} else if (res.statusCode == 401) {
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
			gettime,
			// 获取更多
			showMore() {
				this.replyVOCurrent += 1
				let that = this;
				uni.request({
					url: '/api/cms/common_comment/reply_page',
					header: {
						// "Authorization": 'Bearer ' + '7b9bb3b6-2f7c-4aff-9275-1f9ec2c83d84'
						"Authorization": 'Bearer ' + that.tk
					},
					data: {
						commentId: that.parId, //评论ID
						size: 5,
						current: that.replyVOCurrent
					},
					complete: (res) => {
						// uni.showToast({
						// 	title: JSON.stringify(res),
						// 	duration: 20000,
						// 	icon: "none",
						// });

						if (res.statusCode == 200) {
							if (res.data.code !== 0) {
								return uni.showToast({
									title: '获取更多回复失败',
									duration: 1500,
									icon: "none",
								});
							}
							that.replyVOCurrent = res.data.data.data.current
							that.commentData.records.forEach((item, i) => {
								if (item.commentId == that.parId) {
									item.replyVO.current = res.data.data.data.current
									item.replyVO.records = item.replyVO.records.concat(res.data.data.data.records)
								}
							})
						} else if (res.statusCode == 401) {
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
			// 获取token
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
			// 安卓的回调
			androidRst(res) {
				// uni.showToast({
				// 	title: 'token:' + res.token + 'type:' + res.resultType,
				// 	icon: 'none'
				// });
				this.tk = res.token
				if (res.resultType == "commentDetails") {
					this.comDetail()
				} else if (res.resultType == "commentFirst") {
					this.comFirst()
				} else if (res.resultType == "commentSecond") {
					this.comSecond()
				} else if (res.resultType == "showMore") {
					this.showMore()
				}
			},
			// ios的回调
			getIosToken(res) {
				// uni.showToast({
				// 	title: 'token:' + res.token + 'type:' + res.type,
				// 	icon: 'none',
				// 	duration: 3000
				// });
				this.tk = res.token
				if (res.type == "commentDetails") {
					this.comDetail()
				} else if (res.type == "commentFirst") {
					this.comFirst()
				} else if (res.type == "commentSecond") {
					this.comSecond()
				} else if (res.type == "showMore") {
					this.showMore()
				}
			},
			// 获取评论列表
			getCommentList() {
				uni.request({
					url: '/api/cms/open/news_comment_page',
					data: {
						dataId: this.id, //数据ID
						current: 1, //当前页
					},
					success: (res) => {
						console.log('评论列表res', res)
						if (res.data.code !== 0) {
							return uni.showToast({
								title: '获取评论列表失败',
								duration: 1500,
								icon: "none",
							});
						}
						this.commentData = res.data.data.data
					}
				})
			},
			// 赞
			handlePraise(item) {
				console.log(item)
				this.isZan = !this.isZan
				item.thumbNum += 1
			},
			// 点击评论输入框
			tapInput(opt) {
				this.msgType = opt.type
				this.isShowBg = true
				this.$refs.inputFocus.focus = true
			},
			// 点击一级评论
			tapCommentFirst(opt) {
				this.msgType = opt.type
				// 获取评论id
				this.commentId = opt.id
				this.isShowBg = true
				this.$refs.inputFocus.focus = true
			},
			// 点击二级评论
			tapCommentSecond(opt) {
				this.msgType = opt.type
				// 获取评论id
				this.commentId = opt.id
				this.isShowBg = true
				this.$refs.inputFocus.focus = true
			},
			// 关闭背景
			closeBg() {
				this.isShowBg = false
				this.$refs.inputFocus.focus = false
			},
			// 失去焦点时触发
			inpBlur() {
				this.contentD = this.input1
				this.input1 = ''
				this.$refs.inputFocus.focus = false
			},
			// 发送
			sendbtn() {
				this.handleToken(this.msgType)
				this.isShowBg = false
				this.input1 = ''
			},
			// 底部点赞
			bottomGood() {
				console.log('底部点赞')
			},
			// 展开更多
			handleShowMore(queryItem) {
				this.handleToken('showMore')
				this.replyVOCurrent = queryItem.replyVO.current
				this.parId = queryItem.commentId
			}
		},
		onPageScroll(e) {
			this.input1 = ''
			this.isShowBg = false
			this.$refs.inputFocus.focus = false
		},
		onHide(){
			this.input1 = ''
			this.isShowBg = false
		},
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
			height: 200rpx;
			width: 100%;
			text-align: center;
			line-height: 200rpx;
			font-size: 24rpx;
			color: #CCCCCC;
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
							font-size: 22rpx;
							font-weight: 400;
							color: #999999;
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

	.publishCommentBox {
		background: #FFFFFF;
		height: 112rpx;
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
</style>
