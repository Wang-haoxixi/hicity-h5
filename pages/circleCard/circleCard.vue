<template>
	<view class="circleCard">
		<view class="bgBox">
			<image :src="circleDetatil.bgImg" class="bgImg"></image>
		</view>

		<!-- 中间内容 -->
		<view class="container">
			<!-- 头像区域 -->
			<view class="avatarSection">
				<view class="avatarImgBox">
					<image :src="circleDetatil.avatar" class="avatarImg"></image>
					<image src="../../static/icon-authentication.png" class="authenticationImg"></image>
				</view>
			</view>
			<!-- 标题 -->
			<view class="title">
				{{ isEmpty(circleDetatil.name) ? '' : circleDetatil.name}}
			</view>
			<!-- 成员关注所在地 -->
			<view class="cardInfo">
				<view class="cardInfo-left">
					<view class="cardInfo-left-member">
						<text class="num">{{ isEmpty(circleDetatil.memberNum) ? 0 : circleDetatil.memberNum }}</text><text class="text">成员</text>
					</view>
					<view class="cardInfo-left-line"></view>
					<view class="cardInfo-left-attention">
						<text class="num">{{ isEmpty(circleDetatil.followNum) ? 0 : circleDetatil.followNum }}</text><text class="text">关注</text>
					</view>
				</view>
				<view class="cardInfo-right">
					<image src="../../static/icon-location.png"></image>
					<text>{{ isEmpty(circleDetatil.address) ? '暂无所在地' : circleDetatil.address }}</text>
				</view>
			</view>
			<!-- 阴影盒 -->
			<view class="boxShadow">
				{{ isEmpty(circleDetatil.slogan) ? '群主很懒，什么都没写！' : circleDetatil.slogan }}
			</view>

			<!-- 介绍 -->
			<view class="list-item">
				<view class="list-item-left">
					<image src="../../static/icon-introduce.png"></image>
					介绍
				</view>
				<view class="list-item-right" @tap='allTap'>
					全部
					<image src="../../static/icon-arrowright.png"></image>
				</view>
			</view>
			<view class="introduce" v-if="!isEmpty(circleDetatil.introduction)">
				{{circleDetatil.introduction}}
			</view>
			<view class="noContent" v-else>
				<image src="../../static/pic-default-result.png"></image>
				<view>
					暂无内容
				</view>
			</view>
			<!-- 成员 -->
			<view class="list-item">
				<view class="list-item-left">
					<image src="../../static/icon-member.png"></image>
					成员
				</view>
				<view class="list-item-right" @tap='memberTap'>
					共{{ isEmpty(circleDetatil.memberNum) ? 0 : circleDetatil.memberNum }}人
					<image src="../../static/icon-arrowright.png"></image>
				</view>
			</view>

			<div class="member-list">
				<div class="member-list-item" v-for="(memberItem,i) in circleDetatil.userList" v-if="i<5" :key='i'>
					<image :src="memberItem.avatar"></image>
					<text>{{ isEmpty(memberItem.realName) ? '' : memberItem.realName }}</text>
				</div>

			</div>
		</view>

		<!-- 分享进群 -->
		<view class="bottomBox">
			<button type="default" size="mini" hover-class="share">分享</button>
			<button type="primary" size="mini">进入群聊</button>
		</view>
	</view>
</template>

<script>
	import {
		isEmpty
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				circleId: null, //圈子ID
				circleDetatil: {}, //圈子详情
			};
		},
		onLoad(opt) {
			this.circleId = opt.id
			this.getCircleDetatil(this.circleId)
		},
		methods: {
			isEmpty,
			// 获取圈子详情
			getCircleDetatil(id) {
				uni.request({
					url: '/api/admin/open/circle/detatil',
					data: {
						circleId: id
					},
					success: (res) => {
						console.log('圈子详情', res)
						if (res.data.code !== 0) {
							return uni.showToast({
								title: '获取圈子详情失败',
								duration: 1500,
								icon: "none",
							});
						}
						this.circleDetatil = res.data.data.data
					}
				})
			},
			// 全部
			allTap() {
				console.log('全部')
			},
			// 查看成员
			memberTap() {
				console.log('成员')
			}
		}
	}
