<template>
	<view class="policyDetail">
		<!-- 导航栏部分 -->
		<uni-nav-bar fixed="true" left-icon="back" title="政策详情" backgroundColor="#F5F7F8" @clickLeft="handleClickLeft"></uni-nav-bar>
		<!-- 灰底部分 -->
		<view class="grey-container">
			<view class="header-content">
				<view class="title">
					{{ $isEmpty(details.policyTitle) ? '' : details.policyTitle }}
				</view>
				<view class="info-content">
					<view class="info-first">
						<view class="info-first-left">
							<view class="policy-type" :style="{'background': policyTypeStyle.bgColor, 'color': policyTypeStyle.color}">
								{{ $isEmpty(details.policyTypeName) ? '' : details.policyTypeName }}
							</view>
							<view class="policy-time">
								{{ details.updateTime.substring(0,10) }}
							</view>
						</view>
						<view class="info-first-right">
							{{ $isEmpty(details.previewNum) ? 0 : details.previewNum }}浏览
						</view>
					</view>
					<view class="info-second">
						<view class="tag-item" v-for="(item,index) in details.dictionaryLableNameDate" :key='index'>
							{{ item }}
						</view>
					</view>
				</view>
				<!-- 政策身份 -->
				<!-- policyType 政策类型(1:通用政策,2:申报政策,3:政策解读,4:政策咨询) -->
				<view class="policy-identity" v-if="(details.policyType==1 && details.documentNumber!='')  || (details.policyType==2 && details.documentNumber!='')">
					<view>
						<view>发文机构</view>：<text>{{ $isEmpty(details.issuingAgency) ? '' : details.issuingAgency }}</text>
					</view>
					<view>
						<view><text>发</text><text>文</text><text>号</text></view>：<text>{{ $isEmpty(details.documentNumber) ? '' : details.documentNumber }}</text>
					</view>
					<view>
						<view><text>主</text><text>题</text></view>：<text>{{ details.dictionaryTopicNameDate.join("、") }}</text> 
					</view>
					<view>
						<view>发文时间</view>：<text>{{ details.issuingTime.substring(0,10) }}</text>
					</view>
				</view>
			</view>
			<!-- 正文 -->
			<view class="body-content">
				<view class="txt" v-if="details.policyType != 2">
					<jyf-parser class="parser" :html="details.contentText" :tag-style="tagStyle" lazy-load></jyf-parser>
				</view>
				<view class="policy-declaration-box" v-else>
					<view class="tabs-list">
						<view @click="changeTab(index)" :class="['tab-item', activeCurrent==index ? 'active-tab' : '']" v-for="(item,index) in tabs" :key='index'>
							{{ item.tab }}
						</view>
					</view>
					<view class="policy-declaration-content" v-if="activeCurrent==0">
						<view class="unscramble-item">
							申报对象：{{ POLICY_APPLICABLE_OBJECT }}
						</view>
						<view class="unscramble-item">
							扶持形式：{{ POLICY_SUPPORT_FORM }}
						</view>
						<view class="unscramble-item">
							支持方式：{{ POLICY_SUSTAIN_MODE }}
						</view>
						<view class="unscramble-item">
							申报时间：{{ details.declarationTime.substring(0,10) }} ～ {{ details.endTime.substring(0,10) }}
						</view>
						<!-- <view class="unscramble-item">
							状态：{{ details.declarationStatus }}
						</view> -->
						<view class="unscramble-item">
							申报条件：
							<jyf-parser class="parser" :html="details.declarationConditions" :tag-style="tagStyle" lazy-load></jyf-parser>
						</view>
					</view>
					<view class="policy-declaration-content" v-else>
						<jyf-parser class="parser" :html="details.contentText" :tag-style="tagStyle" lazy-load></jyf-parser>
					</view>
				</view>
				<view class="source-original">
					<view>
						来源于：{{ $isEmpty(details.source) ? '' : details.source }}
					</view>
					<view @click="handlecheck">
						查看原文
					</view>
				</view>
			</view>
			<!-- 附件 -->
			<view class="file-content" v-if="details.enclosureData && details.enclosureData.length > 0">
				<view class="title">
					附件
				</view>
				<view class="accessory-item" v-for="(item,index) in details.enclosureData" :key='index' @click="handleDownloadFile(item)">
					附件{{ index + 1 }}：<text>{{ item.original }}</text> 
				</view>
			</view>
			<!-- 圈子咨询 -->
			<view class="circle-consult" v-if="details.circles && details.circles.length > 0">
				<view class="title">
					圈子咨询
				</view>
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view class="scroll-view-item_H" v-for="(item,index) in details.circles" :key='index' @tap="handleCircle(item)">
						<view class="content-warp">
							<image :src="item.circleAvatar"></image>
							<view class="item-right">
								<view class="circle-name hiddenEllipsisNowrap">
									{{ item.circleName }}
								</view>
								<view class="discuzing">
									<text>{{ item.memberNum }}</text>人正在讨论
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 白底部分 -->
		<view class="white-container">
			<!-- && details.commentSwitch == 0 -->
			<view class="msssage-title" v-if="commentData.total && commentData.total != 0 && details.commentSwitch == 0">
				留言咨询 ({{ commentData.total }})
			</view> 
			<!-- 留言咨询 -->
			<view class="comment-item u-f" v-for="(item,index) in commentData.records.slice(0,3)" :key='index' v-if="commentData.total && commentData.total != 0 && details.commentSwitch == 0">
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
			<view class="all-comment" @click="handleAllComment" v-if="commentData.total && commentData.total != 0">
				查看全部评价
				<image src="../../static/icon-arrowright.png"></image>
			</view>
			<!-- 相关推荐 -->
			<view class="recommend-box" v-if="recommendData.records && recommendData.records.length > 0">
				<view class="title">
					相关推荐
				</view>
				<view class="recommend-list">
					<view class="recommend-item" v-for="(item,index) in recommendData.records" :key='index' @tap="handleRecommend(item.publishId)">
						<view class="recommend-item-left">
							<view class="recommend-title">
								<view class="origin"></view>
								<view class="text multiLineEllipsis">
									{{ item.policyTitle }}
								</view>
							</view>
							<view class="recommend-txt u-f">
								<view class="publisher hiddenEllipsisNowrap">
									{{ item.source }}
								</view>
								<view class="browse">
									{{ item.previewNum }}浏览
								</view>
								<view class="publish-time">
									{{ gettime(item.updateTime) }}
								</view>
							</view>
						</view>
						<image :src="item.listPreviewUrlsData[0]" v-if="item.listPreviewUrlsData.length > 0"></image>
					</view>
				</view>
				<image class="no-vip" src="../../static/pic_policy_noVip.png" v-if="!vipState" @tap="handleVipPic"></image>
				<!-- 相关推荐列表-加载更多 -->
				<view class="load-more" v-if="vipState !== null">
					<uni-load-more :contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: '没有更多了'}" :iconSize='18' :status="recommendStatus">
					</uni-load-more>
				</view>
			</view>
		</view>
		<!-- 背景蒙层 -->
		<view :class="{inpBg:isShowBg}" @tap.stop="closeBg" @touchmove.prevent></view>
		<!-- 底部发布评论部分 -->
		<view class="publishCommentBox" :class="{safebox:!isShowBg}">
			<!-- commentSwitch 咨询评论开关(0：开启，1：关闭)") -->
			<view class="inpBox" v-if="details.commentSwitch == 0">
				<input @tap="tapInput({type:'commentDetails'})" @blur="inpBlur" ref='inputFocus' v-model="input1"
					class="uni-input" placeholder-class='placeholderStyle' :placeholder="placeholder" />
			</view>
			<view class="zan-pinglun" v-show="!isShowBg">
				<view @tap='bottomGood()'>
					<image :src="details.thumbsUpPd ? '../../static/icon_debate_praise_orange_active.png' : '../../static/icon_debate_praise_orange_big.png'" class="img"></image>
					
					<div class="goodAnimate" v-show="ClickGood_Status"></div>
					
					<text>{{ $isEmpty(details.likeNumber) ? 0 : details.likeNumber }}</text>
				</view>
				<view @tap="handleCollect">
					<image :src="details.collectionPolicy ? '../../static/icon-policy-collected.png' : '../../static/icon-policy-collect.png'" class="img"></image>
					<div class="likeAnimate" v-show="ClickLike_Status"></div>
					<text>收藏</text>
				</view>
				<view @tap="handleShare">
					<image src="../../static/icon-policy-share.png" class="img"></image>					
					<text>分享</text>
				</view>
			</view>
			<view class="sendbox u-f-ajc" :class="{'activesend':input1.trim().length==0?false:true}" v-show="isShowBg"
				@tap.stop="sendbtn">
				发送
			</view>
		</view>
		<uni-popup ref="vipPopup" type="dialog">
			<uni-popup-dialog type="info" mode="base" content="VIP会员特权，成为VIP后可享受此服务" :isSingleBtn=false :duration="2000" :before-close="true" confirmContent='开通VIP会员' @confirm="toVipConfirm"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="downloadPopup" type="dialog">
			<uni-popup-dialog type="info" mode="base" content="下载当前附件？" :isSingleBtn="true" :duration="2000" :before-close="true" @close="$refs.downloadPopup.close()" @confirm="downloadConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	let u = navigator.userAgent;
	let isAndroid = u.indexOf('Android') > -1; //安卓终端
	let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	
	import jyfParser from "@/components/jyf-Parser/jyf-parser";
	import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import { gettime } from "@/common/time.js"
	export default {
		components: {
			jyfParser,
			uniPopupDialog,
			uniLoadMore,
			uniNavBar,
		},
		data() {
			return {
				// policyType:政策类型(1:通用政策,2:申报政策,3:政策解读,4:政策咨询)
				tk: null,
				cityId: null,
				topicIds: null,
				recommendStatus: 'more',
				recommendData: '',
				policyTypeStyle: {
					bgColor: 'rgba(93, 143, 224, 0.08)',
					color: '#5D8FE0'
				},
				vipState: null, // vip状态(null:游客,false:游客普通,true:会员)
				details: "", // 政策详情
				tabs: [ { index: 0, tab: '解读' }, { index: 1, tab: '正文' } ],
				activeCurrent: 0,
				commentData: {
					records: [],
				},
				isShowBg: false, //输入框背景
				input1: "",
				placeholder: "说点儿什么吧~",
				// policyType: null, // 政策通类型
				id: null, // 政策通详情ID
				contentD: null, //评论内容
				msgType: null, //传给移动端的type值
				commentId: '', //被点击的评论id
				replyVOCurrent: 1, //回复数据的当前页
				maxId: '',
				parId: null, //被回复的评论
				tagStyle: {
					body: 'line-height: 56rpx;color: #272727;font-size: 34rpx',
					img: 'background-size: contain|cover;width:100%;height:auto;display: block;',
					// p: 'text-indent: 2em',//首行缩进两个字符
				},
				policyObject: [], // 申报对象
				supportForm: [], // 扶持形式
				sustainForm: [], //支持方式
				
				ClickGood_Status: false, // 详情点赞显隐
				ClickLike_Status: false, // 详情收藏显隐
			}
		},
		computed:{
			POLICY_APPLICABLE_OBJECT(){
				let arr = []
				this.policyObject.forEach((item,index)=>{
					this.details.declarationObjectDate.forEach(val=>{
						if(val == item.value){
							arr.push(item.label)
						}
					})
				})
				return arr.join('、')
			},
			POLICY_SUPPORT_FORM(){
				let arr = []
				this.supportForm.forEach((item,index)=>{
					this.details.supportFormDate.forEach(val=>{
						if(val == item.value){
							arr.push(item.label)
						}
					})
				})
				return arr.join('、')
			},
			POLICY_SUSTAIN_MODE(){
				let arr = []
				this.sustainForm.forEach((item,index)=>{
					this.details.sustainModeDate.forEach(val=>{
						if(val == item.value){
							arr.push(item.label)
						}
					})
				})
				return arr.join('、')
			},
		},
		onLoad(opt) {
			
			window.androidRst = this.androidRst
			window.getIosToken = this.getIosToken
			
			this.id = opt.id
			
			// 本地方法
			// this.getDetail() //获取详情
			// this.getCommentList() //评论列表
			
			// 原生方法
			this.handleToken('getDetail')
			this.handleToken('getCommentList')
		},
		filters:{
		},
		onReachBottom(){
			console.log('触底..')
			if (this.vipState === null || this.vipState === false) return // 非会员不触发触底事件
			if (this.recommendData.current < this.recommendData.pages) {
				this.recommendStatus = 'loading'
				uni.request({
					url: 'api/dms/open/get_list_page_app',
					header: {
						// "Authorization": 'Bearer ' + '3180932b-aadf-4286-8a50-a069c167bb9e'
						"Authorization": 'Bearer ' + this.tk
					},
					data: {
						size: 10,
						current: this.recommendData.current += 1, //当前页
						cityId: this.details.cityId,
						topicIds: this.details.topicIds,
					},
					success: (res) => {
						if (res.data.code !== 0) {
							return uni.showToast({
								title: '获取信息失败',
								duration: 1500,
								icon: "none",
							});
						}
						this.recommendData.current = res.data.data.data.current
						if (this.recommendData.current < this.recommendData.pages) {
							this.recommendStatus = 'more'
						} else {
							this.recommendStatus = 'noMore'
						}
						this.recommendData.records = this.recommendData.records.concat(res.data.data.data.records)
					}
				})
			} else {
				this.recommendStatus = 'noMore'
			}
		},
		methods: {
			gettime,
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
				} else if (res.resultType == 'getDetail') {
					this.getDetail()
				} else if (res.resultType == 'praiseDetail') {
					this.praiseDetail()
				} else if (res.resultType == 'getRecommendFn') {
					this.getRecommendFn()
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
				} else if (res.type == 'getDetail') {
					this.getDetail()
				} else if (res.type == 'praiseDetail') {
					this.praiseDetail()
				} else if (res.type == 'getRecommendFn') {
					this.getRecommendFn()
				}
			},
			TO_LOGIN(){ // 到登录页
				if (isAndroid) {
					return window.android.invoke_native("goLogin", null, "androidRst")
				} else if (isIOS) {
					return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)
				}
			},
			// 政策详情
			getDetail(){
				uni.request({
					url: 'api/dms/open/get_detail_app',
					header: {
						// "Authorization": 'Bearer ' + '54e4df6e-c997-4b23-a8da-af3ed8123784'// 普通
						"Authorization": 'Bearer ' + this.tk
					},
					data: {
						publishId: this.id,
					},
					success: (res) => {
						this.details = res.data.data.data
						if(this.tk){ // tk存在
							this.vipState = this.details.memberPd // 是否会员  false:普通用户，true:会员用户
						} else {
							this.vipState = null // 游客 - 未登录状态
						}
						this.policyStyle() // 政策类型tag颜色
						this.getRecommendFn()
						
						this.getPOLICY_APPLICABLE_OBJECT(this.details.declarationObjectDate)
						this.getPOLICY_SUPPORT_FORM(this.details.supportFormDate)
						this.getPOLICY_SUSTAIN_MODE(this.details.sustainModeDate)
					},
				})
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
						maxId: ''
					},
					success: (res) => {
						this.commentData = res.data.data.data
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
				if(this.vipState === null){ // 游客模式
					uni.showToast({
						title: '登录后可留言',
						icon: 'none',
						duration: 3000,
					});
					setTimeout(()=>{ // 3S后去登录页
						that.TO_LOGIN()
					}, 3000)
					return
				}
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
				if(this.vipState === null){ // 游客模式
					uni.showToast({
						title: '登录后可留言',
						icon: 'none',
						duration: 3000,
					});
					setTimeout(()=>{ // 3S后去登录页
						that.TO_LOGIN()
					}, 3000)
					return
				}
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
				if(this.vipState === null){ // 游客模式
					uni.showToast({
						title: '登录后可留言',
						icon: 'none',
						duration: 3000,
					});
					setTimeout(()=>{ // 3S后去登录页
						that.TO_LOGIN()
					}, 3000)
					return
				}
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
						}
					}
			
				})
			},
			// 政策类型tag颜色
			policyStyle(){
				if(this.details.policyType == 1){
					this.policyTypeStyle = {
						bgColor: 'rgba(93, 143, 224, 0.08)',
						color: '#5D8FE0'
					}
				}else if(this.details.policyType == 2){
					this.policyTypeStyle = {
						bgColor: 'rgba(134, 139, 252, 0.08)',
						color: '#868BFC'
					}
				}else if(this.details.policyType == 3){
					this.policyTypeStyle = {
						bgColor: 'rgba(250, 104, 54, 0.08)',
						color: '#FA6836'
					}
				}else if(this.details.policyType == 4){
					this.policyTypeStyle = {
						bgColor: 'rgba(80, 203, 161, 0.08)',
						color: '#50CBA1'
					}
				}
			},
			// 相关推荐
			getRecommendFn(){
				uni.request({
					url: 'api/dms/open/get_list_page_app',
					header: {
						// "Authorization": 'Bearer ' + '3180932b-aadf-4286-8a50-a069c167bb9e'
						"Authorization": 'Bearer ' + this.tk
					},
					data: {
						size: 10,
						current: 1,
						cityId: this.details.cityId,
						topicIds: this.details.topicIds,
					},
					success: (res) => {
						this.recommendData = res.data.data.data
						if (this.recommendData.pages == 1) {
							this.recommendStatus = 'noMore'
						}
					},
				})
			},
			changeTab(index){
				this.activeCurrent = index
			},
			// 查看原文
			handlecheck(){
				if(this.vipState === null || this.vipState === false){ // 游客、普通
					this.$refs.vipPopup.open()
				} else if(this.vipState === true){ // 会员 - 到浏览器打开原文链接
					let query = {
						originalLink: this.details.originalLink
					}
					if (isAndroid) {
						return window.android.invoke_native("goOriginalPage", JSON.stringify(query), "androidRst")
					} else if (isIOS) {
						return window.webkit.messageHandlers.goOriginalPage.postMessage(query)
					}
				}
			},
			// 收藏
			handleCollect(){
				let _this = this
				if(this.vipState === null){ // 游客模式 点收藏去登录
					uni.showToast({
						title: '登录后可收藏',
						icon: 'none',
						duration: 3000,
					});
					setTimeout(()=>{ // 3S后去登录页
						_this.TO_LOGIN()
					}, 3000)
					return
				}
				// 普通、会员模式
				uni.request({
					method: "POST",
					url: 'api/dms/policy_bench_mark/create_or_update',
					header: {
						// "Authorization": 'Bearer ' + '54e4df6e-c997-4b23-a8da-af3ed8123784'  // 测试站
						// "Authorization": 'Bearer ' + '4f2f9a29-6391-4ff9-8ada-58faa7ba49f2' // 本地
						"Authorization": 'Bearer ' + this.tk
					},
					data: {
						publishId: this.id,
						state: 0,
					},
					success: (res) => {
						if(res.data.data.businessCode == 1000){
							if(!_this.details.collectionPolicy){
								uni.showToast({
									title: '收藏成功!',
									icon: 'none'
								});
								_this.details.collectionPolicy = true
								
								this.ClickLike_Status = true
								setTimeout(() => {
										this.ClickLike_Status = false
								}, 1000);
								
							} else {
								uni.showToast({
									title: '取消收藏成功!',
									icon: 'none'
								});
								_this.details.collectionPolicy = false
							}
						} else if (res.data.data.businessCode == 1) {
							uni.showToast({
								title: "登录失效,请重新登录",
								duration: 3000,
								icon: "none",
							});
							setTimeout(()=>{
								_this.TO_LOGIN()
							}, 3000)
						} else {
							uni.showToast({
								title: res.data.data.msg,
								duration: 3000,
								icon: "none",
							});
						}
					},
				})
			},
			// 政策分享
			handleShare(){
				let query = this.details
				if (isAndroid) {
					return window.android.invoke_native("goSharePolicy", JSON.stringify(query), "androidRst")
				} else if (isIOS) {
					return window.webkit.messageHandlers.goSharePolicy.postMessage(query)
				}
			},
			// 点击底部vip图片
			handleVipPic(){
				if (isAndroid) {
					return window.android.invoke_native("goVipPage", null, "androidRst")
				} else if (isIOS) {
					return window.webkit.messageHandlers.goVipPage.postMessage(null)
				}
			},
			// 查看全部评论
			handleAllComment(){
				if(this.vipState === null){ // 游客模式去登录页
					uni.showToast({
						title: '登录后可查看',
						icon: 'none',
						duration: 3000,
					});
					setTimeout(()=>{ // 3S后去登录页
						this.TO_LOGIN()
					}, 3000)
				} else { // 普通或会员模式可查看全部评论
					uni.navigateTo({
						url: '/pages/allComment/allComment?id=' + this.id
					})
				}
			},
			// 点击 开通VIP会员按钮 事件
			toVipConfirm() {
				if (isAndroid) {
					return window.android.invoke_native("goVipPage", null, "androidRst")
				} else if (isIOS) {
					return window.webkit.messageHandlers.goVipPage.postMessage(null)
				}
				this.$refs.vipPopup.close()
			},
			downloadConfirm(){
				if (isAndroid) {
					return window.android.invoke_native("goVipPage", null, "androidRst")
				} else if (isIOS) {
					return window.webkit.messageHandlers.goVipPage.postMessage(null)
				}
				this.$refs.vipPopup.close()
			},
			//  点击 附件按钮 事件
			handleDownloadFile(data){
				if(this.vipState === null || this.vipState === false){ // 游客、普通
					this.$refs.vipPopup.open()
				} else if(this.vipState === true) { // 会员 - 进行附件下载
					let query = data
					if (isAndroid) {
						return window.android.invoke_native("downLoadFile", JSON.stringify(query), "androidRst")
					} else if (isIOS) {
						return window.webkit.messageHandlers.downLoadFile.postMessage(query)
					}
				}
			},
			// 点击 圈子咨询按钮
			handleCircle(data){
				let query = {
					id: data.circleId
				}
				if (isAndroid) {
					return window.android.invoke_native("goCirclePage", JSON.stringify(query), "androidRst")
				} else if (isIOS) {
					return window.webkit.messageHandlers.goCirclePage.postMessage(query)
				}
			},
			// 触发相关推荐事件
			handleRecommend(id){
				this.id = id
				uni.navigateTo({
					url: '/pages/policyDetail/policyDetail?id=' + id,
					animationType: 'slide-in-right',
					animationDuration: 200
				});
			},
			// 关闭背景
			closeBg(){
				this.input1 = ''
				this.placeholder = '说点儿什么吧~'
				this.isShowBg = false
				this.$refs.inputFocus.focus = false
			},
			tapInput(opt){
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
				// 输入框失焦时将值交给contentD
				this.contentD = this.input1
				// this.input1 = ''
				this.$refs.inputFocus.focus = false
			},
			// 详情点赞
			bottomGood(){
				let _this = this
				if(this.vipState === null){ // 游客模式 点收藏去登录
					uni.showToast({
						title: '登录后可点赞',
						icon: 'none',
						duration: 3000,
					});
					setTimeout(()=>{ // 3S后去登录页
						_this.TO_LOGIN()
					}, 3000)
					return
				}
				// 普通、会员模式
				uni.request({
					method: "POST",
					url: 'api/dms/policy_thumbs_up/mobile/create',
					header: {
						// "Authorization": 'Bearer ' + '54e4df6e-c997-4b23-a8da-af3ed8123784' // 测试站
						// "Authorization": 'Bearer ' + '4f2f9a29-6391-4ff9-8ada-58faa7ba49f2' //本地
						"Authorization": 'Bearer ' + this.tk
					},
					data: {
						dataId: this.id,
					},
					success(res) {
						if(res.data.data.businessCode == 1000){
							if(!_this.details.thumbsUpPd){
								uni.showToast({
									title: "点赞成功",
									duration: 1500,
									icon: "none",
								});
								
								_this.ClickGood_Status = true
								setTimeout(() => {
										_this.ClickGood_Status = false
								}, 1000);
								
								_this.details.thumbsUpPd = true
								_this.details.likeNumber += 1
							} else {
								uni.showToast({
									title: "已取消点赞",
									duration: 1500,
									icon: "none",
								});
								_this.details.thumbsUpPd = false
								_this.details.likeNumber -= 1
							}
						} else if (res.data.data.businessCode == 1) {
							uni.showToast({
								title: "登录失效,请重新登录",
								duration: 3000,
								icon: "none",
							});
							setTimeout(()=>{
								_this.TO_LOGIN()
							}, 3000)
						} else {
							uni.showToast({
								title: '请检查您的网络',
								duration: 1500,
								icon: "none",
							});
						}
					}
				})
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
				this.handleToken('showMore')
				// this.showMore()
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
								that.TO_LOGIN()
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
				if(this.vipState === null){ // 游客模式 点赞去登录
					uni.showToast({
						title: '登录后可点赞',
						icon: 'none',
						duration: 3000,
					});
					setTimeout(()=>{ // 3S后去登录页
						this.TO_LOGIN()
					}, 3000)
					return
				}
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
			// 左上角返回按钮点击事件
			handleClickLeft(){
				if (isAndroid) {
					return window.android.invoke_native("navigateBack", null, "androidRst")
				} else if (isIOS) {
					return window.webkit.messageHandlers.navigateBack.postMessage(null)
				}
			},
			
			// 获取申报对象
			getPOLICY_APPLICABLE_OBJECT(data){
				uni.request({
					url: 'api/admin/dict/item/' + 'POLICY_APPLICABLE_OBJECT',
					success: (res) => {
						this.policyObject = res.data.data.data
					}
				})
			}, 
			// 获取扶持形式
			getPOLICY_SUPPORT_FORM(data){
				uni.request({
					url: 'api/admin/dict/item/' + 'POLICY_SUPPORT_FORM',
					success: (res) => {
						this.supportForm = res.data.data.data
					}
				})
			},
			// 获取支持方式
			getPOLICY_SUSTAIN_MODE(data){
				uni.request({
					url: 'api/admin/dict/item/' + 'POLICY_SUSTAIN_MODE',
					success: (res) => {
						this.sustainForm = res.data.data.data
					}
				})
			}
		},
	}
</script>
<style lang="scss" scoped>
	@import "./policyDetail.scss";
</style>