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

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	/*每个页面公共css */
	/* 引入动画库 */
	@import './common/animate.css';
	@import './common/common.css';
	
	uni-toast .uni-simple-toast__text{
		text-indent: 0!important;
	}
</style>
