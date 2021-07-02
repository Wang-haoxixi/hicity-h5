<script>
	export default {
		onLaunch: function(options) {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "colorui/main.css";
	@import "colorui/icon.css";
	/*每个页面公共css */
	/* 引入动画库 */
	@import './common/animate.css';
	@import './common/common.css';
	
	uni-toast .uni-simple-toast__text{
		text-indent: 0!important;
	}
	.bottom {
		width: 750rpx;
		position: fixed;
		bottom: 0rpx;
		background-color: #FFFFFF;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	
		/* #endif */
		.bottom-view{
			padding: 32rpx;
		}
	}
</style>
