<template>
	<!-- 热门咨询详情 -->
	<view>
		<view class="detail-box">
			<view class="title">{{detail.title}}</view>
			<view class="publish-time">发布时间：{{detail.createTime}}</view>
			<jyf-parser class="parser" :html="detail.content" :tag-style="tagStyle" lazy-load></jyf-parser>
			<view class="browse-num">浏览数：{{detail.browseNum}}</view>
		</view>
		<view class="comment-box"></view>
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-Parser/jyf-parser";
	export default {
		components: {
			jyfParser
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
					if (res.data.code != 0) {
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
		background-color: #fff;
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
	
	
</style>
