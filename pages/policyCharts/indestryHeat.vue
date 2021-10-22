<template>
	<view style="height: 524rpx;width: 654rpx;margin: 0 auto;">
		<qiun-data-charts type="line" :opts="pieOption" :chartData="chartData" tooltipFormat="tooltipTextListCustom1"/>
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
					"padding": [
						-5,
						5,
						0,
						5
					],
					"legend": {
						"position": "top",
						"margin": 15,
					},
					"title": false,
					"subtitle": false,
					"dataLabel": false,
					"dataLabel": false,
					"dataPointShape": false,
					"xAxis": {
						"fontSize": 9
					},
					"yAxis": {
						"data": [
							{
								"fontSize": 9,
								"axisLine": false,
								"textAlign": "left",
							}
						]
					},
					"extra": {
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
