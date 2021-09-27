<template>
	<view style="height: 650rpx;width: 654rpx;margin: 0 auto;">
		<qiun-data-charts type="map" :opts="pieOption" :chartData="chartData" tooltipFormat="tooltipMapCustom" />
	</view>
</template>

<script>
	function lonlat2mercator([longitude, latitude]) {
		var mercator = Array(2);
		var x = longitude
		// var x = longitude * 20037508.34 / 180;
		var y = Math.log(Math.tan((90 + latitude) * Math.PI / 360)) / (Math.PI / 180);
		// y = y * 20037508.34 / 180;
		mercator[0] = x;
		mercator[1] = y;
		return mercator;
	}

	function getCoordinates(data) {
		// console.log(123, data)
		let coordinates = []
		for (let i = 0; i < data.length; i++) {
			if (data[i].length > 0 && data[i][0] instanceof Array) {
				coordinates.push(getCoordinates(data[i]))
			} else if (data[i].length == 2) {
				coordinates.push(lonlat2mercator(data[i]))
			} else {
				coordinates.push([])
			}
		}
		return coordinates
	}

	function translateJsonData(jsonData) {
		for (let i = 0; i < jsonData.length; i++) {
			if (jsonData[i].properties.center) jsonData[i].properties.center = lonlat2mercator(jsonData[i].properties
				.center)
			if (jsonData[i].properties.centroid) jsonData[i].properties.centroid = lonlat2mercator(jsonData[i].properties
				.centroid)
			jsonData[i].geometry.coordinates = getCoordinates(jsonData[i].geometry.coordinates)
		}
		return jsonData
	}
	import jsonData from './CHN.json'
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
					"extra": {
						"map": {
							borderWidth: 0.2,
							activeDisabled: true,
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
						},
						"label": {
							fontSize: 8
						}
					}
				},
			}
		},
		mounted() {}
	}
</script>

<style lang="scss">

</style>
