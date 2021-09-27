<template>
	<view class="policy-container">
		<view class="item-box">
			<view class="item-title">全国政策数</view>
			<quantity-all :chart-data="quantityAllChartData"></quantity-all>
			<view class="legend-list">
				<view class="legend-item map_sort_1">0-200</view>
				<view class="legend-item map_sort_2">200-400</view>
				<view class="legend-item map_sort_3">400-600</view>
				<view class="legend-item map_sort_4">600-800</view>
				<view class="legend-item map_sort_5">800-1000</view>
				<view class="legend-item map_sort_6">1000-1200</view>
				<view class="legend-item map_sort_7">1200-1400</view>
				<view class="legend-item map_sort_8">1400以上</view>
			</view>
		</view>
		<view class="item-box" style="margin-top: 16rpx">
			<view class="item-title">主题热度指数</view>
			<theme-heat :chart-data="themeChartsData"></theme-heat>
			<view class="legend-list">
				<view v-for="(theme, index) in themeList" :key="index" class="legend-item"
					:class="'sort_' + (index + 1)">{{theme}}</view>

			</view>
		</view>

		<view class="item-box" style="margin-top: 16rpx">
			<view class="item-title">标签热度指数</view>
			<label-heat :chart-data="labelChartsData"></label-heat>
		</view>
	</view>
</template>

<script>
	let u = navigator.userAgent;
	let isAndroid = u.indexOf('Android') > -1; //安卓终端
	let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
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
	
	function getSortArray (data) {
		let list = []
		let oddList = []
		let evenList = []
		for (let i = data.length - 1; i >= 0; i--) {
			// data[i].count = data.length - i
			if (i % 2 != data.length % 2) {
				oddList.push(data[i])
			} else {
				evenList.push(data[i])
			}
		}
		for (let i = 0; i < data.length; i++) {
			if (i % 2 == 0) {
				list.push(oddList[Math.floor(i/2)])
			} else {
				list.push(evenList[evenList.length - 1 - Math.floor(i/2)])
			}
		}
		
		return list
	}

	import themeHeat from "./themeHeat.vue"
	import labelHeat from "./labelHeat.vue"
	import quantityAll from "./quantityAll.vue"
	import mapJsonData from './CHN.json'

	const themeColors = ["#5B8FF9", "#5AD8A6", "#5D7092", "#F6BD16", "#E86452", "#6DC8EC", "#945FB9", "#FF9845"]
	const labelColors = ["#5B8FF9", "#5AD8A6", "#5D7092", "#F6BD16", "#E86452", "#6DC8EC", "#945FB9", "#FF9845"]
	export default {
		components: {
			'theme-heat': themeHeat,
			'label-heat': labelHeat,
			'quantity-all': quantityAll
		},
		data() {
			return {
				token: 'c0a9c080-d5f7-433f-b00d-d127ae3aaa5b',
				quantityAllChartData: {},
				themeList: [],
				themeChartsData: {},
				labelChartsData: {},
			}
		},
		methods: {
			handleToken(type) {
				if (isAndroid) {
					// 获取安卓传递过来的token
					window.android.invoke_native("getToken", `{resultType:${type}}`, "androidRst")
					return
				} else if (isIOS) {
					// 获取ios传递过来的token   
					window.webkit.messageHandlers.IOSGetToken.postMessage(type)
					return
				}
			},
			// 安卓回调
			androidRst(res) {
				this.token = res.token
				this.refreshData()
			},
			// ios的回调
			getIosToken(res) {
				this.token = res.token
				this.refreshData()
			},
			refreshData() {
				uni.request({
					header: {
						"Authorization": 'Bearer ' + this.token
					},
					url: '/api/dms/policy_dictionary/get_list_type?type=1',
					success: (res) => {
						if (res.data.code === 0 && res.data.data.businessCode == 1000) {
							let themeHeatData = getSortArray(res.data.data.data.slice(0, 8))
							let themeChartsData = []
							let themeList = []
							for (let i = 0; i < themeHeatData.length; i++) {
								themeList.push(themeHeatData[i].dictionaryName)
								themeChartsData.push({
									name: themeHeatData[i].dictionaryName,
									value: themeHeatData[i].count,
									color: themeColors[i]
								})
							}
							this.themeList = themeList
							this.themeChartsData = {
								series: [{
									data: themeChartsData
								}]
							}
						}
					}
				})


				uni.request({
					header: {
						"Authorization": 'Bearer ' + this.token
					},
					url: '/api/dms/policy_dictionary/get_list_type?type=2',
					success: (res) => {
						if (res.data.code === 0 && res.data.data.businessCode == 1000) {
							let labelHeatData = getSortArray(res.data.data.data.slice(0, 8))
							let labelChartsData = []
							let labelList = []
							for (let i = 0; i < labelHeatData.length; i++) {
								labelList.push(labelHeatData[i].dictionaryName)
								labelChartsData.push({
									name: labelHeatData[i].dictionaryName,
									value: labelHeatData[i].count,
									color: labelColors[i]
								})
							}
							this.labelList = labelList
							this.labelChartsData = {
								series: [{
									format: "seriesName",
									data: labelChartsData
								}]
							}
						}
					}
				})


				uni.request({
					header: {
						"Authorization": 'Bearer ' + this.token
					},
					url: '/api/dms/policy_publish/mobile/get_policy_publish_count_app',
					success: (res) => {
						if (res.data.code === 0 && res.data.data.businessCode == 1000) {
							let quantityAllData = res.data.data.data
							let jsonData = translateJsonData(mapJsonData)
							for (let i = 0; i < jsonData.length; i++) {
								jsonData[i].properties.data = 0
								jsonData[i].color = '#DEEDFE'
								for (let j = 0; j < quantityAllData.length; j++) {
									if (jsonData[i].properties.adcode == quantityAllData[j].cityCode) {
										jsonData[i].properties.data = quantityAllData[j].count
										if (quantityAllData[j].count > 1400) {
											jsonData[i].color = '#1D3790'
										} else if (quantityAllData[j].count > 1200) {
											jsonData[i].color = '#2D50B3'
										} else if (quantityAllData[j].count > 1000) {
											jsonData[i].color = '#426ED6'
										} else if (quantityAllData[j].count > 800) {
											jsonData[i].color = '#5B8FF9'
										} else if (quantityAllData[j].count > 600) {
											jsonData[i].color = '#83AFFB'
										} else if (quantityAllData[j].count > 400) {
											jsonData[i].color = '#9CC3FD'
										} else if (quantityAllData[j].count > 200) {
											jsonData[i].color = '#BDD9FE'
										} else {
											jsonData[i].color = '#DEEDFE'
										}
										break
									}
								}
							}
							this.quantityAllChartData = {
								textSize: 10,
								series: jsonData
							}
						}
					}
				})
			}
		},
		onLoad() {
			window.androidRst = this.androidRst
			window.getIosToken = this.getIosToken
			// this.refreshData()
			this.handleToken('token')
		}
	}
