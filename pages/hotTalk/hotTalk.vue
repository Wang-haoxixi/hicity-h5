<template>
	<view>
		<view class=""
			style="height:556rpx; background-image: url(../../static/pic_hotBgimg.png);background-size:100% 556rpx;">
			<view class="" style="padding:0rpx 32rpx; ">
				<view class=""
					style="color: #FFFFFF;font-size: 28rpx;line-height: 40rpx;font-weight: bold;letter-spacing: 2px;padding-top: 44rpx;margin-bottom: 12rpx;">
					{{details.title}}
				</view>
				<view class="" style="display: flex;align-items: center;margin-bottom: 24rpx;">
					<view class=""
						style="color: rgba(255,255,255,.7);font-size: 24rpx;line-height: 34rpx;letter-spacing: 2px;margin-right: 16rpx;">
						{{details.numberComments>10000?'10000+':details.numberComments}}人参与热议话题
					</view>
					<view class=""
						style="padding: 4rpx 12rpx; font-size: 20rpx;line-height: 28rpx;color: #1676FF;border: 2rpx solid #1676FF;border-radius: 4rpx;">
						官方
					</view>
				</view>
				<view class=""
					style="display: flex;align-items: center;justify-content: flex-start;margin-bottom: 56rpx;"
					@tap="goDownloadApp">
					<view class=""
						style="padding: 12rpx 24rpx;background-color: #1676FF;border-radius: 60rpx;color: #FFFFFF;font-size: 24rpx;line-height: 34rpx;">
						参与热议
					</view>
				</view>
			</view>
			<view class="" style="background-color:#FFFFFF;padding: 0rpx 32rpx;border-radius: 20rpx 20rpx 0px 0px;">
				<view class="" style="padding-top: 40rpx;padding-bottom: 32rpx;">
					<text class=""
						style="color: #333333;font-size: 28rpx;line-height: 56rpx;letter-spacing: 2px;">
						{{details.content}}
					</text>
				</view>
				<swiper circular indicator-dots="true" indicator-color="rgba(0,0,0,.3)" indicator-active-color="#FFFFFF"
					interval="3000" class="swiper" style="height: 410rpx;margin-bottom: 32rpx;" v-if="details.images && details.images.length>0">
					<swiper-item v-for="(item,index) of details.images" :key="index">
						<image lazy-load="true" :src="item.imageUrl" mode="aspectFill" style="width: 100%;"
							@tap="previewImage(images,index)"></image>
					</swiper-item>
				</swiper>
				<view class=""
					style="display: flex;align-items: center;font-size: 24rpx;line-height: 34rpx;padding: 18rpx 20rpx;background-color: #F9F9F9;border-radius: 20rpx;margin-bottom: 16rpx;">
					<image :src="details.avatar" mode=""
						style="width: 40rpx;height: 40rpx;border-radius: 50%;margin-right: 8rpx;"></image>
					<view class="" style="margin-right: 20rpx;color: #666666;">
						{{details.realName}}
					</view>
					<view class="" style="color:#999999;">
						{{details.createTime}}
					</view>
				</view>
				<view class="" style="display: flex;align-items: center;">
					<view class="" @tap="changeNew"
						style="width: 120rpx;height: 108rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-between;">
						<view style="font-size:32rpx;line-height: 44rpx;margin-bottom: 26rpx;margin-top: 32rpx;"
							:class="item_id==0?'active':'unActive'">
							最新
						</view>
						<view class="" style="width: 20rpx;height: 6rpx;background-color: #1676FF;border-radius: 10rpx;"
							v-show="item_id==0">

						</view>
					</view>
					<view class="" @tap="changeHot"
						style="width: 120rpx;height: 108rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-between;">
						<view style="font-size:32rpx;line-height: 44rpx;margin-bottom: 26rpx;margin-top: 32rpx;"
							:class="item_id==1?'active':'unActive'">
							最热
						</view>
						<view class="" style="width: 20rpx;height: 6rpx;background-color: #1676FF;border-radius: 10rpx;"
							v-show="item_id==1">

						</view>
					</view>
				</view>
			</view>
			<view class="swiper-item" v-show="item_id==0" style="background-color: #FFFFFF;">
				<view class="" v-if="newList.records.length>0">
					<view class="" v-for="(item,index) of newList.records" :key="index"
						style="padding: 32rpx 0rpx; border-bottom: 2rpx solid #EDEDED;">
						<view class="">
							<view class=""
								style="display: flex;align-items: center;justify-content: space-between;padding:0rpx 32rpx;">
								<view class="" style="display: flex;align-items: center;flex: 1;">
									<image :src="item.createByAvatar" mode=""
										style="width: 76rpx;height: 76rpx;border-radius: 50%;margin-right: 20rpx;"></image>
									<view class="" style="flex: 1;">
										<view class=""
											style="color: #333333;font-size: 28rpx;line-height: 40rpx;font-weight: bold;margin-bottom: 2rpx;">
											{{item.createByName}}
										</view>
										<view class="" style="color: #999999;font-size: 24rpx;line-height: 34rpx;">
											{{item.createTime}}
										</view>
									</view>
								</view>
								<view class=""
									@tap="goDownloadApp"
									style="width: 100rpx;height: 48rpx;border:2rpx solid #EDEDED;border-radius: 40rpx;display: flex;align-items: center;justify-content: center;">
									<image src="../../static/icon-big-praise.png" mode=""
										style="width: 28rpx;height: 28rpx;"></image>
									<view class=""
										style="color: #999999;font-size: 22rpx;line-height: 32rpx;margin-left: 6rpx;">
										{{item.thumbNum}}
									</view>
								</view>
							</view>
							<view class="" style="margin-top: 20rpx;">
								<view class=""
									style="padding:0rpx 32rpx;color: #333333;font-size: 28rpx;line-height: 48rpx;word-break: break-word;">
									{{item.content}}
								</view>
								<view class="" style="">
									<view class="" style="display: flex;align-items: center;flex-wrap: wrap;justify-content: flex-start;margin-top: 20rpx;margin-left: 27rpx;">
										<view class="" style="width: 232rpx;height: 232rpx;display: flex;align-items: center;justify-content: center;" v-if="item.annexesUrls && item.annexesUrls.length>0"
											v-for="(item3,index3) of item.annexesUrls" :key="index3">
											<image :src="item3" mode=""
												style="width: 222rpx;height: 222rpx;border-radius: 10rpx;" @tap="previewImage(item.annexesUrls,index)"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="" style="padding: 0rpx 32rpx;">
							<view class="" style="display:flex;align-items: flex-start;margin-top: 20rpx;" v-if="item.replyVO && item.replyVO.records.length>0" v-for="(item2,index2) of item.replyVO.records" :key="index2">
								<image :src="item2.createAvatar" mode="" style="width: 48rpx;height: 48rpx;border-radius: 50%;margin-right: 16rpx;"></image>
								<view class="" style="flex: 1;">
									<view class="" style="color: #333333;font-size: 28rpx;line-height: 40rpx;font-weight: bold;margin-bottom: 18rpx;">
										{{item2.createByName}}
									</view>
									<view v-if="item2.topCommentId != item2.rankingCommentId" class="" style="word-break: break-word;color: #333333;font-size: 28rpx;line-height: 48rpx;margin-bottom: 8rpx;">
										回复{{item2.replyName}}:{{item2.content}}
									</view>
									<view class="" v-else style="color: #333333;font-size: 28rpx;line-height: 48rpx;margin-bottom: 8rpx;word-break: break-word;">
										{{item2.content}}
									</view>
									<view class="" style="color: #999999;font-size: 24rpx;line-height: 34rpx;">
										{{item2.createTime}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="noContent" style="display: flex;flex-direction: column; align-items: center;">
					<image src="../../static/pic-no-comments.png" style="width:280rpx;height: 180rpx;margin-bottom: 48rpx;"></image>
					<view style="color: #999999;font-size: 28rpx;line-height: 40rpx;">
						暂无评论
					</view>
				</view>
				<view class="load-more">
					 <uni-load-more :contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: '没有更多了'}" :iconSize='18' v-if="newList.records.length>0" :status="newStatus">
					 </uni-load-more>
				</view>
			</view>
			<view class="swiper-item" v-show="item_id==1" style="background-color: #FFFFFF;">
				<view class=""  v-if="hotList.records.length>0">
					<view class="" v-for="(item,index) of hotList.records" :key="index"
						style="padding: 32rpx 0rpx; border-bottom: 2rpx solid #EDEDED;">
						<view class="">
							<view class=""
								style="display: flex;align-items: center;justify-content: space-between;padding:0rpx 32rpx;">
								<view class="" style="display: flex;align-items: center;flex: 1;">
									<image :src="item.createByAvatar" mode=""
										style="width: 76rpx;height: 76rpx;border-radius: 50%;margin-right: 20rpx;"></image>
									<view class="" style="flex: 1;">
										<view class=""
											style="color: #333333;font-size: 28rpx;line-height: 40rpx;font-weight: bold;margin-bottom: 2rpx;">
											{{item.createByName}}
										</view>
										<view class="" style="color: #999999;font-size: 24rpx;line-height: 34rpx;">
											{{item.createTime}}
										</view>
									</view>
								</view>
								<view class=""
									@tap="goDownloadApp"
									style="width: 100rpx;height: 48rpx;border:2rpx solid #EDEDED;border-radius: 40rpx;display: flex;align-items: center;justify-content: center;">
									<image src="../../static/icon-big-praise.png" mode=""
										style="width: 28rpx;height: 28rpx;"></image>
									<view class=""
										style="color: #999999;font-size: 22rpx;line-height: 32rpx;margin-left: 6rpx;">
										{{item.thumbNum}}
									</view>
								</view>
							</view>
							<view class="" style="margin-top: 20rpx;">
								<view class=""
									style="padding:0rpx 32rpx;color: #333333;font-size: 28rpx;line-height: 48rpx;word-break: break-word;">
									{{item.content}}
								</view>
								<view class="" style="">
									<view class="" style="display: flex;align-items: center;flex-wrap: wrap;justify-content: flex-start;margin-top: 20rpx;margin-left: 27rpx;">
										<view class="" style="width: 232rpx;height: 232rpx;display: flex;align-items: center;justify-content: center;" v-if="item.annexesUrls && item.annexesUrls.length>0"
											v-for="(item3,index3) of item.annexesUrls" :key="index3">
											<image :src="item3" mode=""
												style="width: 222rpx;height: 222rpx;border-radius: 10rpx;" @tap="previewImage(item.annexesUrls,index)"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="" style="padding: 0rpx 32rpx;">
							<view class="" style="display:flex;align-items: flex-start;margin-top: 20rpx;" v-if="item.replyVO && item.replyVO.records.length>0" v-for="(item2,index2) of item.replyVO.records" :key="index2">
								<image :src="item2.createAvatar" mode="" style="width: 48rpx;height: 48rpx;border-radius: 50%;margin-right: 16rpx;"></image>
								<view class="" style="flex: 1;">
									<view class="" style="color: #333333;font-size: 28rpx;line-height: 40rpx;font-weight: bold;margin-bottom: 18rpx;">
										{{item2.createByName}}
									</view>
									<view v-if="item2.topCommentId != item2.rankingCommentId" class="" style="word-break: break-word;color: #333333;font-size: 28rpx;line-height: 48rpx;margin-bottom: 8rpx;">
										回复{{item2.replyName}}:{{item2.content}}
									</view>
									<view class="" v-else style="color: #333333;font-size: 28rpx;line-height: 48rpx;margin-bottom: 8rpx;word-break: break-word;">
										{{item2.content}}
									</view>
									<view class="" style="color: #999999;font-size: 24rpx;line-height: 34rpx;">
										{{item2.createTime}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="noContent" style="display: flex;flex-direction: column; align-items: center;">
					<image src="../../static/pic-no-comments.png" style="width:280rpx;height: 180rpx;margin-bottom: 48rpx;"></image>
					<view style="color: #999999;font-size: 28rpx;line-height: 40rpx;">
						暂无评论
					</view>
				</view>
				<view class="">
					 <uni-load-more :contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: '没有更多了'}" :iconSize='18' v-if="hotList.records.length>0" :status="hotStatus">
					 </uni-load-more>
				</view>
			</view>
		</view>
		<!-- <view class="publishCommentBox" id="bottomHeight" style="width: 100%;padding: 16rpx 32rpx;">
			<view class=""  @tap="goDownloadApp" style="color: #FFFFFF;background-color: #1676FF;border-radius: 50rpx;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 28rpx;line-height: 40rpx;font-weight: bold;">
				打开APP
			</view>
		</view> -->
		<image src="../../static/openApp.png" mode="" class="openImg" @tap="goDownloadApp"></image>
	</view>