</script>

<style lang="less">
	.circleCard {
		.bgBox {
			height: 408rpx;

			.bgImg {
				width: 100%;
				height: 100%;
			}
		}

		.container {
			padding: 0 32rpx 112rpx;

			.avatarSection {
				margin-top: -56rpx;

				.avatarImgBox {
					width: 112rpx;
					height: 112rpx;
					position: relative;

					.avatarImg {
						border-radius: 20rpx;
						width: 100%;
						height: 100%;
					}

					.authenticationImg {
						width: 24rpx;
						height: 24rpx;
						position: absolute;
						right: 0;
						bottom: 0;
					}
				}
			}

			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				line-height: 70rpx;
			}

			.cardInfo {
				display: flex;

				.cardInfo-left {
					flex: 1;
					display: flex;
					align-items: center;

					.num {
						font-size: 28rpx;
						font-weight: 500;
						color: #333333;
						margin-right: 8rpx;
					}

					.text {
						font-size: 24rpx;
						font-weight: 400;
						color: #666666;
					}

					.cardInfo-left-member {}

					.cardInfo-left-line {
						height: 20rpx;
						border-left: 1rpx solid #EDEDED;
						margin: 0 24rpx;
					}

					.cardInfo-left-attention {}
				}

				.cardInfo-right {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: flex-end;

					image {
						width: 34rpx;
						height: 34rpx;
					}

					text {
						font-size: 24rpx;
						font-weight: 400;
						color: #999999;
					}
				}
			}

			.boxShadow {
				box-shadow: 0px 0px 4rpx 0px #cccccc;
				padding: 24rpx 40rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #666666;
				margin: 40rpx 0;
			}

			.list-item {
				padding: 32rpx 0rpx;
				display: flex;
				justify-content: space-between;

				.list-item-left {
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					display: flex;
					align-items: center;

					image {
						width: 32rpx;
						height: 32rpx;
						margin-right: 16rpx;
					}
				}

				.list-item-right {
					font-size: 28rpx;
					font-weight: 400;
					color: #666666;
					display: flex;
					align-items: center;

					image {
						width: 16rpx;
						height: 44rpx;
						margin-left: 16rpx;
					}
				}
			}

			.introduce {
				font-size: 28rpx;
				font-weight: 400;
				color: #666666;
				line-height: 56rpx;
			}

			.noContent {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				image {
					width: 280rpx;
					height: 180rpx;
				}

				view {
					font-size: 28rpx;
					font-weight: 400;
					color: #B3B3B3;
					margin: 46rpx 0 32rpx 0;
				}
			}

			.member-list {
				display: grid;
				grid-template-columns: repeat(5, 1fr);
				height: auto;
				width: auto;
				grid-gap: 28rpx;
				margin: auto;

				.member-list-item {
					width: 92rpx;
					display: flex;
					flex-direction: column;
					align-items: center;

					image {
						width: 92rpx;
						height: 92rpx;
						border-radius: 50%;
						margin-bottom: 10rpx;
					}

					text {
						width: 92rpx;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}

				}
			}

		}

		.bottomBox {
			background-color: #FFFFFF;
			width: 100%;
			position: fixed;
			bottom: 0;
			height: 112rpx;
			box-shadow: 0rpx 6rpx 12rpx rgba(0, 0, 0, 0.16);
			display: flex;
			justify-content: space-between;
			align-items: center;

			.share {
				background-color: #eeeeee !important;
			}

			uni-button:first-child {
				border: 2rpx solid #1676FF;
				background-color: #FFFFFF;
				color: #1676FF;
			}

			uni-button {
				width: 320rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
			}
		}
	}
</style>
