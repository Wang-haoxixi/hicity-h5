<template>
	<view style="height: 524rpx;width: 654rpx;margin: 0 auto;">
		<qiun-data-charts type="ring" :opts="pieOption" :chartData="chartData" tooltipFormat="tooltipTextListCustom"/>
	</view>
</template>

<script>
	export default {
		props: {
			chartData: {
				type: Object,
				default: () => ({}),
			}
		},
		data() {
			return {
				pieOption: {
					"legend": {
						"show": false,
					},
					"title": false,
					"subtitle": false,
					"dataLabel": false,
					"extra": {
						"ring": {
							"border": false,
							"activeRadius": 0,
							"offsetAngle": -90,
							"customRadius": 111,
							"ringWidth": 46,
						},
						"tooltip": {
							"padding": [10, 5],
							"noLegend": true,
							"textListCustom": true,
							"borderWidth": 1,
							"borderRadius": 8,
							"borderColor": "#EDEDED",
							"bgColor": "#FFFFFF",
							"showArrow": false,
							"showBox": true,
							"borderOpacity": 1,
							"bgOpacity": 1,
						}
					}
				},
			}
		},
	}
</script>

<style lang="scss">

</style>
