<template>
	<view>
		<view class="" style="padding: 32rpx;">
			<swiper circular indicator-dots="true" indicator-color="rgba(0,0,0,.3)" indicator-active-color="#FFFFFF" interval="3000" class="swiper" style="height: 410rpx;margin-bottom: 28rpx;">
				<swiper-item v-for="(item,index) of details.images" :key="index">
					<image lazy-load="true" :src="item.imageUrl" mode="scaleToFill" style="width: 100%;height: 100%;" @tap="previewImage(images,index)"></image>
				</swiper-item>
			</swiper>
			<view class="" style="margin-bottom: 26rpx;color: #000000;font-size: 36rpx;line-height: 50rpx;font-weight: bold;">
				{{details.name}}
			</view>
			<view class="" style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 40rpx;">
				<view class="" style="color: #FF4603;">
					<text style="font-size: 28rpx;line-height: 34rpx;font-weight: bold;">{{details.price}}</text>
					<text style="font-size: 24rpx;line-height: 34rpx;">城贝</text>
				</view>
				<view class="" style="color: #999999;font-size: 24rpx;line-height:34rpx;">
					<text>已兑换</text>
					<text style="color: #1676FF;font-weight: 500;">{{details.convertedQuantity}}</text>
					<text>份</text>
				</view>
			</view>
			<view class="" style="margin-bottom: 32rpx;color: #333333;font-weight: bold;font-size: 32rpx;line-height: 44rpx;">
				简介
			</view>
			<view class="" style="color:#333333;font-size: 28rpx;line-height: 48rpx;" :style="{marginBottom:bottomHeight + 'px'}">
				<text class="">
					{{details.introduction}}
				</text>
			</view>
		</view>
		<view class="publishCommentBox" id="bottomHeight" style="width: 100%;padding: 16rpx 32rpx;">
			<view class=""  @tap="goDownloadApp" style="color: #FFFFFF;background-color: #1676FF;border-radius: 50rpx;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 28rpx;line-height: 40rpx;font-weight: bold;">
				下载
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				details:{},
				images:[],
				bottomHeight:''
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
				});
			})
		},
		methods:{
			getDetails(id){
				uni.request({
					url: '/api/fms/cowry_goods/mobile/detail/' +id,
					success: (res) => {
						if (res.data.code !== 0) {
							return uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
							});
						}else{
							this.details = res.data.data.data
							console.log(this.details)
							this.images=this.details.images.map(item=>{
								return item.imageUrl
							})
						}
					}
				})
			},
			goDownloadApp(){
				uni.navigateTo({
					url:'../downloadApp/downloadApp?id=' + this.id + '&type=productDetails'
				})
			},
		}
	}
</script>

<style lang="scss">
::v-deep .uni-swiper-dot-active{
	width: 36rpx !important;
	border-radius: 10rpx;
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
	}
</style>
