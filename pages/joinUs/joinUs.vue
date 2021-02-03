<template>
	<view class="joinUs">
		<view class="namebox inpbox">
			<view class="name">
				姓名
			</view>
			<view class="inp">
				<input v-model="data.name" placeholder-class="placeholderStyle" type="text" placeholder="请输入您的姓名" />
			</view>
		</view>
		<view class="contactWaybox inpbox">
			<view class="contactWay">
				联系方式
			</view>
			<view class="inp">
				<input v-model="data.cell" placeholder-class="placeholderStyle" type="number" placeholder="请输入您的联系方式" />
			</view>
		</view>
		<view class="areabox inpbox">
			<view class="area">
				地区
			</view>
			<view class="inp">
				<input v-model="data.area" placeholder-class="placeholderStyle" type="text" placeholder="请输入所在地区" />
			</view>
		</view>
		<view class="corporationbox">
			<view class="corporation">
				合作意向
			</view>
			<view class="areaInp">
				<textarea v-model="data.corporation" placeholder-class="textareaPlaceholderStyle" placeholder="说明您的合作意向"></textarea>
			</view>
		</view>

		<view class="bottom-box">
			<button type="primary" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {
					name: '',
					cell: '',
					area: '',
					corporation: ''
				}
			};
		},
		methods:{
			// 提交
			submit(){
				console.log(this.data)
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.joinUs {
		height: 100%;
		background-color: #F9F9F9;
		padding: 32rpx;

		.placeholderStyle {
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
			text-align: right;
		}

		.textareaPlaceholderStyle {
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
		}

		.inpbox {
			box-sizing: border-box;
			width: 100%;
			height: 112rpx;
			padding: 0 32rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			margin-bottom: 24rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		input {
			text-align: right;
		}

		.corporationbox {
			width: 100%;
			height: 308rpx;
			background-color: #FFFFFF;
			padding: 36rpx 32rpx;
			box-sizing: border-box;

			.corporation {
				margin-bottom: 20rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
			}

			.areaInp {
				height: 180rpx;
				width: 100%;

				textarea {
					width: 100%;
					height: 100%;
				}
			}
		}

		.bottom-box {
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
			padding: 16rpx 32rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			box-shadow: 0rpx 6rpx 12rpx rgba(0, 0, 0, 0.24);

			button {
				border-radius: 80rpx;
			}
		}
	}
</style>
