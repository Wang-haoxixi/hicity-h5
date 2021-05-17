<template>
	<view>
		<view class="" style="position: relative;">
			 <swiper @change="changeHeight" circular class="swiper" :style="{height :swiperHeight +'px' }">
				<swiper-item v-for="(item,index) of details.images" :key="index">
					<image lazy-load="true" :src="item.imageUrl" mode="" style="width: 100%;" :style="{height: item.height + 'px'}" @tap="previewImage(images,index)"></image>
				</swiper-item>
			</swiper>
			<view v-if="details.location" class="" style="position: absolute;bottom: 16rpx;left: 32rpx;right: 32rpx; z-index: 20;color: #FFFFFF;display:flex;align-items: center;justify-content: space-between;">
				<view class="" v-if="details.location" style="display:flex;align-items: center;padding: 6rpx 24rpx; background: rgba(39, 39, 39, .4);border-radius: 34rpx;">
					<image src="../../static/icon-location.png" mode="" style="width: 28rpx;height: 28rpx;margin-right: 8rpx;"></image>
					<view class="singleEllipsis" style="font-size: 24rpx;line-height: 34rpx;max-width:464rpx;">
						{{details.location}}
					</view>
				</view>
				<view class="" style="background: rgba(0, 0, 0, .4);border-radius: 20rpx;padding: 6rpx 20rpx;">
					{{item_id}}/{{details.images.length}}
				</view>
			</view>
			<view v-else class="" style="position: absolute;bottom: 16rpx;left: 32rpx;right: 32rpx; z-index: 20;color: #FFFFFF;display:flex;align-items: center;justify-content: flex-end;">
				<view class="" style="background: rgba(0, 0, 0, .4);border-radius: 20rpx;padding: 6rpx 20rpx;">
					{{item_id}}/{{details.images.length}}
				</view>
			</view>
		</view>
		<view class="" style="padding:20rpx 32rpx;" :style="{marginBottom:bottomHeight + 'px'}">
			<view class="" style="display: flex;align-items: center;justify-content: space-between;">
				<view class="" style="display: flex;align-items: center;">
					<image :src="details.avatar" mode="" style="width: 72rpx;height: 72rpx;border-radius: 50%;margin-right: 16rpx;"></image>
					<view class="">
						<view class="" style="font-size: 28rpx;line-height: 48rpx;font-weight: bold;color: #272727;">
							{{details.realName}}
						</view>
						<view class="" style="font-size: 24rpx;line-height: 40rpx;color: #999999;">
							{{details.createTime}}
						</view>
					</view>
				</view>
				<image src="../../static/btn-attention.png" mode="" style="width: 132rpx;height: 56rpx;" @tap="goDownloadApp"></image>
			</view>
			<view class="" style="display: flex;align-items: center;justify-content: flex-start">
				<view class="" v-if="details.topicsBankList && details.topicsBankList.length>0" style="color: #2B579F;display: flex;align-items: center; margin-top: 40rpx;padding: 10rpx 36rpx 10rpx 24rpx;background-color: #F5F7F8; border-radius: 30rpx;">
					<image src="../../static/icon_jinghao_black.png" mode="" style="width: 28rpx;height: 28rpx;margin-right: 8rpx;"></image>
					<view class="">
						{{details.topicsBankList[0].topicsName}}
					</view>
				</view>
			</view>
			<view class="" style="margin-top: 32rpx;">
				<view class="" style="margin-bottom: 32rpx;color: #272727;font-size: 36rpx;line-height: 50rpx;font-weight: bold;">
					{{details.travelName}}
				</view>
				<text style="color: #5F5F5F;font-size: 28rpx;line-height: 48rpx;">
					{{details.content}}
				</text>
			</view>
		</view>
		<!-- 底部发布评论部分 -->
		<view class="bottom safe-bottom" id="bottomHeight" @tap="goDownloadApp">
			<view class="bottom-view">
				<view class="inpBox">
					<input class="uni-input" disabled="true" placeholder="说点什么吧~" placeholder-style="color:#999999;font-size:24rpx;line-height:56rpx"/>
				</view>
				<view class="zan-pinglun">
					<view>
						<image src='../../static/icon-big-praise.png' class="img"></image>
						<text>{{isEmpty(details.likeNumInt)? '0' : details.likeNumInt}}</text>
					</view>
					<view>
						<image src="../../static/pinglun.png" class="img"></image>
						<text>{{isEmpty(details.numberComments)? '0' : details.numberComments}}</text>
					</view>
				</view>
			</view>
		</view>
		<image src="../../static/openApp.png" mode="" class="openImg" :style="{bottom:bottomHeight+'px'}" @tap="goDownloadApp"></image>
	</view>
</template>

<script>
	import {
		isEmpty,
		previewImage
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				id:'',
				details:{
					images:[]
				},
				swiperHeight:'',
				item_id:1,
				bottomHeight:'',
				images:[]
			};
		},
		onLoad(options) {
			this.id=options.id
			this.getDetails(this.id)
			this.$nextTick(function(){
				uni.createSelectorQuery()
					.in(this)
					.select('#bottomHeight')
					.boundingClientRect()
					.exec(ret => {
						this.bottomHeight =  ret[0].height
						console.log(this.bottomHeight)
				});
			})
		},
		methods:{
			isEmpty,
			previewImage,
			goDownloadApp(){
				uni.navigateTo({
					url:'../downloadApp/downloadApp?id=' + this.id + '&type=travelNotes'
				})
			},
			changeHeight(e){
				// console.log(e.detail.current)
				const indexId = e.detail.current
				this.swiperHeight = this.details.images[indexId].height
				// console.log(this.swiperHeight)
				this.item_id = ++e.detail.current;
			},
			getDetails(id){
				uni.request({
					url: '/api/cms/travel/detail/' +id,
					success: (res) => {
						// console.log('圈子详情', res)
						if (res.data.data.businessCode!==1000) {
							return uni.showToast({
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
							const { windowWidth} = uni.getSystemInfoSync();
							this.details.images.forEach(item=>{
								item.height =  item.height/item.width * windowWidth
								if(item.height>500){
									item.height=500
								}
							})
							// console.log(this.details)
							this.swiperHeight = this.details.images[0].height
							this.images = this.details.images.map(item=>{
								return item.imageUrl
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.openImg{
		width: 148rpx;
		height: 148rpx;
		position: fixed;
		right: 14rpx;
	}
.singleEllipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.safe-bottom {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	
		/* #endif */
	}
	.bottom {
		width: 100%;
		box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.24);
		position: fixed;
		bottom: 0;
		left: 0;
		.bottom-view{
			padding: 24rpx;
			display: flex;
		}
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
