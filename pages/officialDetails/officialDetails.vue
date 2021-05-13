<template>
	<!-- 热门咨询详情 -->
	<view class="comment">
		<!-- 详情内容 -->
		<view class="detail-box" v-if="detail">
			<view class="title">{{detail.officialNewsName}}</view>
			<view class="publish-time">发布时间：{{ gettime(detail.createTime) }}</view>
			<jyf-parser class="parser" :html="detail.officialNewsContent" :tag-style="tagStyle" lazy-load></jyf-parser>
			<view class="browse-num">帖子浏览数：{{detail.browseNum}}</view>
		</view>
		<view class="noData" v-if="!detail">
			暂无数据
		</view>

		<view class="hr"></view>

		<!-- 评论部分 -->
		<view class="comment-box">
			<view class="commentBar">
				<view class="commentBar-item">
					<text class="commentTitle">全部评论</text><text>({{commentData.total}})</text>
				</view>
			</view>

			<view class="commentBody" v-if="!commentData.total==0">

				<view class="first-comment" v-for="(item,i) in commentData.records" :key='i'>
					<!-- 一级评论 -->
					<view @tap="tapCommentFirst({id:item.commentId,name:item.createByName,type:'commentFirst'})">
						<view class="first-comment-top">
							<view class="imgBox">
								<image :src="item.createByAvatar"></image>
							</view>
							<view class="name-time">
								<view class="name">
									{{item.createByName}}
								</view>
								<view class="time">
									{{ gettime(item.createTime) }}
								</view>
							</view>
							<view class="zan" v-if="item.ifThumbsUp==0" @tap.stop='handlePraise(item)'>
								<image src="../../static/icon-small-praise.png"></image>
								<text>{{item.thumbNum}}</text>
							</view>
							<view class="zan-selected" v-else-if="item.ifThumbsUp==1" @tap.stop='handlePraise(item)'>
								<image src="../../static/icon-small-praise-selected.png"></image>
								<text>{{item.thumbNum}}</text>
							</view>
						</view>
						<text space="nbsp" class="first-comment-bottom">
							{{item.content}}
						</text>
					</view>

					<!-- 二级评论 -->
					<view @tap="tapCommentSecond({id:item2.commentId,name:item2.createByName,type:'commentSecond'})" class="second-comment" v-for="(item2,i2) in item.replyVO.records"
					 :key='i2'>
						<view class="second-comment-avatar">
							<image :src="item2.createAvatar"></image>
						</view>
						<view class="second-comment-content">
							<view class="name">
								{{item2.createByName}}
							</view>
							<!-- 判断二级评论的父级id是否与自己的id相等,为true即回复的父级，false则回复的自己 -->
							<view class="text" v-if="item2.rankingCommentId===item.commentId">
								{{item2.content}}
							</view>
							<view class="text" v-else>
								<text space="nbsp"> 回复 </text><text style="color: #888888;" space="nbsp">{{item2.replyName}} :</text>
								{{item2.content}}
							</view>
							<view class="time">
								{{gettime(item2.createTime)}}
							</view>
						</view>
					</view>
					<!-- 展开更多 -->
					<view v-if="item.replyVO.total >5 && item.replyVO.current<item.replyVO.pages" class="more" @tap='handleShowMore(item)'>
						展开{{item.replyVO.numberRemaining}}条回复
					</view>
				</view>
			</view>

			<view v-else class="noContent">
				<image src="../../static/pic-no-comments.png"></image>
				<view>
					暂无评论
				</view>
			</view>

			<!-- 加载更多 -->
			<view class="load-more">
				 <uni-load-more :contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: '没有更多了'}" :iconSize='18' v-if="commentData.records.length>0" :status="pinglunPageStatus">
				 </uni-load-more>
			</view>
		</view>

		<!-- 背景蒙层 -->
		<view :class="{inpBg:isShowBg}" @tap="closeBg"></view>
		<!-- 底部发布评论部分 -->
		<view class="publishCommentBox" :class="{safebox:!isShowBg}">
			<view class="inpBox">
				<input @tap="tapInput({type:'commentDetails'})" @blur="inpBlur" ref='inputFocus' v-model="input1" class="uni-input"
				 placeholder-class='placeholderStyle' :placeholder="placeholder" />
			</view>
			<view class="zan-pinglun" v-show="!isShowBg">
				<view @tap='bottomGood()'>
					<image :src="detail.isLike?'../../static/icon-big-praise-selected.png':'../../static/icon-big-praise.png'" class="img"></image>
					<text>{{detail.likesNum}}</text>
				</view>
				<view @tap="tapInput({type:'commentDetails'})">
					<image src="../../static/pinglun.png" class="img"></image>
					<text>{{commentData.total}}</text>
				</view>
			</view>
			<view class="sendbox" :class="{'activesend':input1.trim().length==0?false:true}" v-show="isShowBg" @tap.stop="sendbtn">
				发送
			</view>
		</view>

	</view>