</template>

<script>
	import {
		previewImage
	} from '@/common/utils.js'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				id: '',
				details: {},
				images: [],
				item_id:0,
				//非第一页分页必传数据，由上一页数据返回
				maxId: '',
				newList: {
					records: []
				},
				newStatus:'more',
				hotList: {
					records: []
				},
				hotStatus:'more',
				bottomHeight:''
			};
		},
		onLoad(options) {
			this.id = options.id
			this.getDetails(this.id)
			this.getNewList()
			// this.$nextTick(function(){
			// 	uni.createSelectorQuery()
			// 		.in(this)
			// 		.select('#bottomHeight')
			// 		.boundingClientRect()
			// 		.exec(ret => {
			// 			this.bottomHeight =  ret[0].height
			// 	});
			// })
		},
		onReachBottom() {
			if(this.item_id==0){
				if (this.newList.current < this.newList.pages) {
					this.newStatus = 'loading'
					uni.request({
						url: '/api/cms/common_comment/page',
						data: {
							dataId: this.id, //数据ID
							current: this.newList.current += 1, //当前页
							type: 4,
							maxId: this.maxId
						},
						success: (res) => {
							if (res.data.data.businessCode !== 1000) {
								return uni.showToast({
									title: '获取评论列表失败',
									duration: 1500,
									icon: "none",
								});
							}
							this.newList.current = res.data.data.data.current
							if (this.newList.current < this.newList.pages) {
								this.newStatus = 'more'
							} else {
								this.newStatus = 'noMore'
							}
							this.newList.records = this.newList.records.concat(res.data.data.data.records)
						}
					})
				}else{
					this.newStatus = 'noMore'
				}
			}else if (this.item_id==1){
				if (this.hotList.current < this.hotList.pages) {
					this.hotStatus = 'loading'
					uni.request({
						url: '/api/cms/common_comment/page',
						data: {
							dataId: this.id, //数据ID
							current: this.hotList.current += 1, //当前页
							type: 4,
							maxId: this.maxId
						},
						success: (res) => {
							if (res.data.data.businessCode !== 1000) {
								return uni.showToast({
									title: '获取评论列表失败',
									duration: 1500,
									icon: "none",
								});
							}
							this.hotList.current = res.data.data.data.current
							if (this.hotList.current < this.hotList.pages) {
								this.hotStatus = 'more'
							} else {
								this.hotStatus = 'noMore'
							}
							this.hotList.records = this.hotList.records.concat(res.data.data.data.records)
						}
					})
				}else{
					this.hotStatus = 'noMore'
				}
			}
		},
		methods: {
			previewImage,
			getDetails(id) {
				uni.request({
					url: '/api/cms/heated_debate/mobile/detail/',
					data: {
						heatedDebateId: id
					},
					success: (res) => {
						if (res.data.data.businessCode !== 1000) {
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
						} else {
							this.details = res.data.data.data
							this.images = this.details.images.map(item => {
								return item.imageUrl
							})
						}
					}
				})
			},
			swiperChange(e) {
				if (e.detail.current == 0) {
					this.getNewList()
				} else if (e.detail.current == 1) {
					this.getHotList()
				}
			},
			changeNew() {
				this.getNewList()
			},
			changeHot() {
				this.getHotList()
			},
			getNewList() {
				this.item_id = 0
				uni.request({
					url: '/api/cms/common_comment/page/',
					data: {
						dataId: this.id,
						type: 4,
						maxId: this.maxId
					},
					success: (res) => {
						if (res.data.data.businessCode !== 1000) {
							uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
							});
						} else {
							this.newList = res.data.data.data,
							this.maxId = this.newList.maxId
						}
					}
				})
			},
			getHotList() {
				this.item_id = 1
				uni.request({
					url: '/api/cms/common_comment/page/',
					data: {
						dataId: this.id,
						type: 4,
						sortType: 1,
						maxId: this.maxId
					},
					success: (res) => {
						if (res.data.data.businessCode !== 1000) {
							uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
							});
						} else {
							this.hotList = res.data.data.data
							this.maxId = this.hotList.maxId
						}
					}
				})
			},
			goDownloadApp() {
				uni.navigateTo({
					url: '../downloadApp/downloadApp?id=' + this.id + '&type=hotTalk'
				})
			},
		}
	}
</script>

<style lang="scss">
	.openImg{
		width: 148rpx;
		height: 148rpx;
		position: fixed;
		right: 14rpx;
		bottom: 128rpx;
	}
	::v-deep .uni-swiper-dot-active {
		width: 36rpx !important;
		border-radius: 10rpx;
	}

	.active {
		color: #1676FF;
		font-weight: bold;
	}

	.unActive {
		color: #666666;
		font-weight: normal;
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
