<template>
	<!-- 热门咨询详情 -->
	<view class="comment">
		<!-- 详情内容 -->
		<view class="detail-box" v-if="detail">
			<view class="title">{{detail.title}}</view>
			<view class="publish-time u-f u-f-jsb" v-if="detail.author"> 
				<view class="u-f-ac">
					<image v-if="detail.dataType=='1'" src="../../static/icon_detail_original_small.png" mode=""></image>
					<text style="color: #5F5F5F;" v-if="detail.dataType=='2'">{{ detail.author }}</text> 
					<text style="color: #5F5F5F;" v-else-if="detail.dataType=='1'">{{ detail.createByName }}</text> 
				</view>
				<text>{{ gettime(detail.createTime) }}</text>
			</view>
			<view class="publish-time" v-else>
				<text>{{ gettime(detail.createTime) }}</text>
			</view>
			<jyf-parser class="parser" :html="detail.content" :tag-style="tagStyle" lazy-load></jyf-parser>
			
			<!-- notice -->
			<view class="notice">
				<!-- 转载 -->
				<view v-if="detail.dataType=='2'">
					<!-- detail.author有无作者 -->
					<text v-if="detail.author && detail.newsSource">原文{{ `由${ detail.author }` }}发布于{{ detail.newsSource }}，</text>
					<text v-else-if="detail.author">原文{{ `由${ detail.author }` }}发布，</text> 
					<text v-else-if="detail.newsSource">原文发布于{{ detail.newsSource }}，</text> 
					<text v-else>本文</text>
					
					
					由{{ detail.createByName }}转载至超能平台，未经许可，禁止转载。内容、版权和其它问题，请在30日内与本平台联系，我们将在第一时间处理。
				</view>
				<!-- 原创 -->
				<view v-else-if="detail.dataType=='1'">
					本文由 <text style="color: #5F5F5F;">{{detail.createByName}}</text> 发布于超能平台，未经许可，禁止转载。
				</view>
			</view>
			
			<!-- <view class="tag-box" v-if="detail.labelList && detail.labelList.length>0">
				<view class="tag-item u-f-ajc" v-for="(item,index) in detail.labelList" :key='index' @tap="toTagPage(item.id)">
					{{item.name}}
				</view>
			</view> -->
			<view class="browse-num">帖子浏览数：{{detail.browseNum}}</view>
			<!-- <view class="recommend-box">
				<view class="recommend-box-title">
					相关推荐
				</view>
				<view class="recommend-list-box">
					<view class="recommend-item u-f-ac" v-for="(item,index) in recommendationList" :key='index' @tap="changeDetailsContent(item.officialNewsId)">
						<view class="recommend-content multiLineEllipsis u-f1">
							{{item.officialNewsName}}
						</view>
						<image :src="item.urlList ? item.urlList[0] : ''" mode=""></image>
					</view>
				</view>
			</view> -->
		</view>
		<view class="noData" v-if="!detail">
			<image src="../../static/pic_noDetails.png" mode=""></image>
			<view>暂无数据</view>
		</view>

		<!-- <view class="hr"></view> -->

		<!-- 评论部分 -->
		<view class="comment-box">
			<view class="commentBar">
				<view class="commentBar-item">
					<text class="commentTitle">评论</text><text>({{commentData.total}})</text>
				</view>
			</view>

			<view class="commentBody" v-if="!commentData.total==0">
				
				<view class="comment-item u-f" v-for="(item,i) in commentData.records" :key='i'>
					<view class="avatar-box">
						<image :src="item.createByAvatar" mode="aspectFill"></image>
					</view>
					<view class="right-comment-box u-f1">
						<view class="name-praise-box u-f-ac">
							<view class="name u-f1">
								<view class="hiddenEllipsisNowrap" style="width: 470rpx;">
									{{ $isEmpty(item.createByName) ? '' : item.createByName }}
								</view>
							</view>
							<view class="praise u-f u-f-ajc" @tap.stop='handlePraise(item)' v-if="item.ifThumbsUp==0" style="flex-direction: column;">
								<image :src="$ossUrl('icon_debate_praise_gray.png')"></image>
								<text>{{ $isEmpty(item.thumbNum) ? 0 : item.thumbNum }}</text>
							</view>
							<view class="praise u-f u-f-ajc" @tap.stop='handlePraise(item)' v-else style="flex-direction: column;">
								<image :src="$ossUrl('icon_debate_praise_orange.png')"></image>
								<text>{{ $isEmpty(item.thumbNum) ? 0 : item.thumbNum }}</text>
							</view>
						</view>
						<view class="comment-content" @tap="tapCommentFirst({id:item.commentId,name:item.createByName,type:'commentFirst'})">
							{{ $isEmpty(item.content) ? 0 : item.content }}
						</view>
						
						<view class="date-box">
							{{ gettime($isEmpty(item.createTime) ? '' : item.createTime) }}
							<text @tap="tapCommentFirst({id:item.commentId,name:item.createByName,type:'commentFirst'})">回复</text>
						</view>
						<!-- 回复内容 -->
						<view class="reply-box u-f" v-for="(item2,i2) in item.replyVO.records" :key='i2'>
							<view class="avatar-box">
								<image :src="item2.createAvatar"></image>
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
								<view class="" v-else>
									<text @tap="tapCommentSecond({id:item2.commentId,name:item2.createByName,type:'commentSecond'})">回复 </text>
									<text style="color: #999999;">
										{{ $isEmpty(item2.replyName) ? '' : item2.replyName }} </text>
									<text>：</text>
									{{ $isEmpty(item2.content) ? '' : item2.content }}
								</view>
								<view class="reply-date-box">
									{{ gettime($isEmpty(item2.createTime) ? '' : item2.createTime) }}
									<text @tap="tapCommentSecond({id:item2.commentId,name:item2.createByName,type:'commentSecond'})">回复</text>
								</view>
							</view>
						</view>
						<!-- 展开更多 -->
						<view @tap='handleShowMore(item)' class="show-more-box u-f-ac" v-if="item.replyVO.total >5 && item.replyVO.current<item.replyVO.pages">
							<view class="more-box u-f-ajc">
								<image :src="$ossUrl('icon_debate_more.png')" class="img-more"></image>
							</view>
							<text>展开{{ $isEmpty(item.replyVO.numberRemaining) ? 0 : item.replyVO.numberRemaining }}条回复</text>
							<image :src="$ossUrl('icon_debate_show.png')" class="img-show"></image>
						</view>
					</view>
				</view>
			</view>

			<view v-else class="noContent">
				<image src="../../static/pic_noComment.png"></image>
				<view>
					暂无评论内容
				</view>
			</view>

			<view class="load-more">
				 <uni-load-more :contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: '没有更多了'}" :iconSize='18' v-if="commentData.records.length>0" :status="pinglunPageStatus">
				 </uni-load-more>
			</view>
			<!-- <view class="" style="height: 100rpx;"></view> -->
		</view>
		
		<!-- 背景蒙层 -->
		<view :class="{inpBg:isShowBg}" @tap.stop="closeBg" @touchmove.prevent></view>
		<!-- 底部发布评论部分 -->
		<view class="publishCommentBox" :class="{safebox: !isShowBg}">
			<view class="inpBox">
				<input @focus='onFocus' @tap="tapInput({type:'commentDetails'})" @blur="inpBlur" ref='inputFocus' v-model="input1" class="uni-input"
				 placeholder-class='placeholderStyle' :placeholder="placeholder" />
			</view>
			<view class="zan-pinglun" v-show="!isShowBg">
				<view @tap='bottomGood()'>
					<image :src="detail.isLike?'../../static/icon_debate_praise_orange_active.png':'../../static/icon_debate_praise_orange_big.png'" class="img"></image>
					<text>{{detail.likesNum}}</text>
				</view>
				<view @tap="tapInput({type:'commentDetails'})">
					<image src="../../static/icon_detail_pinglun.png" class="img"></image>
					<text>{{commentData.total}}</text>
				</view>
			</view>
			<view class="sendbox u-f-ajc" :class="{'activesend':input1.trim().length==0?false:true}" v-show="isShowBg" @tap.stop="sendbtn">
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
					body: 'line-height: 1.8;color: #272727;font-size: 34rpx',
					img: 'background-size: contain|cover;width:100%;height:auto;display: block;',
					// p: 'text-indent: 2em',//首行缩进两个字符
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
				placeholder: '说点儿什么吧~',
				recommendationList: [],
				scrollTop: 0, // 页面移动距离
			};
		},
		onLoad(option) {
			// androidRst getToken 方法挂window上
			window.androidRst = this.androidRst
			window.getIosToken = this.getIosToken
			this.id = option.id
			this.getRecommendationList()
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
						type: 2,
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
			// 相关推荐
			getRecommendationList(){
				uni.request({
					url: '/api/cms/open/official_detail_rec',
					data: {
						dataId: this.id,
					},
					success: (res) => {
						console.log('推荐...',res)
						this.recommendationList = res.data.data.data
					},
				})
			} ,
			// 去标签页
			toTagPage(id){
				let query = {
					id,
				}
				console.log(JSON.stringify(query))
				if(isAndroid){
					return window.android.invoke_native("goNewsTagsPage", JSON.stringify(query), "androidRst")
				}else if(isIOS){
					// return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
				}
			},
			// 相关推荐
			changeDetailsContent(id){
				console.log('切换详情...',id)
				this.id = id
				this.getConsultDetail()
			},
			getContent(content){
				return content.replace(new RegExp(/\t/g), "&nbsp;&nbsp;&nbsp;").replace(new RegExp(/ /g), "&nbsp;")
			},
			getConsultDetail() {
				// uni.showToast({
				// 	title: '1122',
				// 	icon: 'none',
				// 	duration: 3000
				// });
				// 获取咨询详情
				uni.request({
					header: {
						// "Authorization": 'Bearer ' + '006f1779-19f6-417d-82bc-677972beaa92'
						"Authorization": 'Bearer ' + this.tk
					},
					url: '/api/cms/open/news_details',
					// url: '/api/cms/open/official_details',
					data: {
						// officialNewsId: this.id
						newsId: this.id
					},
					success: (res) => {
						// uni.showToast({
						// 	title: JSON.stringify(res.data.data.data.content),
						// 	icon: 'none',
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
						type: 2, //数据类型 1-官方发布 2-热门新闻
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
								if(!this.tk) {
									this.placeholder = '说点儿什么吧~'
									if(isAndroid){
										return window.android.invoke_native("goLogin", null, "androidRst")
									}else if(isIOS){
										return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
									}
								}
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
							if(!this.tk) {
								this.placeholder = '说点儿什么吧~'
								if(isAndroid){
									return window.android.invoke_native("goLogin", null, "androidRst")
								}else if(isIOS){
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
							if(!this.tk) {
								this.placeholder = '说点儿什么吧~'
								if(isAndroid){
									return window.android.invoke_native("goLogin", null, "androidRst")
								}else if(isIOS){
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
							if(!this.tk) {
								if(isAndroid){
									return window.android.invoke_native("goLogin", null, "androidRst")
								}else if(isIOS){
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
						// "Authorization": 'Bearer ' + '8c20e131-1d0c-402c-8d36-45291cdea909'
						"Authorization": 'Bearer ' + this.tk
					},
					// url: '/api/cms/open/news_comment_page',
					url: '/api/cms/common_comment/page',
					data: {
						dataId: this.id, //数据ID
						type: 2, // // 1-官方发布 2-热门新闻 3-游记  4-热议
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
				if(!this.tk) {
					if(isAndroid){
						return window.android.invoke_native("goLogin", null, "androidRst")
					}else if(isIOS){
						return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
					}
				}
				// 此处为已登录状态
				if (item.ifThumbsUp == 0) {//未点赞
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
				} else if(item.ifThumbsUp == 1){//已点赞
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
				if(isIOS) return false
				const query = uni.createSelectorQuery().in(this);
				query.select('.commentBar').boundingClientRect(data => {
					// 此处滑动到评论区域
					uni.pageScrollTo({
							scrollTop: data.top + this.scrollTop,
							duration: 0
					});
				}).exec();
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
				this.input1 = ''
				this.placeholder = '说点儿什么吧~'
				this.isShowBg = false
				this.$refs.inputFocus.focus = false
			},
			// 失去焦点时触发
			inpBlur() {
				this.contentD = this.input1
				// this.input1 = ''
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
				if(!this.tk){
					if(isAndroid){
						return window.android.invoke_native("goLogin", null, "androidRst")
					}else if(isIOS){
						return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
					}
				} 
				// 已登录状态下
				if (this.detail.isLike) {//已点赞
					uni.request({
						header: {
							"Authorization": 'Bearer ' + this.tk
						},
						url: '/api/cms/thumbs_up/cancel',
						method: "POST",
						data: {
							type: 4, // 1: 游记点赞, 2: 评论点赞, 3: 热议点赞, 4: 热门新闻资讯点赞,  5: 官方发布资讯点赞
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
				} else {//未点赞
					uni.request({
						header: {
							"Authorization": 'Bearer ' + this.tk
						},
						url: '/api/cms/thumbs_up/create',
						method: "POST",
						data: {
							type: 4,
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
				this.handleToken('praiseDetail')
				// this.praiseDetail()
			},
			// 展开更多
			handleShowMore(queryItem) {
				this.maxId = queryItem.replyVO.maxId
				this.replyVOCurrent = queryItem.replyVO.current
				this.parId = queryItem.commentId
				this.handleToken('showMore')
				// this.showMore()
			},
		},
		onPageScroll(e){
			this.scrollTop = e.scrollTop
		},
		onHide() {
			this.input1 = ''
			this.isShowBg = false
		},
	}
</script>

<style lang="scss" scoped>
@import "./advisoryDetails.scss";
</style>
