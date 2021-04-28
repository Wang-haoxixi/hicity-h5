<template>
	<view class="partnerRecruitment">
		<image :src="$ossUrl('h5_bg_partnerRecruitment.png')" class="pic-partnerRecruitment"></image>
		<image :src="$ossUrl('h5_bg_partnershipDirection.png')" class="pic-partnershipDirection"></image>
		<image :src="$ossUrl('h5_bg_supportSystem.png')" class="pic-supportSystem"></image>
		<image :src="$ossUrl('h5_bg_equityValue.png')" class="pic-equityValue"></image>
		<image :src="$ossUrl('h5_bg_honorQualification.png')" class="pic-honorQualification"></image>
		<image :src="$ossUrl('h5_bg_partner.png')" class="pic-partner"></image>
		<image :src="$ossUrl('h5_pic_cellOur.png')" class="pic-cellOur"></image>
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
