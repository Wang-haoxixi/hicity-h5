<template>
	<view class="all-comment">
		<!-- 导航栏部分 -->
		<uni-nav-bar fixed="true" left-icon="back" title="全部评论" backgroundColor="#F5F7F8" @clickLeft="handleClickLeft"></uni-nav-bar>
		<!-- tabs -->
		<view class="tabs-list">
			<view @click="changeTab(index)" :class="['tab-item', activeCurrent==index ? 'active-tab' : '']" v-for="(item,index) in tabs" :key='index'>
				{{ item.tab }} <text v-if="index == 0">(21)</text>
			</view>
		</view>
		<!-- 占位盒子 -->
		<view style="height: 108rpx;"></view>
		<!-- 切换区域 -->
		<view style="padding: 0 32rpx;">
			<view class="comment-item u-f" v-for="(item,index) in commentData.records" :key='index' v-if="commentData.total && commentData.total != 0">
				<view class="avatar-box">
					<image :src="item.createByAvatar" mode="aspectFill"></image>
				</view>
				<view class="right-comment-box u-f1">
					<view class="name-praise-box u-f-ac">
						<view class="name u-f1">
							<view class="hiddenEllipsisNowrap" style="width: 470rpx;">
								{{ item.createByName }}
							</view>
						</view>
						<!-- 未点赞 -->
						<view class="praise u-f u-f-ajc" @tap.stop='handlePraise(item)' v-if="item.ifThumbsUp==0"
							style="flex-direction: column;">
							<image :src="$ossUrl('icon_debate_praise_gray.png')"></image>
							<text>{{ $isEmpty(item.thumbNum) ? 0 : item.thumbNum }}</text>
						</view>
						<!-- 已点赞 -->
						<view class="praise u-f u-f-ajc" @tap.stop='handlePraise(item)' v-else
							style="flex-direction: column;">
							<image :src="$ossUrl('icon_debate_praise_orange.png')"></image>
							<text>{{ $isEmpty(item.thumbNum) ? 0 : item.thumbNum }}</text>
						</view>
					</view>
					<view class="comment-content" @tap="tapCommentFirst({id:item.commentId,name:item.createByName,type:'commentFirst'})">
						{{ $isEmpty(item.content) ? 0 : item.content }}
					</view>
			
					<view class="date-box">
						{{ gettime(item.createTime) }}
						<text @tap="tapCommentFirst({id:item.commentId,name:item.createByName,type:'commentFirst'})">回复</text>
					</view>
					<!-- 回复内容 -->
					<view class="reply-box u-f" v-for="(item2,i2) in item.replyVO.records" :key='i2'>
						<view class="avatar-box">
							<image :src="$isEmpty(item2.createAvatar) ? '' : item2.createAvatar"></image>
						</view>
						<view class="right-reply-box u-f1">
							<view class="name-praise-box u-f-ac">
								<view class="name u-f1">
									<view class="hiddenEllipsisNowrap" style="width: 398rpx;">
										{{ $isEmpty(item2.createByName) ? '' : item2.createByName }}
									</view>
								</view>
							</view>
							<view class="reply-comment" v-if="item2.rankingCommentId === item.commentId" @tap="tapCommentSecond({id:item2.commentId,name:item2.createByName,type:'commentSecond'})">
								{{ $isEmpty(item2.content) ? '' : item2.content }}
							</view>
							<view class="" v-else style="width: 460rpx;word-break:break-all;">
								<text @tap="tapCommentSecond({id:item2.commentId,name:item2.createByName,type:'commentSecond'})">回复
								</text>
								<text style="color: #999999;">
									{{ $isEmpty(item2.replyName) ? '' : item2.replyName }} </text>
								<text>：</text>
								{{ $isEmpty(item2.content) ? '' : item2.content }}
							</view>
							<view class="reply-date-box">
								{{ gettime(item2.createTime) }}
								<text @tap="tapCommentSecond({id:item2.commentId,name:item2.createByName,type:'commentSecond'})">回复</text>
							</view>
						</view>
					</view>
					<!-- 展开更多 -->
					<view class="show-more-box u-f-ac" v-if="item.replyVO.total >5 && item.replyVO.current<item.replyVO.pages" @tap='handleShowMore(item)'>
						<view class="more-box u-f-ajc">
							<image :src="$ossUrl('icon_debate_more.png')" class="img-more"></image>
						</view>
						<text>展开{{ $isEmpty(item.replyVO.numberRemaining) ? 0 : item.replyVO.numberRemaining }}条回复</text>
						<image :src="$ossUrl('icon_debate_show.png')" class="img-show"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 加载更多 -->
		<view class="load-more">
			<uni-load-more :contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: '没有更多了'}"
				:iconSize='18' v-if="commentData.records.length>0" :status="allCommentStatus">
			</uni-load-more>
		</view>
		<!-- 背景蒙层 -->
		<view :class="{inpBg:isShowBg}" @tap.stop="closeBg" @touchmove.prevent></view>
		<!-- 底部发布评论部分 -->
		<view class="publishCommentBox" :class="{safebox:!isShowBg}">
			<view class="inpBox">
				<input @tap="tapInput({type:'commentDetails'})" @blur="inpBlur" ref='inputFocus' v-model="input1"
					class="uni-input" :style="adjustStyle" placeholder-class='placeholderStyle' :placeholder="placeholder" />
			</view>
			<view class="sendbox u-f-ajc" :class="{'activesend':input1.trim().length==0?false:true}" v-show="isShowBg"
				@tap.stop="sendbtn">
				发送
			</view>
		</view>
	</view>