</template>

<script>
	let u = navigator.userAgent;
	let isAndroid = u.indexOf('Android') > -1; //安卓终端
	let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

	import jyfParser from "@/components/jyf-Parser/jyf-parser";
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import {
		gettime
	} from "@/common/time.js"
	export default {
		components: {
			jyfParser,
			uniLoadMore
		},
		data() {
			return {
				isShowBg: false, //输入框背景
				input1: '',
				msgType: null, //传给移动端的type值
				safebox: {},
				tagStyle: {
					body: 'line-height: 1.8;',
					img: 'background-size: contain|cover;width:100%;height:auto;'
				},
				id: null, //资讯id
				detail: {},
				//评论列表
				commentData: {
					records: []
				},
				comment: '',
				commentId: '', //被回复的评论id
				pinglunPageStatus: 'more', //加载更多评论显示效果
				promise: null,
				tk: null,
				contentD: null, //评论内容
				replyVOCurrent: 1, //回复数据的当前页
				parId: null, //被回复的评论
				
				placeholder: '说点儿什么吧~'
			};
		},
		onLoad(option) {
			// androidRst getToken 方法挂window上
			window.androidRst = this.androidRst
			window.getIosToken = this.getIosToken
			this.id = option.id
			// this.handleToken('')//此处进详情便获取一次token值
			// this.getConsultDetail()
			// this.getCommentList()
			this.handleToken('getDetail')
			this.handleToken('getList')
		},
		onReachBottom() {
			if (this.commentData.current < this.commentData.pages) {
				this.pinglunPageStatus = 'loading'
				uni.request({
					url: '/api/cms/common_comment/page',
					data: {
						dataId: this.id, //数据ID
						current: this.commentData.current += 1, //当前页
						type: 1,
						maxId: this.maxId
					},
					success: (res) => {
						if (res.data.code !== 0) {
							return uni.showToast({
								title: '获取评论列表失败',
								duration: 1500,
								icon: "none",
							});
						}
						
						this.commentData.current = res.data.data.data.current
						if (this.commentData.current < this.commentData.pages) {
							this.pinglunPageStatus = 'more'
						} else {
							this.pinglunPageStatus = 'noMore'
						}
						this.commentData.records = this.commentData.records.concat(res.data.data.data.records)
					}
				})
			}else{
				this.pinglunPageStatus = 'noMore'
			}
		},
		methods: {
			getContent(content){
				return content.replace(new RegExp(/\t/g), "&nbsp;&nbsp;&nbsp;").replace(new RegExp(/ /g), "&nbsp;")
			},
			getConsultDetail() {
				// uni.showToast({
				// 	title: 'token:' + this.tk,//null
				// 	icon: 'none',
				// 	duration: 3000
				// });
				// 获取咨询详情
				uni.request({
					header: {
						// "Authorization": 'Bearer ' + 'dee062e6-3bfe-40df-8225-7ffd784762d7'
						"Authorization": 'Bearer ' + this.tk
					},
					url: '/api/cms/open/official_details',
					data: {
						officialNewsId: this.id
					},
					success: (res) => {
						// uni.showToast({
						// 	title: JSON.stringify(res),
						// 	icon: 'none'
						// });
						if (res.data.code !== 0) {
							uni.redirectTo({
								url: '../404/404'
							});
						}
						this.detail = res.data.data.data
					}
				});
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
				uni.request({
					url: '/api/cms/common_comment/create',
					header: {
						// "Authorization": 'Bearer ' + 'dee062e6-3bfe-40df-8225-7ffd784762d7'
						"Authorization": 'Bearer ' + this.tk
					},
					method: "POST",
					data: {
						content: this.contentD, //评论内容
						dataId: this.id, //数据ID
						type: 1, //数据类型 1-官方发布 2-热门新闻
					},
					complete: (res) => {
						// uni.showToast({
						// 	title: JSON.stringify(res),
						// 	duration: 20000,
						// 	icon: "none",
						// });
						if (res.statusCode == 200) {
							if (res.data.code != 0) {
								return uni.showToast({
									title: '评论发布失败',
									duration: 1500,
									icon: "none",
								});
							}
							uni.showToast({
								title: '您已发布评论',
								duration: 1500,
								icon: "none",
							});

							// 刷新评论
							that.getCommentList()
						} else if (res.statusCode == 401) {
							uni.showToast({
								title: '请先登录',
								duration: 1500,
								icon: "none",
							});
							this.input1 = ''
							this.isShowBg = false
							setTimeout(() => {
								return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
							}, 1500)

						} else {
							uni.showToast({
								title: '请检查您的网络',
								duration: 1500,
								icon: "none",
							});
						}
					},
				})
			},
			// 一级回复
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
				uni.request({
					url: '/api/cms/common_comment/reply',
					header: {
						// "Authorization": 'Bearer ' + '7b9bb3b6-2f7c-4aff-9275-1f9ec2c83d84'
						"Authorization": 'Bearer ' + this.tk
					},
					method: "POST",
					data: {
						content: this.contentD, //评论内容
						commentId: this.commentId, //评论ID
					},
					complete: (res) => {
						// uni.showToast({
						// 	title: JSON.stringify(res),
						// 	duration: 20000,
						// 	icon: "none",
						// });

						if (res.statusCode == 200) {
							if (res.data.code != 0) {
								return uni.showToast({
									title: '你的回复发布失败',
									duration: 1500,
									icon: "none",
								});
							}
							uni.showToast({
								title: '你的回复发布成功',
								duration: 1500,
								icon: "none",
							});
							// 刷新评论
							that.getCommentList()
						} else if (res.statusCode == 401) {
							return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
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
			// 二级回复
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
				uni.request({
					url: '/api/cms/common_comment/reply',
					header: {
						// "Authorization": 'Bearer ' + 'd472cd38-924b-4466-bab6-77d58dc722f7'
						"Authorization": 'Bearer ' + this.tk
					},
					method: "POST",
					data: {
						content: this.contentD, //评论内容
						commentId: this.commentId, //评论ID
					},
					complete: (res) => {
						// uni.showToast({
						// 	title: JSON.stringify(res),
						// 	duration: 20000,
						// 	icon: "none",
						// });

						if (res.statusCode == 200) {
							if (res.data.code != 0) {
								return uni.showToast({
									title: '你的回复发布失败',
									duration: 1500,
									icon: "none",
								});
							}
							uni.showToast({
								title: '你的回复发布成功',
								duration: 1500,
								icon: "none",
							});
							// 刷新评论
							that.getCommentList()
						} else if (res.statusCode == 401) {
							return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
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
			gettime,
			// 获取更多
			showMore() {
				this.replyVOCurrent += 1
				let that = this;
				uni.request({
					url: '/api/cms/common_comment/reply_page',
					header: {
						// "Authorization": 'Bearer ' + '7b9bb3b6-2f7c-4aff-9275-1f9ec2c83d84'
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
									title: '获取更多回复失败',
									duration: 1500,
									icon: "none",
								});
							}
							that.replyVOCurrent = res.data.data.data.current
							that.commentData.records.forEach((item, i) => {
								if (item.commentId == that.parId) {
									item.replyVO.current = res.data.data.data.current
									item.replyVO.records = item.replyVO.records.concat(res.data.data.data.records)
								}
							})
						} else if (res.statusCode == 401) {
							return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
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
			// 获取token
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
				// uni.showToast({
				// 	title: 'token:' + res.token + 'type:' + res.resultType,
				// 	icon: 'none'
				// });
				this.tk = res.token
				if (res.resultType == "commentDetails") {
					this.comDetail()
				} else if (res.resultType == "commentFirst") {
					this.comFirst()
				} else if (res.resultType == "commentSecond") {
					this.comSecond()
				} else if (res.resultType == "showMore") {
					this.showMore()
				}
				else if (res.resultType == "getList") {
					this.getCommentList()
				} else if (res.resultType == 'getDetail') {
					this.getConsultDetail()
				} else if (res.resultType == 'praiseDetail') {
					this.praiseDetail()
				}
			},
			// ios的回调
			getIosToken(res) {
				// uni.showToast({
				// 	title: 'token:' + res.token + 'type:' + res.type,
				// 	icon: 'none',
				// 	duration: 3000
				// });
				// token存本地
				// uni.setStorageSync('myToken', res.token);
				this.tk = res.token
				if (res.type == "commentDetails") {
					this.comDetail()
				} else if (res.type == "commentFirst") {
					this.comFirst()
				} else if (res.type == "commentSecond") {
					this.comSecond()
				} else if (res.type == "showMore") {
					this.showMore()
				} else if (res.type == "getList") {
					this.getCommentList()
				} else if (res.type == 'getDetail') {
					this.getConsultDetail()
				} else if (res.type == 'praiseDetail') {
					this.praiseDetail()
				}
			},
			// 获取评论列表
			getCommentList() {
				// uni.showToast({
				// 	title: 'token:' + this.token,
				// 	icon: 'none',
				// 	duration: 3000
				// });
				uni.request({
					header: {
						// "Authorization": 'Bearer ' + '76b886ca-f4a9-4680-9fea-e97e4d73ac10'
						"Authorization": 'Bearer ' + this.tk
					},
					// url: '/api/cms/open/news_comment_page',
					url: '/api/cms/common_comment/page',
					data: {
						dataId: this.id, //数据ID
						type: 1, // // 1-官方发布 2-热门新闻 3-游记  4-热议
						current: 1, //当前页
						maxId: ''
					},
					success: (res) => {
						if (res.data.code !== 0) {
							return uni.showToast({
								title: '获取评论列表失败',
								duration: 1500,
								icon: "none",
							});
						}
						this.commentData = res.data.data.data
						this.maxId = res.data.data.data.maxId
						if(this.commentData.pages == 1){
							this.pinglunPageStatus = 'noMore'
						}
					}
				})
			},
			// 评论点赞
			handlePraise(item) {
				// 此处为为登录状态
				if (!this.tk) return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
				// 此处为已登录状态
				if (item.ifThumbsUp == 0) { //未点赞
					uni.request({
						header: {
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
			// 点击评论输入框
			tapInput(opt) {
				this.msgType = opt.type
				this.isShowBg = true
				this.$nextTick(function() {
					this.$refs.inputFocus.focus = true
				})
			},
			// 点击一级评论
			tapCommentFirst(opt) {
				this.placeholder = '回复 @' + opt.name
				this.msgType = opt.type
				// 获取评论id
				this.commentId = opt.id
				this.isShowBg = true
				this.$refs.inputFocus.focus = true
			},
			// 点击二级评论
			tapCommentSecond(opt) {
				this.placeholder = '回复 @' + opt.name
				this.msgType = opt.type
				// 获取评论id
				this.commentId = opt.id
				this.isShowBg = true
				this.$refs.inputFocus.focus = true
			},
			// 关闭背景
			closeBg() {
				this.placeholder = '说点儿什么吧~'
				this.isShowBg = false
				this.$refs.inputFocus.focus = false
			},
			// 失去焦点时触发
			inpBlur() {
				this.contentD = this.input1
				this.input1 = ''
				this.$refs.inputFocus.focus = false
			},
			// 发送
			sendbtn() {
				this.handleToken(this.msgType)
				this.isShowBg = false
				this.input1 = ''
			},
			praiseDetail() {
				// uni.showToast({
				// 	title: this.tk,
				// 	icon: 'none',
				// 	duration: 10000
				// });
				// 未登录状态下
				if(!this.tk) return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
				// 已登录状态下
				if (this.detail.isLike) { //已点赞
					uni.request({
						header: {
							"Authorization": 'Bearer ' + this.tk
						},
						url: '/api/cms/thumbs_up/cancel',
						method: "POST",
						data: {
							type: 5, // 1: 游记点赞, 2: 评论点赞, 3: 热议点赞, 4: 热门新闻资讯点赞,  5: 官方发布资讯点赞
							dataId: this.id
						},
						success: (res) => {
							uni.showToast({
								title: "已取消点赞",
								icon: 'none',
								duration: 2000
							});
							if (res.data.code == 0) {
								this.detail.isLike = false
								this.detail.likesNum -= 1
							}
						}
					})
				} else { //未点赞
					uni.request({
						header: {
							"Authorization": 'Bearer ' + this.tk
						},
						url: '/api/cms/thumbs_up/create',
						method: "POST",
						data: {
							type: 5,
							dataId: this.id
						},
						success: (res) => {
							uni.showToast({
								title: "点赞成功",
								icon: 'none',
								duration: 2000
							});
							if (res.data.code == 0) {
								this.detail.isLike = true
								this.detail.likesNum += 1
							}
						}
					})
				}
			},
			// 底部点赞
			bottomGood() {
				// this.handleToken('praiseDetail')
				this.praiseDetail()
			},
			// 展开更多
			handleShowMore(queryItem) {
				this.maxId = queryItem.replyVO.maxId
				this.replyVOCurrent = queryItem.replyVO.current
				this.parId = queryItem.commentId
				this.handleToken('showMore')
				// this.showMore()
			}
		},
		onPageScroll(e) {
			// uni.showToast({
			// 	title: JSON.stringify(e.scrollTop),
			// 	icon: 'none',
			// 	duration: 3000
			// });
			// 	this.input1 = ''
			// 	this.isShowBg = false
			// 	this.$refs.inputFocus.focus = false
		},
		onHide() {
			this.input1 = ''
			this.isShowBg = false
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
		height: 100%;
	}

	.comment {
		height: 100%;
	}

	.noData {
		height: 200rpx;
		font-size: 24rpx;
		color: #CCCCCC;
		text-align: center;
		line-height: 200rpx;
	}

	.detail-box {
		padding: 36rpx 32rpx 32rpx;

		.title {
			line-height: 52rpx;
			font-size: 36rpx;
			color: #333333;
			font-weight: bold;
		}

		.publish-time {
			margin-top: 20rpx;
			height: 34rpx;
			height: 34rpx;
			font-size: 24rpx;
			color: #999999;
		}

		.parser {
			margin-top: 48rpx;
		}

		.browse-num {
			margin-top: 64rpx;
			height: 34rpx;
			line-height: 34rpx;
			font-size: 24rpx;
			color: #999999;
		}
	}

	.hr {
		height: 16rpx;
		background: #F9F9F9;
	}

	.comment-box {
		padding: 32rpx 32rpx 100rpx 32rpx;
		@extend %safe-bottom-box;

		.commentBar {
			height: 70rpx;
			display: flex;

			.commentBar-item {
				.commentTitle {
					color: #1676FF !important;
					font-weight: 500;
					color: #333333;
					font-size: 32rpx;
					margin-right: 15rpx;
					position: relative;

					::after {
						content: '';
						width: 20rpx;
						height: 6rpx;
						position: absolute;
						bottom: -26rpx;
						left: 41%;
						background-color: #1676FF;
					}
				}
			}
		}

		.noContent {
			padding-top: 16rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
			text-align: center;

			>image {
				width: 280rpx;
				height: 180rpx;
			}

			>view {
				padding-top: 48rpx;
			}
		}

		.load-more {
			padding: 40rpx 0;
		}

		.commentBody {
			.first-comment:last-of-type {
				margin-bottom: 0;
			}

			// height: 100%;
			.first-comment {
				margin: 32rpx 0;
				padding-bottom: 32rpx;
				border-bottom: 2rpx solid #EDEDED;

				.first-comment-top {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;

					.imgBox {
						width: 76rpx;
						height: 76rpx;

						>image {
							width: 100%;
							height: 100%;
							border-radius: 100%;
						}
					}

					.name-time {
						flex: 1;
						display: flex;
						flex-direction: column;
						// justify-content: center;
						margin-left: 20rpx;

						.name {
							font-size: 28rpx;
							font-weight: 500;
							color: #333333;
						}

						.time {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;
							margin-top: 6rpx;
						}
					}

					.zan-selected {
						width: 100rpx;
						height: 48rpx;
						border: 2rpx solid #1676FF;
						border-radius: 40rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						>image {
							width: 28rpx;
							height: 28rpx;
							margin-right: 6rpx;
						}

						>text {
							width: 30rpx;
							font-size: 22rpx;
							font-weight: 400;
							color: #1676FF;
							text-align: center;
						}
					}

					.zan {
						width: 100rpx;
						height: 48rpx;
						border: 2rpx solid #EDEDED;
						border-radius: 40rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						>image {
							width: 28rpx;
							height: 28rpx;
							margin-right: 6rpx;
						}

						>text {
							width: 30rpx;
							font-size: 22rpx;
							font-weight: 400;
							color: #999999;
							text-align: center;
						}
					}
				}

				.first-comment-bottom {
					margin-top: 20rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;
				}

				.second-comment {
					margin-top: 32rpx;
					display: flex;
				}

				.second-comment-avatar {
					width: 48rpx;
					image {
						width: 48rpx;
						height: 48rpx;
						border-radius: 50%;
					}
				}

				.second-comment-content {
					margin-left: 16rpx;
					flex: 1;

					.name {
						font-size: 28rpx;
						font-weight: 500;
						color: #333333;
						height: 48rpx;
						line-height: 48rpx;
					}

					.text {
						font-size: 28rpx;
						font-weight: 400;
						line-height: 48rpx;
						color: #333333;
					}

					.time {
						font-size: 24rpx;
						font-weight: 400;
						line-height: 32rpx;
						color: #999999;
					}

				}

				.more {
					font-size: 28rpx;
					font-weight: 400;
					margin-top: 16rpx;
					color: #1676FF;
					margin-left: 66rpx;
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

	.safebox {
		// @extend %safe-bottom;
	}

	.publishCommentBox {
		background: #FFFFFF;
		height: 112rpx;
		width: 100%;
		box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.24);
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;

		.inpBox {
			flex: 2;
			display: flex;
			align-items: center;

			.uni-input {
				box-sizing: border-box;
				margin-left: 28rpx;
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
			line-height: 112rpx;
			text-align: center;
			font-size: 32rpx;
		}

		.activesend {
			color: #1676FF;
		}

		.zan-pinglun {
			flex: 1;
			display: flex;
			justify-content: space-evenly;
			align-items: center;

			>view {
				display: flex;
				flex-direction: column;
				align-items: center;

				.img {
					width: 48rpx;
					height: 48rpx;
				}

				>text {
					font-size: 20rpx;
					font-weight: 400;
					color: #999999;
				}
			}

		}
	}
</style>
