<template>
	<view class="error404">
		<view class="errorImg">
			<image :src="$ossUrl('h5_bg_404.png')" mode="widthFix"></image>
		</view>
		<view style="color: #919397;font-size: 24rpx;margin-top: 20rpx;">您访问的资源不见了</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.error404 {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.errorImg {
			image{
				width: 600rpx;
			}
		}
	}
</style>
