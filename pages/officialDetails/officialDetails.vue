<template>
	<!-- 官方发布 -->
	<view>
		<jyf-parser class="parser" :html="html" :tag-style="tagStyle" lazy-load></jyf-parser>
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-Parser/jyf-parser";
	export default {
		components: {
			jyfParser
		},
		data() {
			return {
				tagStyle: {
					body: 'line-height: 1.8;',
					img: 'background-size: contain|cover;width:100%;height:auto;'
				},
				html: ""
			};
		},
		onLoad(option) {
			console.log('官方发布', option)
			// 請求到文章详情
			// uni.request({
			// 	url: '/api/cms/open/official_details', //仅为示例，并非真实接口地址。
			// 	data: {
			// 		// newsId: option.id
			// 		officialNewsId: 7
			// 	},
			// 	success: (res) => {
			// 		console.log('res', res);
			// 		// if (res.data.code != 0) {
			// 		// 	uni.redirectTo({
			// 		// 		url: '../404/404'
			// 		// 	});
			// 		// }
			// 		// this.html = res.data.data.data.content
			// 	}
			// });
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.parser {
		padding: 0 40rpx;
		margin-top: 40rpx;
	}
</style>