</template>

<script>
	let u = navigator.userAgent;
	let isAndroid = u.indexOf('Android') > -1; //安卓终端
	let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import { gettime } from "@/common/time.js"
	
	export default {
		components:{
			uniNavBar,
			uniLoadMore
		},
		data() {
			return {
				adjustStyle: {},
				
				activeCurrent: 0,
				tabs: [ { index: 0, tab: '全部' }, { index: 1, tab: '最热' } ],
				tk: null,
				commentData: {
					records: [],
				},
				isShowBg: false, //输入框背景
				input1: "",
				placeholder: "说点儿什么吧~",
				id: null, // 政策通详情ID
				contentD: null, //评论内容
				msgType: null, //传给移动端的type值
				commentId: '', //被点击的评论id
				replyVOCurrent: 1, //回复数据的当前页
				maxId: '',
				parId: null, //被回复的评论
				
				sortType: '', //1- 按顶级评论回复量降序    2-按顶评分降序  3-时间+内容+评分  4-点赞数    默认时间倒序
				
				allCommentStatus: 'more',
			};
		},
		onLoad(opt) {
			window.androidRst = this.androidRst
			window.getIosToken = this.getIosToken
			
			this.id = opt.id
			
			// 本地方法
			// this.getCommentList() //评论列表
			
			// 原生方法
			this.handleToken('getCommentList')
		},
		methods:{
			gettime,
			changeTab(index){
				this.activeCurrent = index
				if(this.activeCurrent == 1){
					this.sortType = 4
					this.getCommentList()
				} else {
					this.sortType = ''
					this.getCommentList()
				}
			},
			// 左侧按钮点击时触发
			handleClickLeft(){
				console.log('back up page...')
				uni.navigateBack({
				    delta: 1,
				    animationType: 'pop-out',
				    animationDuration: 2000
				});
			},
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
			// 安卓的回调
			androidRst(res) {
				this.tk = res.token
				if (res.resultType == "commentDetails") {
					this.comDetail()
				} else if (res.resultType == "commentFirst") {
					this.comFirst()
				} else if (res.resultType == "commentSecond") {
					this.comSecond()
				} else if (res.resultType == "showMore") {
					this.showMore()
				} else if (res.resultType == "getCommentList") {
					this.getCommentList()
				}
			},
			// ios的回调
			getIosToken(res) {
				this.tk = res.token
				if (res.type == "commentDetails") {
					this.comDetail()
				} else if (res.type == "commentFirst") {
					this.comFirst()
				} else if (res.type == "commentSecond") {
					this.comSecond()
				} else if (res.type == "showMore") {
					this.showMore()
				} else if (res.type == "getCommentList") {
					this.getCommentList()
				}
			},
			// 评论列表
			getCommentList() {
				uni.request({
					header: {
						// "Authorization": 'Bearer ' + '54e4df6e-c997-4b23-a8da-af3ed8123784'
						"Authorization": 'Bearer ' + this.tk
					},
					url: 'api/cms/common_comment/page',
					data: {
						dataId: this.id, //数据ID
						type: 7, // // 1-官方发布 2-热门新闻 3-游记  4-热议 7-政策通
						current: 1, //当前页
						maxId: '',
						
						sortType: this.sortType, // 1- 按顶级评论回复量降序    2-按顶评分降序  3-时间+内容+评分  4-点赞数    默认时间倒序
					},
					success: (res) => {
						console.log('咨询列表...', res)
						this.commentData = res.data.data.data
						this.maxId = res.data.data.data.maxId
						if (this.commentData.pages == 1) {
							this.allCommentStatus = 'noMore'
						}
					}
				})
			},
			// 评论详情
			comDetail() {
				let that = this
				if (this.contentD.trim().length == 0) {
					this.input1 = ''
					return uni.showToast({
						title: '内容不能为空',
						duration: 1500,
						icon: "none",
					});
				}
				// if(this.vipState === null){ // 游客模式
				// 	uni.showToast({
				// 		title: '登录后可留言',
				// 		icon: 'none',
				// 		duration: 3000,
				// 	});
				// 	setTimeout(()=>{ // 3S后去登录页
				// 		if (isAndroid) {
				// 			return window.android.invoke_native("goLogin", null, "androidRst")
				// 		} else if (isIOS) {
				// 			return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
				// 		}
				// 	}, 3000)
				// 	return
				// }
				uni.request({
					url: 'api/cms/common_comment/create',
					header: {
						// "Authorization": 'Bearer ' + '54e4df6e-c997-4b23-a8da-af3ed8123784'
						"Authorization": 'Bearer ' + this.tk
					},
					method: "POST",
					data: {
						content: this.contentD, //评论内容
						dataId: this.id, //数据ID
						type: 7, //数据类型 1-官方发布 2-热门新闻 7-政策通
					},
					success: (res) => {
						if(res.data.data.businessCode == 1000){
							uni.showToast({
								title: '您已发布评论',
								duration: 1500,
								icon: "none",
							});
							this.getCommentList() // 刷新评论列表
							// handleToken('getCommentList')
						}
					}
				})
			},
			// 一级评论回复
			comFirst() {
				let that = this
				if (this.contentD.trim().length == 0) {
					this.input1 = ''
					return uni.showToast({
						title: '内容不能为空',
						duration: 1500,
						icon: "none",
					});
				}
				// if(this.vipState === null){ // 游客模式
				// 	uni.showToast({
				// 		title: '登录后可留言',
				// 		icon: 'none',
				// 		duration: 3000,
				// 	});
				// 	setTimeout(()=>{ // 3S后去登录页
				// 		if (isAndroid) {
				// 			return window.android.invoke_native("goLogin", null, "androidRst")
				// 		} else if (isIOS) {
				// 			return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
				// 		}
				// 	}, 3000)
				// 	return
				// }
				uni.request({
					url: '/api/cms/common_comment/reply',
					header: {
						// "Authorization": 'Bearer ' + '54e4df6e-c997-4b23-a8da-af3ed8123784'
						"Authorization": 'Bearer ' + this.tk
					},
					method: "POST",
					data: {
						content: this.contentD, //评论内容
						commentId: this.commentId, //评论ID
					},
					success:(res)=>{
						if(res.data.data.businessCode == 1000){
							uni.showToast({
								title: '您已发布评论',
								duration: 1500,
								icon: "none",
							});
							this.getCommentList() // 刷新评论列表
							// handleToken('getCommentList')
						}
					}
				})
			},
			// 二级评论回复
			comSecond() {
				let that = this
				if (this.contentD.trim().length == 0) {
					this.input1 = ''
					return uni.showToast({
						title: '内容不能为空',
						duration: 1500,
						icon: "none",
					});
				}
				// if(this.vipState === null){ // 游客模式
				// 	uni.showToast({
				// 		title: '登录后可留言',
				// 		icon: 'none',
				// 		duration: 3000,
				// 	});
				// 	setTimeout(()=>{ // 3S后去登录页
				// 		if (isAndroid) {
				// 			return window.android.invoke_native("goLogin", null, "androidRst")
				// 		} else if (isIOS) {
				// 			return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
				// 		}
				// 	}, 3000)
				// 	return
				// }
				uni.request({
					url: '/api/cms/common_comment/reply',
					header: {
						// "Authorization": 'Bearer ' + '54e4df6e-c997-4b23-a8da-af3ed8123784'
						"Authorization": 'Bearer ' + this.tk
					},
					method: "POST",
					data: {
						content: this.contentD, //评论内容
						commentId: this.commentId, //评论ID
					},
					success: (res) => {
						if(res.data.data.businessCode == 1000){
							uni.showToast({
								title: '您已发布评论',
								duration: 1500,
								icon: "none",
							});
							this.getCommentList() // 刷新评论列表
							// handleToken('getCommentList')
						}
					}
			
				})
			},
			// 关闭背景
			closeBg(){
				this.input1 = ''
				this.placeholder = '说点儿什么吧~'
				this.isShowBg = false
				this.$refs.inputFocus.focus = false
			},
			tapInput(opt){
				this.adjustStyle = {
					marginRight: 0
				}
				
				this.msgType = opt.type
				this.isShowBg = true
				this.$nextTick(function() {
					this.$refs.inputFocus.focus = true
				})
				
				// if (isIOS) return false
				// const query = uni.createSelectorQuery().in(this);
				// query.select('.commentBar').boundingClientRect(data => {
				// 	// 此处滑动到评论区域
				// 	uni.pageScrollTo({
				// 		scrollTop: data.top + this.scrollTop,
				// 		duration: 0
				// 	});
				// }).exec();
			},
			inpBlur(){
				this.adjustStyle = {
					margin: '0 28rpx'
				}
				
				// 输入框失焦时将值交给contentD
				this.contentD = this.input1
				// this.input1 = ''
				this.$refs.inputFocus.focus = false
			},
			
			sendbtn(){
				// this.comDetail() // 本地评论详情
				// this.comFirst() // 本地一级评论
				// this.comSecond() // 本地二级评论
				this.handleToken(this.msgType) // 原生评论
				this.isShowBg = false
				this.input1 = ''
				this.placeholder = '说点儿什么吧~'
			},
			// 点击一级评论
			tapCommentFirst(opt) {
				this.placeholder = '回复 @' + opt.name
				this.msgType = opt.type
				this.commentId = opt.id
				this.isShowBg = true
				this.$refs.inputFocus.focus = true
			},
			// 点击二级评论
			tapCommentSecond(opt) {
				this.placeholder = '回复 @' + opt.name
				this.msgType = opt.type
				this.commentId = opt.id
				this.isShowBg = true
				this.$refs.inputFocus.focus = true
			},
			// 展开更多
			handleShowMore(queryItem) {
				this.maxId = queryItem.replyVO.maxId
				this.replyVOCurrent = queryItem.replyVO.current
				this.parId = queryItem.commentId
				// this.handleToken('showMore')
				this.showMore()
			},
			// 展开更多回复
			showMore() {
				this.replyVOCurrent += 1
				let that = this;
				uni.request({
					url: '/api/cms/common_comment/reply_page',
					header: {
						// "Authorization": 'Bearer ' + '54e4df6e-c997-4b23-a8da-af3ed8123784'
						"Authorization": 'Bearer ' + that.tk
					},
					data: {
						commentId: that.parId, //评论ID
						size: 5,
						current: that.replyVOCurrent,
						maxId: that.maxId
					},
					complete: (res) => {
						// uni.showToast({
						// 	title: JSON.stringify(res),
						// 	duration: 20000,
						// 	icon: "none",
						// });
						if (res.statusCode == 200) {
							if (res.data.code !== 0) {
								return uni.showToast({
									title: '获取信息失败',
									duration: 1500,
									icon: "none",
								});
							}
							that.replyVOCurrent = res.data.data.data.current
							that.commentData.records.forEach((item, i) => {
								if (item.commentId == that.parId) {
									item.replyVO.current = res.data.data.data.current
									item.replyVO.numberRemaining = res.data.data.data.numberRemaining
									item.replyVO.records = item.replyVO.records.concat(res.data.data
										.data.records)
								}
							})
						} else if (res.statusCode == 401) {
							if (!this.tk) {
								if (isAndroid) {
									return window.android.invoke_native("goLogin", null, "androidRst")
								} else if (isIOS) {
									return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
								}
							}
						} else {
							uni.showToast({
								title: '请检查您的网路状态',
								duration: 1500,
								icon: "none",
							});
						}
					},
				})
			},
			// 评论点赞
			handlePraise(item) {
				// if(this.vipState === null){ // 游客模式 点赞去登录
				// 	uni.showToast({
				// 		title: '登录后可点赞',
				// 		icon: 'none',
				// 		duration: 3000,
				// 	});
				// 	setTimeout(()=>{ // 3S后去登录页
				// 		if (isAndroid) {
				// 			return window.android.invoke_native("goLogin", null, "androidRst")
				// 		} else if (isIOS) {
				// 			return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
				// 		}
				// 	}, 3000)
				// 	return
				// }
				// 普通、会员模式
				if (item.ifThumbsUp == 0) { //未点赞
					uni.request({
						header: {
							// "Authorization": 'Bearer ' + '54e4df6e-c997-4b23-a8da-af3ed8123784'
							"Authorization": 'Bearer ' + this.tk
						},
						url: '/api/cms/thumbs_up/create',
						method: "POST",
						data: {
							type: 2, //点赞类型(1: 游记点赞, 2: 评论点赞, 3: 热议点赞, 4: 热门新闻资讯点赞,  5: 官方发布资讯点赞)
							dataId: item.commentId
						},
						success: (res) => {
							if (res.data.code == 0) {
								item.ifThumbsUp = 1
								item.thumbNum += 1
							}
						}
					})
				} else if (item.ifThumbsUp == 1) { //已点赞
					uni.request({
						header: {
							// "Authorization": 'Bearer ' + '54e4df6e-c997-4b23-a8da-af3ed8123784'
							"Authorization": 'Bearer ' + this.tk
						},
						url: '/api/cms/thumbs_up/cancel',
						method: "POST",
						data: {
							type: 2,
							dataId: item.commentId
						},
						success: (res) => {
							if (res.data.code == 0) {
								item.ifThumbsUp = 0
								item.thumbNum -= 1
							}
						}
					})
				}
			},
		},
		onReachBottom(){
			console.log('触底..')
			if (this.commentData.current < this.commentData.pages) {
				this.allCommentStatus = 'loading'
				uni.request({
					url: 'api/cms/common_comment/page',
					header: {
						// "Authorization": 'Bearer ' + '54e4df6e-c997-4b23-a8da-af3ed8123784'
						"Authorization": 'Bearer ' + this.tk
					},
					data: {
						dataId: this.id, //数据ID
						current: this.commentData.current += 1, //当前页
						type: 7, // 1-官方发布 2-热门新闻 3-游记  4-热议 7-政策通
						maxId: this.maxId
					},
					success: (res) => {
						console.log('list..', res)
						if (res.data.code !== 0) {
							return uni.showToast({
								title: '获取信息失败',
								duration: 1500,
								icon: "none",
							});
						}
						this.commentData.current = res.data.data.data.current
						if (this.commentData.current < this.commentData.pages) {
							this.allCommentStatus = 'more'
						} else {
							this.allCommentStatus = 'noMore'
						}
						this.commentData.records = this.commentData.records.concat(res.data.data.data.records)
					}
				})
			} else {
				this.allCommentStatus = 'noMore'
			}
		},
	}
