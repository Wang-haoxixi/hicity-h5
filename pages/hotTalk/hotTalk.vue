<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				details:{}
			};
		},
		onLoad(options) {
			this.id = options.id,
			this.getDetails(this.id)
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
						}
					}
				})
			},
			goDownloadApp(){
				uni.navigateTo({
					url:'../downloadApp/downloadApp?id=' + this.id + '&type=hotTalk'
				})
			},
		}
	}
</script>

<style lang="scss">

</style>
