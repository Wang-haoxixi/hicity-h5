<template>
	<view>
		<view class="" style="height:556rpx; background-image: url(../../static/pic_hotBgimg.png);background-size:100% 556rpx;">
			<view class="" style="padding:0rpx 32rpx; ">
				<view class="" style="color: #FFFFFF;font-size: 28rpx;line-height: 40rpx;font-weight: bold;letter-spacing: 2px;padding-top: 44rpx;margin-bottom: 12rpx;">
					{{details.title}}
				</view>
				<view class="" style="display: flex;align-items: center;margin-bottom: 24rpx;">
					<view class="" style="color: rgba(255,255,255,.7);font-size: 24rpx;line-height: 34rpx;letter-spacing: 2px;margin-right: 16rpx;">
						{{details.numberComments>10000?'10000+':details.numberComments}}人参与热议话题
					</view>
					<view class="" style="padding: 4rpx 12rpx; font-size: 20rpx;line-height: 28rpx;color: #1676FF;border: 2rpx solid #1676FF;border-radius: 4rpx;">
						官方
					</view>
				</view>
				<view class="" style="display: flex;align-items: center;justify-content: flex-start;margin-bottom: 56rpx;" @tap="goDownloadApp">
					<view class="" style="padding: 12rpx 24rpx;background-color: #1676FF;border-radius: 60rpx;color: #FFFFFF;font-size: 24rpx;line-height: 34rpx;">
						参与热议
					</view>
				</view>
			</view>
			<view class="" style="background-color:#FFFFFF;padding: 0rpx 32rpx;border-radius: 20rpx 20rpx 0px 0px;">
				<view class="" style="padding-top: 40rpx;padding-bottom: 32rpx;color: #333333;font-size: 28rpx;line-height: 56rpx;letter-spacing: 2px;">
					{{details.content}}
				</view>
				<swiper circular indicator-dots="true" indicator-color="rgba(0,0,0,.3)" indicator-active-color="#FFFFFF" interval="3000" class="swiper" style="height: 410rpx;margin-bottom: 32rpx;">
					<swiper-item v-for="(item,index) of details.images" :key="index">
						<image lazy-load="true" :src="item.imageUrl" mode="aspectFill" style="width: 100%;" @tap="previewImage(images,index)"></image>
					</swiper-item>
				</swiper>
				<view class="" style="display: flex;align-items: center;font-size: 24rpx;line-height: 34rpx;padding: 18rpx 20rpx;background-color: #F9F9F9;border-radius: 20rpx;">
					<image :src="details.avatar" mode="" style="width: 40rpx;height: 40rpx;border-radius: 50%;margin-right: 8rpx;"></image>
					<view class="" style="margin-right: 20rpx;color: #666666;">
						{{details.realName}}
					</view>
					<view class="" style="color:#999999;">
						{{details.createTime}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		previewImage
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				id:'',
				details:{},
				images:[]
			};
		},
		onLoad(options) {
			this.id = options.id,
			this.getDetails(this.id)
		},
		methods:{
			previewImage,
			getDetails(id){
				uni.request({
					url: '/api/cms/heated_debate/mobile/detail/',
					data:{
						heatedDebateId:id
					},
					success: (res) => {
						if (res.data.data.businessCode !== 1000) {
							return uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
							});
						}else{
							this.details = res.data.data.data
							this.images=this.details.images.map(item=>{
								return item.imageUrl
							})
						}
					}
				})
			},
			goDownloadApp(){
				uni.navigateTo({
					url:'../downloadApp/downloadApp?id=' + this.id + '&type=hotTalk'
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
</style>
