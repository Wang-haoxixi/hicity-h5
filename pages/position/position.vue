<template>
	<view>
		<view class="" style="padding:0rpx 32rpx;">
			<view class="" style="padding: 32rpx 0rpx;">
				<view class="" style="color: #000000;font-weight: bold;font-size: 36rpx;line-height: 50rpx;margin-bottom: 20rpx;">
					{{details.name}}
				</view>
				<view class="" style="color: #FF4603;font-weight: bolder;font-size: 36rpx;line-height: 50rpx;margin-bottom: 16rpx;">
					{{details.salaryLable}}
				</view>
				<view class="" style="display: flex;align-items: center;justify-content: flex-start">
					<view class="">
						{{details.city}}
					</view>
					<view class="" style="width: 2rpx;height: 22rpx;background-color: #EDEDED;margin: 0rpx 20rpx;">
						
					</view>
					<view class="">
						{{details.educationLable}}
					</view>
					<view class="" style="width: 2rpx;height: 22rpx;background-color: #EDEDED;margin: 0rpx 20rpx;">
						
					</view>
					<view class="">
						{{details.experienceLable}}
					</view>
					<view class="" style="width: 2rpx;height: 22rpx;background-color: #EDEDED;margin: 0rpx 20rpx;">
						
					</view>
				</view>
			</view>
			<view class="" style="width:100%;height: 2rpx;background: #EDEDED;opacity: 0.5;">		
			</view>
		</view>
		<view class="" style="position: relative;">
			<image src="../../static/positionBgimg.png" mode="aspectFit" style="width: 100%;height: 200rpx;"></image>
			<view class="" style="position: absolute;top: 62rpx;left: 62rpx;right: 50rpx;" @tap="goDownloadApp">
				<view class="" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="" style="display: flex;align-items: center;">
						<image :src="details.createByAvatar" mode="aspectFit" style="width: 76rpx;height: 76rpx;border-radius: 50%;margin-right: 16rpx;"></image>
						<view class="">
							<view class="" style="color: #333333;font-size: 24rpx;line-height: 34rpx;margin-bottom: 8rpx;">
								{{details.createByName}}
							</view>
							<view class="" style="color: #999999;font-size: 22rpx;line-height: 32rpx;">
								{{details.identity}}
							</view>
						</view>
					</view>
					<image src="../../static/icon-right.png" mode="" style="width: 44rpx;height: 44rpx;"></image>
				</view>
			</view>
		</view>
		<view class="" style="margin-top: 18rpx;padding:0rpx 32rpx;" :style="{marginBottom:bottomHeight + 'px'}">
			<view class="" style="margin-bottom: 32rpx;color: #333333;font-size: 32rpx;line-height: 44rpx;font-weight: bold;">
				职位详情
			</view>
			<view class="" style="margin-bottom: 22rpx;display: flex;align-items: center;justify-content: flex-start;flex-wrap: wrap;">
				<view class="" v-for="(item,index) of details.lableInfoList" :key="index" style="margin-right: 10rpx;margin-bottom: 10rpx; color: #666666;font-size: 22rpx;line-height: 32rpx;padding: 8rpx 16rpx;background-color: #F9F9F9;border-radius: 10rpx;">
					{{item.positionLable}}
				</view>
			</view>
			<view class="" style="color: #333333;font-size: 28rpx;line-height: 48rpx;">
				<text>
					{{details.describe}}
				</text>
			</view>
			<view class=""  style="margin-bottom: 32rpx;margin-top: 48rpx; color: #333333;font-size: 32rpx;line-height: 44rpx;font-weight: bold;">
				工作地点
			</view>
			<view class="" style="padding-bottom: 48rpx;border-radius: 10rpx;">
				<map v-if="covers[0].latitude!=''" style="width:100%; height: 376rpx;border-radius: 10rpx;" :latitude="details.latitude" :longitude="details.longitude" :markers="covers"></map>
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
				bottomHeight:'',
				 covers: [{
					latitude: '',
					longitude:'',
					iconPath: '../../static/icon_mapMarker.png',
					callout:{
						content:'',
						display:'ALWAYS',
						color:'#303031',
						fontSize:14,
						borderRadius:14,
						padding:5,
						textAlign:'center'
					}
				}]
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
					url: '/api/dms/open/recruit/detail/',
					data:{
						recruitPositionId:id
					},
					success: (res) => {
						if (res.data.code !== 0) {
							return uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
							});
						}else{
							this.details = res.data.data.data
							// console.log(this.details)
							this.covers[0].latitude = this.details.latitude
							this.covers[0].longitude = this.details.longitude
							this.covers[0].callout.content = this.details.detailsAddress
						}
					}
				})
			},
			goDownloadApp(){
				uni.navigateTo({
					url:'../downloadApp/downloadApp?id=' + this.id + '&type=position'
				})
			},
		}
	}
</script>

<style lang="scss">
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
