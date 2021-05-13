<template>
	<view>
		<view class="" style="padding: 22rpx 32rpx;">
			<image :src="details.poster" mode="" style="width: 100%;height: 412rpx;border-radius: 16rpx;margin-bottom: 32rpx;"></image>
			<view class="" style="color: #272727;font-size: 36rpx;line-height: 52rpx;font-weight: bold;margin-bottom: 16rpx;">
				{{details.name}}
			</view>
			<view class="" style="color: #999999;font-size: 24rpx;line-height: 34rpx;margin-bottom: 32rpx;">
				阅读
				<text style="padding-left: 8rpx;">{{details.browseNum}}</text>
			</view>
			<view class="" style="color: #5F5F5F;font-size: 26rpx;line-height: 40rpx;">
				<view class="" style="margin-bottom: 16rpx;display: flex;align-items: center;">
					<image src="../../static/icon_time.png" mode="" style="width: 32rpx;height: 32rpx;margin-right: 12rpx;"></image>
					<view class="">
						{{details.startTime}}~{{details.endTime}}
					</view>
				</view>
				<view class="" style="margin-bottom: 32rpx;display: flex;align-items: center;">
					<image src="../../static/icon_location_black.png" mode="" style="width: 32rpx;height: 32rpx;margin-right: 12rpx;"></image>
					<view class="">
						{{details.city}}{{details.field}}
					</view>
				</view>
			</view>
			<view class="" style="margin-bottom: 64rpx;display: flex;align-items: center;justify-content: flex-start;flex-wrap: wrap;">
				<view class="" v-for="(item,index) of details.label" :key="index" style="margin-right: 16rpx;margin-bottom: 16rpx; color: #5F5F5F;font-size: 22rpx;line-height: 32rpx;padding: 8rpx 16rpx;background-color: #F5F7F8;border-radius: 6rpx;">
					{{item}}
				</view>
			</view>
			<view class="" style="color: #272727;font-size: 32rpx;line-height: 44rpx;font-weight: bold;margin-bottom: 32rpx;">
				活动内容
			</view>
			<jyf-parser class="parser" :html="details.details" :tag-style="tagStyle" lazy-load :style="{marginBottom:bottomHeight + 'px'}"></jyf-parser>
		</view>
		<view class="publishCommentBox" id="bottomHeight" style="width: 100%;padding: 16rpx 32rpx;">
			<view class=""  @tap="goDownloadApp" style="color: #FFFFFF;background-color: #1676FF;border-radius: 50rpx;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 28rpx;line-height: 40rpx;font-weight: bold;">
				立即报名
			</view>
		</view>
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-Parser/jyf-parser";
	export default {
		components: {
			jyfParser,
		},
		data() {
			return {
				id:'',
				details:{},
				tagStyle: {
					body: 'line-height: 1.8;',
					img: 'background-size: contain|cover;width:100%;height:auto;'
				},
				bottomHeight:''
			};
		},
		onLoad(options) {
			this.id =options.id
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
					url: '/api/dms/open/activity_publish/details_activity/',
					data:{
						id:id
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
							this.details.startTime=this.details.startTime.replace(/-/g, ".").substring(5,16)
							this.details.endTime = this.details.endTime.replace(/-/g, ".").substring(5,16)
						}
					}
				})
			},
			goDownloadApp(){
				uni.navigateTo({
					url:'../downloadApp/downloadApp?id=' + this.id + '&type=activityDetails'
				})
			},
		}
	}
</script>

<style lang="scss">
.publishCommentBox {
	background: #FFFFFF;
	height: 116rpx;
	width: 100%;
	box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.24);
	position: fixed;
	bottom: 0;
	left: 0;
	display: flex;
	}
</style>