</script>

<style lang="scss">
	page{
		height: 100vh;
	}
	.all-comment{
		padding-bottom: 128rpx;
		@extend %safe-bottom-box;
		// tabs切换部分
		.tabs-list{
			position: fixed;
			top: 80rpx;
			left: 0;
			z-index: 999;
			padding-left: 60rpx;
			width: 100%;
			height: 108rpx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			
			.tab-item{
				margin-right: 120rpx;
				color: #5F5F5F;
				line-height: 50rpx;
				font-size: 32rpx;
				position: relative;
				
			}
			.active-tab{
				color: #272727;
				font-weight: 500;
				font-size: 36rpx;
				&:before {
					content: '';
					width: 20rpx;
					height: 6rpx;
					background-color: #415BFD;
					border-radius: 10rpx;
					position: absolute;
					bottom: -26rpx;
					left: calc(50% - 10rpx);
				}
			}
		}
		
		// 评论块
		.comment-item{
			padding: 24rpx 0rpx 36rpx 0rpx;
			border-bottom: 2rpx solid #F6F6F6;
			.avatar-box{
				width: 64rpx;
				height: 64rpx;
				margin-right: 16rpx;
				>image{
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
				}
			}
			.right-comment-box{
				.name-praise-box{
					height: 64rpx;
					.name{
						font-size: 28rpx;
						color: #5F5F5F;
					}
					.praise{
						>image{
							width: 24rpx;
							height: 24rpx;
						}
						>text{
							color: #999999;
							font-size: 22rpx;
						}
					}
				}
				.comment-content{
					width: 530rpx;
					color: #272727;
					font-size: 28rpx;
				}
				
				.date-box{
					padding-top: 16rpx;
					color: #999999;
					font-size: 24rpx;
					>text{
						color: #2B579F;
						padding-left: 16rpx;
					}
				}
				.reply-box{
					padding-top: 24rpx;
					.avatar-box{
						width: 56rpx;
						height: 56rpx;
						>image{
							width: 56rpx;
							height: 56rpx;
							border-radius: 50%;
						}
					}
					.right-reply-box{
						.name-praise-box{
							height: 56rpx;
						}
						.reply-comment{
							width: 460rpx;
							padding-top: 6rpx;
						}
						.reply-date-box{
							padding-top: 16rpx;
							color: #999999;
							font-size: 24rpx;
							>text{
								color: #2B579F;
								padding-left: 16rpx;
							}
						}
					}
				}
				.show-more-box{
					.more-box{
						width: 44rpx;
						height: 44rpx;
						background-color: #F5F7F8;
						border-radius: 50%;
					}
					padding-top: 30rpx;
					.img-more{
						width: 24rpx;
						height: 24rpx;
					}
					>text{
						padding: 0 10rpx 0 20rpx;
						color: #2B579F;
					}
					.img-show{
						width: 44rpx;
						height: 44rpx;
					}
				}
			}
		}
		.inpBg {
			background-color: rgba(0, 0, 0, 0.10);
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			top: 0;
		}
		.publishCommentBox {
			background: #FFFFFF;
			padding: 24rpx 0;
			width: 100%;
			box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.24);
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			&.safebox {
				// @extend %safe-bottom-box;/* iphonex 等安全区设置，底部安全区适配 */
				/* #ifndef APP-NVUE */
				padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
				padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
				/* #endif */
			}
			.inpBox {
				// flex: 2;
				flex: 1;
				display: flex;
				align-items: center;
				// padding: 0 28rpx;
				.uni-input {
					box-sizing: border-box;
					// margin-left: 28rpx;
					margin: 0 28rpx;
					width: 100%;
					height: 80rpx;
					background-color: #F9F9F9;
					border-radius: 160rpx;
					padding: 0 30rpx;
				}
				.placeholderStyle {
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
				}
			}
			.sendbox {
				width: 120rpx;
				font-size: 32rpx;
			}
			.activesend {
				color: #1676FF;
			}
		}
	}
	
</style>