</script>

<style lang="scss" scoped>
	.policy-container {
		padding: 24rpx;
		background: #F5F7F8;
	}

	.item-box {
		padding: 32rpx 24rpx;
		background: #FFFFFF;
		border-radius: 8px;

		.item-title {
			height: 44rpx;
			line-height: 44rpx;
			color: #272727;
			font-size: 32rpx;
		}

		.legend-list {
			margin-top: 32rpx;
			padding-bottom: 8rpx;
			padding: 0 36rpx;
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-template-rows: repeat(auto-fill, 28rpx);
			grid-row-gap: 16rpx;
			grid-column-gap: 0rpx;

			.legend-item {
				position: relative;
				padding-left: 20rpx;
				height: 28rpx;
				line-height: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 20rpx;
				color: #5F5F5F;

				&::before {
					content: '';
					display: block;
					height: 12rpx;
					width: 12rpx;
					border-radius: 12rpx;
					position: absolute;
					left: 0;
					top: 8rpx
				}

				&.sort_1 {
					&::before {
						background-color: #5B8FF9;
					}
				}

				&.sort_2 {
					&::before {
						background-color: #5AD8A6;
					}
				}

				&.sort_3 {
					&::before {
						background-color: #5D7092;
					}
				}

				&.sort_4 {
					&::before {
						background-color: #F6BD16;
					}
				}

				&.sort_5 {
					&::before {
						background-color: #E86452;
					}
				}

				&.sort_6 {
					&::before {
						background-color: #6DC8EC;
					}
				}

				&.sort_7 {
					&::before {
						background-color: #945FB9;
					}
				}

				&.sort_8 {
					&::before {
						background-color: #FF9845;
					}
				}

				&.map_sort_1 {
					&::before {
						background-color: #DEEDFE;
					}
				}

				&.map_sort_2 {
					&::before {
						background-color: #BDD9FE;
					}
				}

				&.map_sort_3 {
					&::before {
						background-color: #9CC3FD;
					}
				}

				&.map_sort_4 {
					&::before {
						background-color: #83AFFB;
					}
				}

				&.map_sort_5 {
					&::before {
						background-color: #5B8FF9;
					}
				}

				&.map_sort_6 {
					&::before {
						background-color: #426ED6;
					}
				}

				&.map_sort_7 {
					&::before {
						background-color: #2D50B3;
					}
				}

				&.map_sort_8 {
					&::before {
						background-color: #1D3790;
					}
				}
			}
		}
	}
</style>
