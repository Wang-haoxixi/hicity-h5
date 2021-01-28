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
					<text class="commentTitle">全部评论</text><text>(21)</text>
				</view>
			</view>
			<view class="commentBody">
				<!-- <commentBox></commentBox> -->
				<!-- <commonList :item='{}' :index=2></commonList> -->
				<!-- 一级评论 -->
				<view class="first-comment">
					<view class="first-comment-top">
						<view class="imgBox">
							<image src="../../static/guangong.jpg"></image>
						</view>
						<view class="name-time">
							<view class="name">
								丽丽
							</view>
							<view class="time">
								2020-11-20 15:20
							</view>
						</view>
						<view class="zan">
							<image src="../../static/zanSmall.png"></image>
							<text>12</text>
						</view>
					</view>
					<view class="first-comment-bottom">
						当然是窝在被窝里睡大觉啦，这么冷的天～哈哈
					</view>

					<!-- 二级评论 -->
					<view class="second-comment">
						<view class="second-comment-avatar">
							<image src="../../static/erha2.jpg"></image>
						</view>
						<view class="second-comment-content">
							<view class="name">
								楠楠
							</view>
							<view class="text">
								哈哈，想必姐妹见过大世面
							</view>
							<view class="time">
								2020-11-20 15:20
							</view>
							<!-- 展开更多 -->
							<view class="more">
								展开14条回复
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>

		<!-- 底部发布评论部分 -->
		<view class="publishCommentBox">
			<view class="inpBox">
				<input class="uni-input" placeholder-class='placeholderStyle' placeholder="说点什么吧~" />
			</view>
			<view class="zan-pinglun">
				<view>
					<image src="../../static/zan.png" class="img"></image>
					<text>312</text>
				</view>
				<view>
					<image src="../../static/pinglun.png" class="img"></image>
					<text>1233</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-Parser/jyf-parser";
	// import commentBox from '@/components/uni-comment/uni-comment'
	// import commonList from '@/components/commonList/commonList'
	export default {
		components: {
			jyfParser,
			// commentBox
			// commonList
		},
		data() {
			return {
				tagStyle: {
					body: 'line-height: 1.8;',
					img: 'background-size: contain|cover;width:100%;height:auto;'
				},
				detail: {}
			};
		},
		onLoad(option) {
			// 請求到文章详情
			uni.request({
				url: '/api/cms/open/news_details', //仅为示例，并非真实接口地址。
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
				}
			});
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
			coloe: #333333;
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
		// height: 100%;
		padding: 32rpx;

		.commentBar {
			height: 70rpx;
			border: solid 1px;
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

			// height: 100%;
			.first-comment {
				margin: 32rpx 0;
				padding-bottom: 32rpx;
				border-bottom: 2rpx solid #EDEDED;

				.first-comment-top {
					display: flex;
					align-items: center;

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

						.more {
							font-size: 28rpx;
							font-weight: 400;
							margin-top: 16rpx;
							color: #1676FF;
						}
					}
				}
			}
		}

	}

	.publishCommentBox {
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
