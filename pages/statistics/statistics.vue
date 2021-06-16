<template>
	<view>
		<view class=""
			style="width: 100%; overflow:hidden;background: url(../../static/statistics_bg.png) no-repeat ;background-size:100% 386rpx;">
			<view class=""
				style="margin: 0 auto; margin-top: 216rpx;width:702rpx;height: 280rpx;background-color: #FFFFFF; box-shadow: 0px 4rpx 16rpx rgba(87, 104, 160, 0.11);border-radius: 16rpx;">
				<view class="" style="padding: 24rpx; font-size: 24rpx;line-height: 34rpx;color: #5F5F5F;">
					累计收款(元)
				</view>
				<view class="" style="padding:0 24rpx; display: flex;align-items: flex-end;">
					<view class=""
						style="color: #415BFD;font-size: 72rpx;line-height: 84rpx;font-family: DIN Alternate;font-weight: bold;">
						{{isEmpty(accountInfo.cumulativeCollection)?'0.0':accountInfo.cumulativeCollection}}
					</view>
					<view class="" style="margin-left: 16rpx;margin-bottom: 10rpx;">
						<view class="" style="display: flex;align-items: center;font-size: 24rpx;line-height: 34rpx;">
							<view class="" style="margin-right: 8rpx;display: flex;align-items: center;">
								<view class="">
									共
								</view>
								<view style="color:#415BFD ;font-family: PingFangSC-Medium;font-weight: bold">
									{{isEmpty(accountInfo.cumulativeNumber )?'0':accountInfo.cumulativeNumber }}
								</view>
								<view class="">
									笔
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="" style="margin: 24rpx;height: 1px;background-color: #EDEDED;opacity: 0.5;">

				</view>
				<view class="" @tap="goDetails" style="padding: 0rpx 24rpx; display: flex;align-items: center;color: #5F5F5F;">
					<view class="" style="margin-right: 16rpx;display: flex;align-items: center;">
						<view style="font-size: 24rpx;line-height: 42rpx;margin-right: 8rpx;">累计收益(元)</view>
						<view
							style="color: #415BFD;font-size: 30rpx;line-height: 42rpx;font-family: PingFangSC-Medium;font-weight: bold;">
							{{isEmpty(accountInfo.cumulativeRevenue)?'0':accountInfo.cumulativeRevenue}}
						</view>
					</view>
					<image src="../../static/icon-statisticsRight.png" mode=""
						style="width: 14rpx;height: 34rpx;"></image>
					<!-- <view class="" style="margin-right: 24rpx;display: flex;align-items: center;">
						<view style="font-size: 24rpx;line-height: 42rpx;margin-right: 8rpx;">累计提现(元)</view>
						<view
							style="color: #415BFD;font-size: 30rpx;line-height: 42rpx;font-family: PingFangSC-Medium;font-weight: bold;">
							{{isEmpty(accountInfo.cumulativeCashOut)?'0':accountInfo.cumulativeCashOut}}
						</view>
					</view> -->
				</view>
			</view>
			<view class=""
				style="background-color: #FFFFFF;width:702rpx;height:486rpx;margin: 0 auto;padding: 32rpx 24rpx; border-radius: 16rpx;margin-top: 16rpx;">
				<view class=""
					style="color: #272727;font-size: 32rpx;line-height: 44rpx;font-weight: bold;letter-spacing: 2rpx;margin-bottom: 32rpx;">
					店铺收款金额统计
				</view>
				<view class="" style="display: flex;align-items: center;justify-content: space-between;">
					<!-- <picker mode="date" :value="accountDate" fields="month" :end="endDate"
						@change="bindAccountDateChange">
						<view class="picker">
							<view>
								{{accountDateShow}}
							</view>
							<image src="../../static/icon_pulldown.png" mode=""
								style="width: 32rpx;height: 32rpx;margin-left: 4rpx;">
							</image>
						</view>
					</picker> -->
					<view class="picker" @tap="accountDateVisibleShow">
						<view>
							{{accountDateShow}}
						</view>
						<image src="../../static/icon_pulldown.png" mode=""
							style="width: 32rpx;height: 32rpx;margin-left: 4rpx;">
						</image>
					</view>
					<w-picker
						:visible.sync="accountDateVisible"
						mode="date" 
						:startYear="changYear-40" 
						:endYear="changYear"
						:value="accountDate"
						fields="month"
						@confirm="onAccountConfirm($event,'date1')"
						:disabled-after="true"
						ref="date1"
					></w-picker>
				</view>
				<view class="qiun-charts" style="height: 300rpx;">
					<qiun-data-charts type="column" :chartData="accountColumn" :opts="{xAxis:{format:'xAxisDemo1'}}" :ontouch="true" :tooltipFormat="tooltipFormatTempName"/>
				</view>
			</view>
			<view class=""
				style="background-color: #FFFFFF;width:702rpx;height:486rpx;margin: 0 auto;padding: 32rpx 24rpx;border-radius: 16rpx;margin-top: 16rpx;">
				<view class=""
					style="color: #272727;font-size: 32rpx;line-height: 44rpx;font-weight: bold;letter-spacing: 2rpx;margin-bottom: 32rpx;">
					店铺收款金额每日统计
					</page-meta>
				</view>
				<view class="" style="display: flex;align-items: center;justify-content: space-between;">
					<!-- <picker mode="date" :value="accountDayDate" fields="month" :end="endDate"
						@change="bindAccountDayDateChange">
						<view class="picker">
							<view>
								{{accountDayDateShow}}
							</view>
							<image src="../../static/icon_pulldown.png" mode=""
								style="width: 32rpx;height: 32rpx;margin-left: 4rpx;">
							</image>
						</view>
					</picker> -->
					<view class="picker" @tap="accountDayDateVisibleShow">
						<view>
							{{accountDayDateShow}}
						</view>
						<image src="../../static/icon_pulldown.png" mode=""
							style="width: 32rpx;height: 32rpx;margin-left: 4rpx;">
						</image>
					</view>
					<w-picker
						:visible.sync="accountDayDateVisible"
						mode="date" 
						:startYear="changYear-40" 
						:endYear="changYear"
						:current="true"
						fields="month"
						@confirm="onAccountDayConfirm($event,'date2')"
						:disabled-after="true"
						ref="date2"
					></w-picker>
					<picker mode="selector" @change="bindAccountCompanyChange" :range="accountCompanyList"
						:value="accountValue" range-key="storeName">
						<view class="picker">
							<view
								style="max-width: 120rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
								{{accountCompanyList[accountValue].storeName}}
							</view>
							<image src="../../static/icon_pulldown.png" mode=""
								style="width: 32rpx;height: 32rpx;margin-left: 4rpx;">
							</image>
						</view>
					</picker>
				</view>
				<view class="qiun-charts" style="height: 300rpx;">
					<qiun-data-charts type="column" :chartData="accountDayColumn" :ontouch="true" :tooltipFormat="tooltipFormatTemp"/>
				</view>
			</view>
			<view class=""
				style="background-color: #FFFFFF;width:702rpx;height:486rpx;margin: 0 auto;padding: 32rpx 24rpx;border-radius: 16rpx;margin-top: 16rpx;">
				<view class=""
					style="color: #272727;font-size: 32rpx;line-height: 44rpx;font-weight: bold;letter-spacing: 2rpx;margin-bottom: 32rpx;">
					店铺收款次数统计
				</view>
				<view class="" style="display: flex;align-items: center;justify-content: space-between;">
					<!-- <picker mode="date" :value="timeDate" fields="month" :end="endDate" @change="bindTimeDateChange">
						<view class="picker">
							<view>
								{{timeDateShow}}
							</view>
							<image src="../../static/icon_pulldown.png" mode=""
								style="width: 32rpx;height: 32rpx;margin-left: 4rpx;">
							</image>
						</view>
					</picker> -->
					<view class="picker" @tap="timeDateVisibleShow">
						<view>
							{{timeDateShow}}
						</view>
						<image src="../../static/icon_pulldown.png" mode=""
							style="width: 32rpx;height: 32rpx;margin-left: 4rpx;">
						</image>
					</view>
					<w-picker
						:visible.sync="timeDateVisible"
						mode="date" 
						:startYear="changYear-40" 
						:endYear="changYear"
						:current="true"
						fields="month"
						@confirm="onTimeConfirm($event,'date3')"
						:disabled-after="true"
						ref="date3"
					></w-picker>
				</view>
				<view class="qiun-charts" style="height: 300rpx;">
					<qiun-data-charts type="column" :chartData="timeColumn" :opts="{xAxis:{format:'xAxisDemo1'},yAxis:{data:[{unit:'笔'}]}}" :ontouch="true" :tooltipFormat="tooltipFormatTempName"/>
				</view>
			</view>
			<view class=""
				style="background-color: #FFFFFF;width:702rpx;height:486rpx;margin: 0 auto;padding: 32rpx 24rpx;border-radius: 16rpx;margin-top: 16rpx;margin-bottom: 56rpx;">
				<view class=""
					style="color: #272727;font-size: 32rpx;line-height: 44rpx;font-weight: bold;letter-spacing: 2rpx;margin-bottom: 32rpx;">
					店铺收款次数每日统计
				</view>
				<view class="" style="display: flex;align-items: center;justify-content: space-between;">
					<!-- <picker mode="date" :value="timeDayDate" fields="month" :end="endDate"
						@change="bindTimeDayDateChange">
						<view class="picker">
							<view>
								{{timeDayDateShow}}
							</view>
							<image src="../../static/icon_pulldown.png" mode=""
								style="width: 32rpx;height: 32rpx;margin-left: 4rpx;">
							</image>
						</view>
					</picker> -->
					<view class="picker" @tap="timeDayDateVisibleShow">
						<view>
							{{timeDayDateShow}}
						</view>
						<image src="../../static/icon_pulldown.png" mode=""
							style="width: 32rpx;height: 32rpx;margin-left: 4rpx;">
						</image>
					</view>
					<w-picker
						:visible.sync="timeDayDateVisible"
						mode="date" 
						:startYear="changYear-40" 
						:endYear="changYear"
						:current="true"
						fields="month"
						@confirm="onTimeDayConfirm($event,'date4')"
						:disabled-after="true"
						ref="date4"
					></w-picker>
					<picker mode="selector" @change="bindTimeCompanyChange" :range="timeCompanyList"
						range-key="storeName" :value="timeValue">
						<view class="picker">
							<view
								style="max-width: 120rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
								{{timeCompanyList[timeValue].storeName}}
							</view>
							<image src="../../static/icon_pulldown.png" mode=""
								style="width: 32rpx;height: 32rpx;margin-left: 4rpx;">
							</image>
						</view>
					</picker>
				</view>
				<view class="qiun-charts" style="height: 300rpx;">
					<qiun-data-charts type="column" :chartData="timeDayColumn" :opts="{yAxis:{data:[{unit:'笔'}]}}" :ontouch="true" :tooltipFormat="tooltipFormatTemp2"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js';
	import {
		isEmpty
	} from '@/common/utils.js'
	import wPicker from "@/components/w-picker/w-picker.vue"
	let u = navigator.userAgent;
	let isAndroid = u.indexOf('Android') > -1; //安卓终端
	let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	export default {
		components:{
			wPicker
		},
		data() {
			return {
				accountDateVisible:false,
				accountDayDateVisible:false,
				timeDateVisible:false,
				timeDayDateVisible:false,
				userId: '',
				token:'',
				accountInfo: {},
				//赋值两个，一个储存一个展示，否则回显失效
				accountDate: '',
				accountDateShow: '',
				accountDayDate: '',
				accountDayDateShow: '',
				timeDate: '',
				timeDateShow: '',
				timeDayDate: '',
				timeDayDateShow: '',
				accountValue: 0,
				timeValue: 0,
				accountCompanyList: [{
					storeId: undefined,
					storeName: '全部店铺'
				}],
				timeCompanyList: [{
					storeId: undefined,
					storeName: '全部店铺'
				}],
				accountColumn:{},
				accountDayColumn:{},
				timeColumn:{},
				timeDayColumn:{},
				//格式化
				tooltipFormatTemp:"tooltipDemo1",
				tooltipFormatTemp2:"tooltipDemo3",
				tooltipFormatTempName:"tooltipDemo2",
				//用于判断当前月份，并单独给柱状条颜色
				nowDate:'',
				//用于判断选择的年份和月份是否已经改变，不再是当下的月份
				changeMonth:'',
				changYear:'',
				isNowDate:true,
				changeTimeMonth:'',
				changeTimeYear:'',
				isNowTimeDate:true,
				//判断请求完毕，关闭下拉刷新等待交互样式
				accountStatus:false,
				accountDayStatus:false,
				timeStatus:false,
				timeDayStatus:false
			};
		},
		onLoad(options) {
			this.userId = options.id
			this.token =options.token
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate()
			month = month > 9 ? month : '0' + month;
			this.changYear =year
			this.changeMonth = month
			this.changeTimeYear= year
			this.changeTimeMonth = month
			this.nowDate = day
			this.getInfo()
			this.getCompanyList()
			this.accountDate = `${year}-${month}`
			this.accountDateShow = `${year}年${month}月`
			this.accountDayDate = `${year}-${month}`
			this.accountDayDateShow = `${year}年${month}月`
			this.timeDate = `${year}-${month}`
			this.timeDateShow = `${year}年${month}月`
			this.timeDayDate = `${year}-${month}`
			this.timeDayDateShow = `${year}年${month}月`
			this.getAccount()
			this.getAccountDay()
			this.getTime()
			this.getTimeDay()
		},
		computed: {
			// startDate() {
			// 	return this.getDate('start');
			// },
			endDate() {
				return this.getDate('end');
			},
			accountStoreId() {
				return this.accountCompanyList[this.accountValue].storeId
			},
			timeStoreId() {
				return this.timeCompanyList[this.timeValue].storeId
			}
		},
		// onPullDownRefresh() {
		// 	const date = new Date();
		// 	let year = date.getFullYear();
		// 	let month = date.getMonth() + 1;
		// 	let day = date.getDate()
		// 	month = month > 9 ? month : '0' + month;
		// 	this.changYear =year
		// 	this.changeMonth = month
		// 	this.changeTimeYear= year
		// 	this.changeTimeMonth = month
		// 	this.nowDate = day
		// 	this.getInfo()
		// 	this.getCompanyList()
		// 	this.accountDate = `${year}-${month}`
		// 	this.accountDateShow = `${year}年${month}月`
		// 	this.accountDayDate = `${year}-${month}`
		// 	this.accountDayDateShow = `${year}年${month}月`
		// 	this.timeDate = `${year}-${month}`
		// 	this.timeDateShow = `${year}年${month}月`
		// 	this.timeDayDate = `${year}-${month}`
		// 	this.timeDayDateShow = `${year}年${month}月`
		// 	this.getAccount()
		// 	this.getAccountDay()
		// 	this.getTime()
		// 	this.getTimeDay()
		// 	if(this.accountStatus &&this.accountDayStatus && this.timeStatus&&this.timeDayStatus){
		// 		uni.stopPullDownRefresh()
		// 	}
		// },
		methods: {
			isEmpty,
			goDetails(){
				if(isAndroid){
					window.android.goAccountList()
				}else if(isIOS){
					window.webkit.messageHandlers.goAccountList.postMessage(null)
				}
			},
			accountDateVisibleShow(){
				this.accountDateVisible =true
			},
			onAccountConfirm(e){
				this.accountColumn={}
				this.accountDate = e.value
				this.accountDateShow = e.value.replace('-', '年') + '月'
				this.getAccount()
			},
			accountDayDateVisibleShow(){
				this.accountDayDateVisible=true
			},
			onAccountDayConfirm(e){
				this.accountDayColumn={}
				this.accountDayDate = e.value
				if(this.changYear != this.accountDayDate.split('-')[0] || this.changeMonth != this.accountDayDate.split('-')[1]){
					this.isNowDate = false
				}else{
					this.isNowDate = true
				}
				this.accountDayDateShow = e.value.replace('-', '年') + '月'
				this.getAccountDay()
			},
			timeDateVisibleShow(){
				this.timeDateVisible=true
			},
			onTimeConfirm(e){
				this.timeColumn={}
				this.timeDate = e.value
				this.timeDateShow = e.value.replace('-', '年') + '月'
				this.getTime()
			},
			timeDayDateVisibleShow(){
				this.timeDayDateVisible=true
			},
			onTimeDayConfirm(e){
				this.timeDayColumn={}
				this.timeDayDate = e.value
				if(this.changeTimeYear != this.timeDayDate.split('-')[0] || this.changeTimeMonth != this.timeDayDate.split('-')[1]){
					this.isNowTimeDate = false
				}else{
					this.isNowTimeDate = true
				}
				this.timeDayDateShow = e.value.replace('-', '年') + '月'
				this.getTimeDay()
			},
			// bindAccountDateChange: function(e) {
			// 	this.accountColumn={}
			// 	this.accountDate = e.detail.value
			// 	this.accountDateShow = e.detail.value.replace('-', '年') + '月'
			// 	this.getAccount()
			// },
			// bindAccountDayDateChange: function(e) {
			// 	this.accountDayColumn={}
			// 	this.accountDayDate = e.detail.value
			// 	if(this.changYear != this.accountDayDate.split('-')[0] || this.changeMonth != this.accountDayDate.split('-')[1]){
			// 		this.isNowDate = false
			// 	}else{
			// 		this.isNowDate = true
			// 	}
			// 	this.accountDayDateShow = e.detail.value.replace('-', '年') + '月'
			// 	this.getAccountDay()
			// },
			// bindTimeDateChange: function(e) {
			// 	this.timeColumn={}
			// 	this.timeDate = e.detail.value
			// 	this.timeDateShow = e.detail.value.replace('-', '年') + '月'
			// 	this.getTime()
			// },
			// bindTimeDayDateChange: function(e) {
			// 	this.timeDayColumn={}
			// 	this.timeDayDate = e.detail.value
			// 	if(this.changeTimeYear != this.timeDayDate.split('-')[0] || this.changeTimeMonth != this.timeDayDate.split('-')[1]){
			// 		this.isNowTimeDate = false
			// 	}else{
			// 		this.isNowTimeDate = true
			// 	}
			// 	this.timeDayDateShow = e.detail.value.replace('-', '年') + '月'
			// 	this.getTimeDay()
			// },
			bindAccountCompanyChange: function(e) {
				this.accountDayColumn={}
				this.accountValue = e.detail.value
				this.getAccountDay()
			},
			bindTimeCompanyChange: function(e) {
				this.timeDayColumn={}
				this.timeValue = e.detail.value
				this.getTimeDay()
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year;
				}
				month = month > 9 ? month : '0' + month;
				return `${year}-${month}`;
			},
			getInfo() {
				uni.request({
					url: '/api/mms/store_order/mobile/personal_bill',
					data: {
						userId: this.userId
					},
					header: {
						'Authorization': "Bearer " + this.token,
					},
					success: (res) => {
						if (res.data.data.businessCode !== 1000) {
							uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
								// success: () => {
								// 	setTimeout(() => {
								// 		uni.redirectTo({
								// 			url: '../404/404'
								// 		});
								// 	}, 1500)
								// }
							});
						} else {
							this.accountInfo = res.data.data.data
						}
					}
				})
			},
			getCompanyList() {
				uni.request({
					url: '/api/mms/store/mobile/own_store',
					header: {
						'Authorization': "Bearer " + this.token,
					},
					success: (res) => {
						if (res.data.data.businessCode !== 1000) {
							uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
								// success: () => {
								// 	setTimeout(() => {
								// 		uni.redirectTo({
								// 			url: '../404/404'
								// 		});
								// 	}, 1500)
								// }
							});
						} else {
							this.accountCompanyList = this.accountCompanyList.concat(res.data.data.data)
							this.timeCompanyList = this.timeCompanyList.concat(res.data.data.data)
						}
					}
				})
			},
			getAccount() {
				uni.request({
					url: '/api/mms/store_order/mobile/statistics_proceeds_month_amount',
					data: {
						month: `${this.accountDate}-01 00:00:00`
					},
					header: {
						'Authorization': "Bearer " + this.token,
					},
					success: (res) => {
						if (res.data.data.businessCode !== 1000) {
							uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
								// success: () => {
								// 	setTimeout(() => {
								// 		uni.redirectTo({
								// 			url: '../404/404'
								// 		});
								// 	}, 1500)
								// }
							});
						} else {
							let accountColumn = {
								categories:[],
								series:[{
									data:[]
								}]
							}
							accountColumn.categories = res.data.data.data.map(item=>{
								return item.x
							})
							accountColumn.series[0].data =  res.data.data.data.map(item=>{
								return item.y
							})
							let columnFormatDemo=JSON.parse(JSON.stringify(accountColumn))
							for (var i = 0; i <accountColumn.series.length; i++) {
							  accountColumn.series[i].format="yAxisDemo4"
							}
							this.accountColumn = accountColumn
						}
					},
					complete:()=>{
						this.accountStatus=true
					}
				})
			},
			getAccountDay() {
				uni.request({
					url: '/api/mms/store_order/mobile/statistics_proceeds_day_amount',
					data: {
						month: `${this.accountDayDate}-01 00:00:00`,
						storeId: this.accountStoreId
					},
					header: {
						'Authorization': "Bearer " + this.token,
					},
					success: (res) => {
						if (res.data.data.businessCode !== 1000) {
							uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
								// success: () => {
								// 	setTimeout(() => {
								// 		uni.redirectTo({
								// 			url: '../404/404'
								// 		});
								// 	}, 1500)
								// }
							});
						} else {
							// console.log(res)
							let accountDayColumn={
								categories:[],
								series:[{
									data:[]
								}]
							}
							accountDayColumn.categories = res.data.data.data.map(item=>{
								return item.x+'日'
							})
							accountDayColumn.series[0].data =  res.data.data.data.map(item=>{
								return item.y
							})
							let columnFormatDemo=JSON.parse(JSON.stringify(accountDayColumn))
							for (var i = 0; i < accountDayColumn.series.length; i++) {
							  accountDayColumn.series[i].format="yAxisDemo4"
							}
							let obj = {
								value:'',
								color:'#415BFD'
							}
							accountDayColumn.categories.forEach((item,index)=>{
								if(this.isNowDate && parseInt(item)==this.nowDate){
									obj.value = accountDayColumn.series[0].data[index]
									accountDayColumn.series[0].data[index] = obj
								}
							})
							this.accountDayColumn =accountDayColumn
						}
					},
					complete:()=>{
						this.accountDayStatus =true
					}
				})
			},
			getTime() {
				uni.request({
					url: '/api/mms/store_order/mobile/statistics_proceeds_month_count',
					data: {
						month: `${this.timeDate}-01 00:00:00`,
					},
					header: {
						'Authorization': "Bearer " + this.token,
					},
					success: (res) => {
						if (res.data.data.businessCode !== 1000) {
							uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
								// success: () => {
								// 	setTimeout(() => {
								// 		uni.redirectTo({
								// 			url: '../404/404'
								// 		});
								// 	}, 1500)
								// }
							});
						} else {
							let timeColumn ={
								categories:[],
								series:[{
									data:[]
								}]
							}
							timeColumn.categories = res.data.data.data.map(item=>{
								return item.x
							})
							timeColumn.series[0].data =  res.data.data.data.map(item=>{
								return item.y
							})
							let columnFormatDemo=JSON.parse(JSON.stringify(timeColumn))
							for (var i = 0; i < timeColumn.series.length; i++) {
							  timeColumn.series[i].format="yAxisDemo3"
							}
							this.timeColumn = timeColumn
						}
					},
					complete:()=>{
						this.timeStatus =true
					}
				})
			},
			getTimeDay() {
				uni.request({
					url: '/api/mms/store_order/mobile/statistics_proceeds_day_count',
					data: {
						month: `${this.timeDayDate}-01 00:00:00`,
						storeId: this.timeStoreId
					},
					header: {
						'Authorization': "Bearer " + this.token,
					},
					success: (res) => {
						if (res.data.data.businessCode !== 1000) {
							uni.showToast({
								title: res.data.data.msg,
								duration: 1500,
								icon: "none",
								// success: () => {
								// 	setTimeout(() => {
								// 		uni.redirectTo({
								// 			url: '../404/404'
								// 		});
								// 	}, 1500)
								// }
							});
						} else {
							// console.log(res)
							let timeDayColumn ={
								categories:[],
								series:[{
									data:[]
								}]
							}
							timeDayColumn.categories = res.data.data.data.map(item=>{
								return item.x+'日'
							})
							timeDayColumn.series[0].data =  res.data.data.data.map(item=>{
								return item.y
							})
							let obj = {
								value:'',
								color:'#415BFD'
							}
							timeDayColumn.categories.forEach((item,index)=>{
								if(this.isNowTimeDate && parseInt(item)==this.nowDate){
									obj.value = timeDayColumn.series[0].data[index]
									timeDayColumn.series[0].data[index] = obj
								}
							})
							let columnFormatDemo=JSON.parse(JSON.stringify(timeDayColumn))
							for (var i = 0; i < timeDayColumn.series.length; i++) {
							  timeDayColumn.series[i].format="yAxisDemo3"
							}
							this.timeDayColumn = timeDayColumn
						}
					},
					complete:()=>{
						this.timeDayStatus=true
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #F5F7F8;
	}
	
	/* 通用样式 */
	.qiun-charts {
		width: 654upx;
		height: 200upx;
		background-color: #FFFFFF;
	}
	 
	.charts {
		width: 654upx;
		height: 200upx;
		background-color: #FFFFFF;
	}
	
	.picker {
		display: flex;
		align-items: center;
		border-radius: 30rpx;
		padding: 8rpx 16rpx 8rpx 24rpx;
		background-color: #F5F7F8;
	}
</style>
