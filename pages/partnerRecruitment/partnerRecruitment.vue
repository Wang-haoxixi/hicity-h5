<template>
	<view class="partnerRecruitment">
		<image src="../../static/pic-partnerRecruitment.png" class="pic-partnerRecruitment"></image>
		<image src="../../static/pic-partnershipDirection.png" class="pic-partnershipDirection"></image>
		<image src="../../static/pic-supportSystem.png" class="pic-supportSystem"></image>
		<image src="../../static/pic-equityValue.png" class="pic-equityValue"></image>
		<image src="../../static/pic-honorQualification.png" class="pic-honorQualification"></image>
		<image src="../../static/pic-partner.png" class="pic-partner"></image>
		<image src="../../static/pic-cellOur.png" class="pic-cellOur"></image>
		<image src="../../static/pic-jionUs.png" class="pic-jionUs" @tap="jionUs"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods:{
			jionUs(){
				uni.navigateTo({
				    url: '/pages/joinUs/joinUs'
				});
			},
		},
		
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
	}

	.partnerRecruitment {
		height: auto;
		width: 100%;
		background-color: #002A64;
		position: relative;

		.pic-partnerRecruitment {
			width: 100%;
			height: 1624rpx;
		}

		.pic-partnershipDirection {
			width: 100%;
			height: 770rpx;
		}

		.pic-supportSystem {
			width: 100%;
			height: 972rpx;
		}

		.pic-equityValue {
			width: 100%;
			height: 724rpx;
		}

		.pic-honorQualification {
			width: 100%;
			height: 1128rpx;
		}

		.pic-partner {
			width: 100%;
			height: 974rpx;
		}

		.pic-cellOur {
			width: 100%;
			height: 724rpx;
		}

		.pic-jionUs {
			width: 670rpx;
			height: 80rpx;
			position: absolute;
			bottom: 70rpx;
			left: calc(50% - 335rpx);
		}
	}
</style>
