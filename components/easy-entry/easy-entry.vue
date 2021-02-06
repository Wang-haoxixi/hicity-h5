<template>
	<view class="easy_content" v-show="show">
		<view class="easy_input-box" v-show="show" :style="{bottom: bottomHeihgt, background: theme}">
			<input fixed auto-height="true" confirm-type='send' :focus="focused" :show-confirm-bar="showConfirmBar"
			 cursor-spacing="0" class="easy_text" @confirm='checkContent' @focus="onFocus" @blur="onBlur" placeholder="爱评论的人运气都不错 ~"
			 placeholder-class="easy_input_null" v-model="commentText">
			</input>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			theme: {
				type: String,
				default: '#111111'
			},
			type:{
				type: String,
				default: '1'
			}
		},
		data() {
			return {
				commentText: '', //评论内容
				show: false, //控制输入框显示
				focused: false, //获取焦点
				// adjustPosition: false, //键盘弹起时，是否自动上推页面
				showConfirmBar: false, //是否显示键盘上方带有”完成“按钮那一栏
				bottomHeihgt: 0,
			}
		},
		computed: {
			/**
			 *检查是否为空输入
			 * */
			isEmptyComment() {
				const formatText = this.commentText.trim()
				return formatText.length === 0
			}
		},
		methods: {
			onEntry() {
				this.commentText = ''
				this.show = !this.show
				// set timer fix bug
				setTimeout(() => {
					this.focused = !this.focused
				}, 100)
			},
			// 输入框聚焦时触发，event.detail = { value, height }，height 为键盘高度
			onFocus(e) {
				console.log(e)
				const {
					height
				} = e.detail
				this.bottomHeihgt = height + 'px'
			},
			//输入框失去焦点时触发
			onBlur(e) {
				this.focused = false
				this.show = false
			},
			// 回车发送
			checkContent() {
				// if (this.isEmptyComment) return
				this.$emit("sendText", this.commentText,this.type) 
				this.focused = false
				this.show = false
			}
		}
	}
</script>

<style scoped>
	.easy_content {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10000;
		background-color: rgba(0, 0, 0, 0.2);
	}

	.easy_input-box {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: 20rpx 12rpx;
		background: #111;
	}

	.easy_input-box .easy_text {
		box-sizing: border-box;
		background: #F7F7F7;
		border-radius: 8rpx;
		width: 100%;
		height: 80rpx;
		border-radius: 80px;
		/* min-height: 70rpx; */
		max-height: 120rpx;
		border-width: 10rpx 20rpx;
		border-style: solid;
		border-color: #F7F7F7;
		line-height: 40rpx;
		font-family: PingFangSC-Regular;
		font-size: 28rpx;
		color: #333333;
	}

	.easy_input-box .easy_submit {
		width: 138rpx;
		font-family: PingFangSC-Regular;
		font-size: 32rpx;
		color: #1B9AF4;
		text-align: center;
		height: 64rpx;
		line-height: 64rpx;
	}

	.easy_input_null {
		margin-left: 12rpx;
		font-family: PingFangSC-Regular;
		font-size: 28rpx;
		color: #939393;
	}

	.easy-no-valid {
		color: #939393 !important;
	}
</style>
