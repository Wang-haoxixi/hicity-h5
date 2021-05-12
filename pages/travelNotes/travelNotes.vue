<template>
	<view>
		<view class="" style="position: relative;">
			 <swiper @change="changeHeight" circular class="swiper" :style="{height :swiperHeight +'px' }">
				<swiper-item v-for="(item,index) of details.images" :key="index">
					<image :src="item.imageUrl" mode="" style="width: 100%;" :style="{height: item.height + 'px'}"></image>
				</swiper-item>
			</swiper>
			<view class="" style="position: absolute;bottom: 16rpx;left: 16rpx;z-index: 20;color: #FFFFFF;">
				6666
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
				swiperHeight:'',
				item_id:0
			};
		},
		onLoad(options) {
			this.id=options.id
			this.getDetails(this.id)
		},
		methods:{
			changeHeight(e){
				const indexId = e.detail.current
				this.swiperHeight = this.details.images[indexId].height
				// console.log(this.swiperHeight)
			},
			getDetails(id){
				uni.request({
					url: '/api/cms/travel/detail/' +id,
					success: (res) => {
						// console.log('圈子详情', res)
						if (res.data.code !== 0) {
							return uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
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
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
