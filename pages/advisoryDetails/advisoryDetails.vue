<template>
	<!-- 热门咨询详情 -->
	<view class="comment">
		<!-- 详情内容 -->
		<view class="detail-box">
			<view class="title">{{detail.title}}</view>
			<view class="publish-time">发布时间：{{detail.createTime}}</view>
			<jyf-parser class="parser" :html="detail.content" :tag-style="tagStyle" lazy-load></jyf-parser>
			<view class="browse-num">帖子浏览数：{{detail.browseNum}}</view>
		</view>

		<view class="hr"></view>

		<!-- 评论部分 -->
		<view class="comment-box">
			<view class="commentBar">
				<view class="commentBar-item">
					<text class="commentTitle">全部评论</text><text>({{commentData.records.length}})</text>
				</view>
			</view>
			<view class="commentBody">
				<!-- 评论当前页咨询 -->
				<easy-entry ref="commentConsult" @sendText="sendConsultComment" theme="#ffffff"></easy-entry>
				<!-- 一级评论输入框 -->
				<easy-entry ref="commentFirst" @sendText="sendFirstComment" theme="#ffffff"></easy-entry>
				<!-- 二级评论输入框 -->
				<easy-entry ref="commentSecond" @sendText="sendSecondComment" theme="#ffffff"></easy-entry>

				<view class="first-comment" v-for="(item,i) in commentData.records" :key='i'>
					<!-- 一级评论 -->
					<view @tap='toCommentFirst(item.commentId)'>
						<view class="first-comment-top">
							<view class="imgBox">
								<image :src="item.createByAvatar"></image>
							</view>
							<view class="name-time">
								<view class="name">
									{{item.createByName}}
								</view>
								<view class="time">
									{{item.createTime}}
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
					<view @tap='toCommentSecond(item2.commentId)' class="second-comment" v-for="(item2,i2) in item.replyVO.records"
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
					<view v-if="item.replyVO.records.length >0 && item.replyVO.current<=item.replyVO.pages" class="more" @tap='handleShowMore(item)'>
						展开更多回复
					</view>
				</view>
			</view>
			<uni-load-more :iconSize='18' v-if="commentData.records.length>10" :status="pinglunPageStatus"></uni-load-more>
		</view>

		<!-- 底部发布评论部分 -->
		<view class="publishCommentBox">
			<view class="inpBox">
				<input @tap="onEntry()" class="uni-input" placeholder-class='placeholderStyle' placeholder="说点什么吧~" />
			</view>
			<view class="zan-pinglun">
				<view @tap='bottomGood()'>
					<image src="../../static/zan.png" class="img"></image>
					<text>312</text>
				</view>
				<view @tap='onEntry()'>
					<image src="../../static/pinglun.png" class="img"></image>
					<text>1233</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-Parser/jyf-parser";
	import easyEntry from "@/components/easy-entry/easy-entry";
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		components: {
			jyfParser,
			easyEntry,
			uniLoadMore
		},
		data() {
			return {
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
			};
		},

		created() {
			window.androidRst = this.androidRst
			console.log(androidRst)
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
					header: {
						"Authorization": 'Bearer ' + 'd472cd38-924b-4466-bab6-77d58dc722f7' //自定义请求头信息
					},
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
						console.log('评论列表', this.commentData)
						this.getReplyList(this.commentData.records)
					}
				})
			}
		},
		methods: {
			androidRst(res) {
				alert('原生传过来的数据:' + res.token)
			},

			// 获取单评论回复
			getReplyList(arr) {
				// 遍历父级评论数组
				arr.forEach((item) => {
					console.log('item', item)
					uni.request({
						url: '/api/cms/common_comment/reply_page',
						header: {
							"Authorization": 'Bearer ' + 'd472cd38-924b-4466-bab6-77d58dc722f7' //自定义请求头信息
						},
						data: {
							commentId: item.commentId, //评论ID
							size: 1,
							current: 1
						},
						success: res => {
							console.log('单回复列表', res)
							item.replyVO.records = res.data.data.data.records
						}
					})
				})
			},
			// 获取评论列表
			getCommentList() {
				uni.request({
					url: '/api/cms/open/news_comment_page',
					header: {
						"Authorization": 'Bearer ' + 'd472cd38-924b-4466-bab6-77d58dc722f7' //自定义请求头信息
					},
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
						// 获取单评论回复
						this.getReplyList(this.commentData.records)
						console.log('评论列表', this.commentData)

					}
				})
			},
			// 赞
			handlePraise(item) {
				console.log(item)
				this.isZan = !this.isZan
				item.thumbNum += 1
			},
			// 唤起评论
			onEntry() {
				this.$refs.commentConsult.onEntry()
			},
			// 唤起一级评论
			toCommentFirst(id) {
				console.log('一级评论', id)
				// 获取评论id
				this.commentId = id
				this.$refs.commentFirst.onEntry()
			},
			// 唤起二级评论
			toCommentSecond(id) {
				console.log('二级评论', id)
				this.commentId = id
				this.$refs.commentSecond.onEntry()
			},
			// 发送咨询的评论
			sendConsultComment(content) {
				window.android.invoke_native("getToken", '', "androidRst")
				// console.log('咨询的评论', content)
				// if (content == '') {
				// 	return uni.showToast({
				// 		title: '内容不能为空',
				// 		duration: 1500,
				// 		icon: "none",
				// 	});
				// }
				// uni.request({
				// 	url: '/api/cms/common_comment/create',
				// 	header: {
				// 		"Authorization": 'Bearer ' + 'd472cd38-924b-4466-bab6-77d58dc722f7' //自定义请求头信息
				// 	},
				// 	method: "POST",
				// 	data: {
				// 		content: content, //评论内容
				// 		dataId: this.id, //数据ID
				// 		type: 2, //数据类型 1-官方发布 2-热门新闻
				// 	},
				// 	success: (res) => {
				// 		console.log('发表评论', res)
				// 		if (res.data.code !== 0) {
				// 			return uni.showToast({
				// 				title: '评论发布失败',
				// 				duration: 1500,
				// 				icon: "none",
				// 			});
				// 		}
				// 		uni.showToast({
				// 			title: '评论已发布',
				// 			duration: 1500,
				// 			icon: "none",
				// 		});
				// 		// 刷新评论
				// 		this.getCommentList()
				// 	}
				// })
			},
			// 发送一级评论
			sendFirstComment(content) {
				console.log('一级评论', content)
				if (content == '') {
					return uni.showToast({
						title: '内容不能为空',
						duration: 1500,
						icon: "none",
					});
				}
				uni.request({
					url: '/api/cms/common_comment/reply',
					header: {
						"Authorization": 'Bearer ' + 'd472cd38-924b-4466-bab6-77d58dc722f7' //自定义请求头信息
					},
					method: "POST",
					data: {
						content: content, //评论内容
						commentId: this.commentId, //评论ID
					},
					success: (res) => {
						console.log('一级评论成功', res)
						if (res.data.code !== 0) {
							return uni.showToast({
								title: '你的回复发布失败',
								duration: 1500,
								icon: "none",
							});
						}
						uni.showToast({
							title: '你的回复已发布',
							duration: 1500,
							icon: "none",
						});
						// 刷新评论
						this.getCommentList()
					}
				})
			},
			// 发送二级评论
			sendSecondComment(content) {
				console.log('二级评论', content)
				if (content == '') {
					return uni.showToast({
						title: '内容不能为空',
						duration: 1500,
						icon: "none",
					});
				}
				uni.request({
					url: '/api/cms/common_comment/reply',
					header: {
						"Authorization": 'Bearer ' + 'd472cd38-924b-4466-bab6-77d58dc722f7' //自定义请求头信息
					},
					method: "POST",
					data: {
						content: content, //评论内容
						commentId: this.commentId, //评论ID
					},
					success: (res) => {
						console.log('二级评论成功', res)
						if (res.data.code !== 0) {
							return uni.showToast({
								title: '你的回复发布失败',
								duration: 1500,
								icon: "none",
							});
						}
						uni.showToast({
							title: '你的回复已发布',
							duration: 1500,
							icon: "none",
						});
						// 刷新评论
						this.getCommentList()
					}
				})
			},

			// 底部点赞
			bottomGood() {
				console.log('底部点赞')
			},
			// 展开更多
			handleShowMore(queryItem) {
				console.log('queryItem', queryItem)
				uni.request({
					url: '/api/cms/common_comment/reply_page',
					header: {
						"Authorization": 'Bearer ' + 'd472cd38-924b-4466-bab6-77d58dc722f7' //自定义请求头信息
					},
					data: {
						commentId: queryItem.commentId, //评论ID
						size: 10,
						current: queryItem.replyVO.current
					},
					success: res => {
						if (res.data.code !== 0) {
							return uni.showToast({
								title: '获取更多回复失败',
								duration: 1500,
								icon: "none",
							});
						}
						// 点击展开更多，将回复数据存入当前评论中
						this.commentData.records.forEach(item => {
							if (item.commentId === queryItem.commentId) {
								if (item.replyVO.records.length === 1) {
									item.replyVO.records = res.data.data.data.records
									item.replyVO.current += 1
								} else if (item.replyVO.records.length > 1) {
									item.replyVO.records = item.replyVO.records.concat(res.data.data.data.records)
									item.replyVO.current += 1
								}
							}
						})
					}
				})
			}
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
						justify-content: center;
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
			// justify-content: flex-end;
			align-items: center;

			.uni-input {
				box-sizing: border-box;
				margin-left: 32rpx;
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
