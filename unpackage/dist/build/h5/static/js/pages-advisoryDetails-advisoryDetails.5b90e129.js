(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-advisoryDetails-advisoryDetails"],{3608:function(t,e,n){"use strict";n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return i}));var i={uniLoadMore:n("e0fa").default},o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"comment"},[t.detail?i("v-uni-view",{staticClass:"detail-box"},[i("v-uni-view",{staticClass:"title"},[t._v(t._s(t.detail.title))]),i("v-uni-view",{staticClass:"publish-time"},[t._v("发布时间："+t._s(t.gettime(t.detail.createTime)))]),i("jyf-parser",{staticClass:"parser",attrs:{html:t.detail.content,"tag-style":t.tagStyle,"lazy-load":!0}}),i("v-uni-view",{staticClass:"browse-num"},[t._v("帖子浏览数："+t._s(t.detail.browseNum))])],1):t._e(),t.detail?t._e():i("v-uni-view",{staticClass:"noData"},[t._v("暂无数据")]),i("v-uni-view",{staticClass:"hr"}),i("v-uni-view",{staticClass:"comment-box"},[i("v-uni-view",{staticClass:"commentBar"},[i("v-uni-view",{staticClass:"commentBar-item"},[i("v-uni-text",{staticClass:"commentTitle"},[t._v("全部评论")]),i("v-uni-text",[t._v("("+t._s(t.commentData.total)+")")])],1)],1),0==!t.commentData.total?i("v-uni-view",{staticClass:"commentBody"},t._l(t.commentData.records,(function(e,o){return i("v-uni-view",{key:o,staticClass:"first-comment"},[i("v-uni-view",{on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.tapCommentFirst({id:e.commentId,type:"commentFirst"})}}},[i("v-uni-view",{staticClass:"first-comment-top"},[i("v-uni-view",{staticClass:"imgBox"},[i("v-uni-image",{attrs:{src:e.createByAvatar}})],1),i("v-uni-view",{staticClass:"name-time"},[i("v-uni-view",{staticClass:"name"},[t._v(t._s(e.createByName))]),i("v-uni-view",{staticClass:"time"},[t._v(t._s(t.gettime(e.createTime)))])],1),0==e.ifThumbsUp?i("v-uni-view",{staticClass:"zan",on:{click:function(n){n.stopPropagation(),arguments[0]=n=t.$handleEvent(n),t.handlePraise(e)}}},[i("v-uni-image",{attrs:{src:n("3088")}}),i("v-uni-text",[t._v(t._s(e.thumbNum))])],1):1==e.ifThumbsUp?i("v-uni-view",{staticClass:"zan-selected",on:{click:function(n){n.stopPropagation(),arguments[0]=n=t.$handleEvent(n),t.handlePraise(e)}}},[i("v-uni-image",{attrs:{src:n("c158")}}),i("v-uni-text",[t._v(t._s(e.thumbNum))])],1):t._e()],1),i("v-uni-text",{staticClass:"first-comment-bottom",attrs:{space:"nbsp"}},[t._v(t._s(e.content))])],1),t._l(e.replyVO.records,(function(n,o){return i("v-uni-view",{key:o,staticClass:"second-comment",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.tapCommentSecond({id:n.commentId,type:"commentSecond"})}}},[i("v-uni-view",{staticClass:"second-comment-avatar"},[i("v-uni-image",{attrs:{src:n.createAvatar}})],1),i("v-uni-view",{staticClass:"second-comment-content"},[i("v-uni-view",{staticClass:"name"},[t._v(t._s(n.createByName))]),n.rankingCommentId===e.commentId?i("v-uni-view",{staticClass:"text"},[t._v(t._s(n.content))]):i("v-uni-view",{staticClass:"text"},[i("v-uni-text",{attrs:{space:"nbsp"}},[t._v("回复")]),i("v-uni-text",{staticStyle:{color:"#888888"},attrs:{space:"nbsp"}},[t._v(t._s(n.replyName)+" :")]),t._v(t._s(n.content))],1),i("v-uni-view",{staticClass:"time"},[t._v(t._s(t.gettime(n.createTime)))])],1)],1)})),e.replyVO.total>5&&e.replyVO.current<e.replyVO.pages?i("v-uni-view",{staticClass:"more",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.handleShowMore(e)}}},[t._v("展开"+t._s(e.replyVO.numberRemaining)+"条回复")]):t._e()],2)})),1):i("v-uni-view",{staticClass:"noContent"},[i("v-uni-image",{attrs:{src:n("043f")}}),i("v-uni-view",[t._v("暂无评论")])],1),i("v-uni-view",{staticClass:"load-more"},[t.commentData.records.length>10?i("uni-load-more",{attrs:{contentText:{contentnomore:"- THE END -"},iconSize:18,status:t.pinglunPageStatus}}):t._e(),t.commentData.records.length>0&&t.commentData.records.length<=10?i("uni-load-more",{attrs:{contentText:{contentnomore:"- THE END -"},iconSize:18,status:"noMore"}}):t._e()],1)],1),i("v-uni-view",{class:{inpBg:t.isShowBg},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.closeBg.apply(void 0,arguments)}}}),i("v-uni-view",{staticClass:"publishCommentBox",class:{safebox:!t.isShowBg}},[i("v-uni-view",{staticClass:"inpBox"},[i("v-uni-input",{ref:"inputFocus",staticClass:"uni-input",attrs:{"placeholder-class":"placeholderStyle",placeholder:"说点什么吧~"},on:{blur:function(e){arguments[0]=e=t.$handleEvent(e),t.inpBlur.apply(void 0,arguments)},click:function(e){arguments[0]=e=t.$handleEvent(e),t.tapInput({type:"commentDetails"})}},model:{value:t.input1,callback:function(e){t.input1=e},expression:"input1"}})],1),i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:!t.isShowBg,expression:"!isShowBg"}],staticClass:"zan-pinglun"},[i("v-uni-view",{on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.bottomGood()}}},[i("v-uni-image",{staticClass:"img",attrs:{src:t.detail.isLike?"../../static/icon-big-praise-selected.png":"../../static/icon-big-praise.png"}}),i("v-uni-text",[t._v(t._s(t.detail.likesNum))])],1),i("v-uni-view",{on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.tapInput({type:"commentDetails"})}}},[i("v-uni-image",{staticClass:"img",attrs:{src:n("477e")}}),i("v-uni-text",[t._v(t._s(t.commentData.total))])],1)],1),i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:t.isShowBg,expression:"isShowBg"}],staticClass:"sendbox",class:{activesend:0!=t.input1.trim().length},on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.sendbtn.apply(void 0,arguments)}}},[t._v("发送")])],1)],1)},a=[]},4506:function(t,e,n){var i=n("cc0a");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var o=n("4f06").default;o("6c8f36c2",i,!0,{sourceMap:!1,shadowMode:!1})},4731:function(t,e,n){"use strict";var i=n("4506"),o=n.n(i);o.a},"4f56":function(t,e,n){"use strict";n.r(e);var i=n("3608"),o=n("4f7e");for(var a in o)"default"!==a&&function(t){n.d(e,t,(function(){return o[t]}))}(a);n("4731");var s,c=n("f0c5"),r=Object(c["a"])(o["default"],i["b"],i["c"],!1,null,"7d7ff6c4",null,!1,i["a"],s);e["default"]=r.exports},"4f7e":function(t,e,n){"use strict";n.r(e);var i=n("d4e8"),o=n.n(i);for(var a in i)"default"!==a&&function(t){n.d(e,t,(function(){return i[t]}))}(a);e["default"]=o.a},cc0a:function(t,e,n){var i=n("24fb");e=i(!1),e.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.safebox[data-v-7d7ff6c4]{\r\n  /* iphonex 等安全区设置，底部安全区适配 */\r\npadding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom)\n}.comment-box[data-v-7d7ff6c4]::after{content:"";display:block;\r\npadding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom)\n}uni-page-body[data-v-7d7ff6c4]{background-color:#fff;height:100%}.comment[data-v-7d7ff6c4]{height:100%}.noData[data-v-7d7ff6c4]{height:%?200?%;font-size:%?24?%;color:#ccc;text-align:center;line-height:%?200?%}.detail-box[data-v-7d7ff6c4]{padding:%?36?% %?32?% %?32?%}.detail-box .title[data-v-7d7ff6c4]{line-height:%?52?%;font-size:%?36?%;color:#333;font-weight:700}.detail-box .publish-time[data-v-7d7ff6c4]{margin-top:%?20?%;height:%?34?%;height:%?34?%;font-size:%?24?%;color:#999}.detail-box .parser[data-v-7d7ff6c4]{margin-top:%?48?%}.detail-box .browse-num[data-v-7d7ff6c4]{margin-top:%?64?%;height:%?34?%;line-height:%?34?%;font-size:%?24?%;color:#999}.hr[data-v-7d7ff6c4]{height:%?16?%;background:#f9f9f9}.comment-box[data-v-7d7ff6c4]{padding:%?32?% %?32?% %?100?% %?32?%}.comment-box .commentBar[data-v-7d7ff6c4]{height:%?70?%;display:-webkit-box;display:-webkit-flex;display:flex}.comment-box .commentBar .commentBar-item .commentTitle[data-v-7d7ff6c4]{color:#1676ff!important;font-weight:500;color:#333;font-size:%?32?%;margin-right:%?15?%;position:relative}.comment-box .commentBar .commentBar-item .commentTitle[data-v-7d7ff6c4] ::after{content:"";width:%?20?%;height:%?6?%;position:absolute;bottom:%?-26?%;left:41%;background-color:#1676ff}.comment-box .noContent[data-v-7d7ff6c4]{padding-top:%?16?%;font-size:%?28?%;font-weight:400;color:#999;text-align:center}.comment-box .noContent > uni-image[data-v-7d7ff6c4]{width:%?280?%;height:%?180?%}.comment-box .noContent > uni-view[data-v-7d7ff6c4]{padding-top:%?48?%}.comment-box .load-more[data-v-7d7ff6c4]{padding:%?40?% 0}.comment-box .commentBody .first-comment[data-v-7d7ff6c4]:last-of-type{margin-bottom:0}.comment-box .commentBody .first-comment[data-v-7d7ff6c4]{margin:%?32?% 0;padding-bottom:%?32?%;border-bottom:%?2?% solid #ededed}.comment-box .commentBody .first-comment .first-comment-top[data-v-7d7ff6c4]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;margin-bottom:%?20?%}.comment-box .commentBody .first-comment .first-comment-top .imgBox[data-v-7d7ff6c4]{width:%?76?%;height:%?76?%}.comment-box .commentBody .first-comment .first-comment-top .imgBox > uni-image[data-v-7d7ff6c4]{width:100%;height:100%;border-radius:100%}.comment-box .commentBody .first-comment .first-comment-top .name-time[data-v-7d7ff6c4]{-webkit-box-flex:1;-webkit-flex:1;flex:1;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;margin-left:%?20?%}.comment-box .commentBody .first-comment .first-comment-top .name-time .name[data-v-7d7ff6c4]{font-size:%?28?%;font-weight:500;color:#333}.comment-box .commentBody .first-comment .first-comment-top .name-time .time[data-v-7d7ff6c4]{font-size:%?24?%;font-weight:400;color:#999;margin-top:%?6?%}.comment-box .commentBody .first-comment .first-comment-top .zan-selected[data-v-7d7ff6c4]{width:%?100?%;height:%?48?%;border:%?2?% solid #1676ff;border-radius:%?40?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.comment-box .commentBody .first-comment .first-comment-top .zan-selected > uni-image[data-v-7d7ff6c4]{width:%?28?%;height:%?28?%;margin-right:%?6?%}.comment-box .commentBody .first-comment .first-comment-top .zan-selected > uni-text[data-v-7d7ff6c4]{width:%?30?%;font-size:%?22?%;font-weight:400;color:#1676ff;text-align:center}.comment-box .commentBody .first-comment .first-comment-top .zan[data-v-7d7ff6c4]{width:%?100?%;height:%?48?%;border:%?2?% solid #ededed;border-radius:%?40?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.comment-box .commentBody .first-comment .first-comment-top .zan > uni-image[data-v-7d7ff6c4]{width:%?28?%;height:%?28?%;margin-right:%?6?%}.comment-box .commentBody .first-comment .first-comment-top .zan > uni-text[data-v-7d7ff6c4]{width:%?30?%;font-size:%?22?%;font-weight:400;color:#999;text-align:center}.comment-box .commentBody .first-comment .first-comment-bottom[data-v-7d7ff6c4]{margin-top:%?20?%;font-size:%?28?%;font-weight:400;color:#333}.comment-box .commentBody .first-comment .second-comment[data-v-7d7ff6c4]{margin-top:%?32?%;display:-webkit-box;display:-webkit-flex;display:flex}.comment-box .commentBody .first-comment .second-comment-avatar[data-v-7d7ff6c4]{width:%?48?%}.comment-box .commentBody .first-comment .second-comment-avatar uni-image[data-v-7d7ff6c4]{width:%?48?%;height:%?48?%;border-radius:50%}.comment-box .commentBody .first-comment .second-comment-content[data-v-7d7ff6c4]{margin-left:%?16?%;-webkit-box-flex:1;-webkit-flex:1;flex:1}.comment-box .commentBody .first-comment .second-comment-content .name[data-v-7d7ff6c4]{font-size:%?28?%;font-weight:500;color:#333;height:%?48?%;line-height:%?48?%}.comment-box .commentBody .first-comment .second-comment-content .text[data-v-7d7ff6c4]{font-size:%?28?%;font-weight:400;line-height:%?48?%;color:#333}.comment-box .commentBody .first-comment .second-comment-content .time[data-v-7d7ff6c4]{font-size:%?24?%;font-weight:400;line-height:%?32?%;color:#999}.comment-box .commentBody .first-comment .more[data-v-7d7ff6c4]{font-size:%?28?%;font-weight:400;margin-top:%?16?%;color:#1676ff;margin-left:%?66?%}.inpBg[data-v-7d7ff6c4]{background-color:rgba(0,0,0,.1);width:100%;height:100%;position:fixed;left:0;top:0}.publishCommentBox[data-v-7d7ff6c4]{background:#fff;height:%?112?%;width:100%;box-shadow:0 %?6?% %?12?% rgba(0,0,0,.24);position:fixed;bottom:0;left:0;display:-webkit-box;display:-webkit-flex;display:flex}.publishCommentBox .inpBox[data-v-7d7ff6c4]{-webkit-box-flex:2;-webkit-flex:2;flex:2;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.publishCommentBox .inpBox .uni-input[data-v-7d7ff6c4]{box-sizing:border-box;margin-left:%?28?%;width:100%;height:%?80?%;background-color:#f9f9f9;border-radius:%?160?%;padding:0 %?30?%}.publishCommentBox .inpBox .placeholderStyle[data-v-7d7ff6c4]{font-size:%?24?%;font-weight:400;color:#999}.publishCommentBox .sendbox[data-v-7d7ff6c4]{width:%?120?%;line-height:%?112?%;text-align:center;font-size:%?32?%}.publishCommentBox .activesend[data-v-7d7ff6c4]{color:#1676ff}.publishCommentBox .zan-pinglun[data-v-7d7ff6c4]{-webkit-box-flex:1;-webkit-flex:1;flex:1;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:space-evenly;-webkit-justify-content:space-evenly;justify-content:space-evenly;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.publishCommentBox .zan-pinglun > uni-view[data-v-7d7ff6c4]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.publishCommentBox .zan-pinglun > uni-view .img[data-v-7d7ff6c4]{width:%?48?%;height:%?48?%}.publishCommentBox .zan-pinglun > uni-view > uni-text[data-v-7d7ff6c4]{font-size:%?20?%;font-weight:400;color:#999}body.?%PAGE?%[data-v-7d7ff6c4]{background-color:#fff}',""]),t.exports=e},d4e8:function(t,e,n){"use strict";var i=n("4ea4");n("99af"),n("4160"),n("c975"),n("ac1f"),n("466d"),n("159b"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=i(n("84ea")),a=i(n("e0fa")),s=n("f055"),c=navigator.userAgent,r=c.indexOf("Android")>-1,m=!!c.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),d={components:{jyfParser:o.default,uniLoadMore:a.default},data:function(){return{isShowBg:!1,input1:"",msgType:null,safebox:{},tagStyle:{body:"line-height: 1.8;",img:"background-size: contain|cover;width:100%;height:auto;"},id:null,detail:{},commentData:{records:[]},comment:"",commentId:"",pinglunPageStatus:"more",promise:null,tk:null,contentD:null,replyVOCurrent:1,parId:null}},created:function(){window.androidRst=this.androidRst,window.getIosToken=this.getIosToken},onLoad:function(t){this.id=t.id,this.handleToken("getDetail"),this.handleToken("getList")},onReachBottom:function(){var t=this;this.commentData.current<this.commentData.pages&&(this.pinglunPageStatus="loading",uni.request({url:"/api/cms/common_comment/page",data:{dataId:this.id,current:this.commentData.current+1,type:2,maxId:this.maxId},success:function(e){if(0!==e.data.code)return uni.showToast({title:"获取评论列表失败",duration:1500,icon:"none"});t.commentData.current=e.data.data.data.current,t.commentData.current<t.commentData.pages?t.pinglunPageStatus="more":t.pinglunPageStatus="noMore",t.commentData.records=t.commentData.records.concat(e.data.data.data.records)}}))},methods:{getConsultDetail:function(){var t=this;uni.request({header:{Authorization:"Bearer "+this.tk},url:"/api/cms/open/news_details",data:{newsId:this.id},success:function(e){0!==e.data.code&&uni.redirectTo({url:"../404/404"}),t.detail=e.data.data.data}})},comDetail:function(){var t=this,e=this;if(""==this.contentD)return uni.showToast({title:"内容不能为空",duration:1500,icon:"none"});uni.request({url:"/api/cms/common_comment/create",header:{Authorization:"Bearer "+this.tk},method:"POST",data:{content:this.contentD,dataId:this.id,type:2},complete:function(n){if(200==n.statusCode){if(0!=n.data.code)return uni.showToast({title:"评论发布失败",duration:1500,icon:"none"});uni.showToast({title:"您已发布评论",duration:1500,icon:"none"}),e.getCommentList()}else 401==n.statusCode?(uni.showToast({title:"请先登录",duration:1500,icon:"none"}),t.input1="",t.isShowBg=!1,setTimeout((function(){return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null)}),1500)):uni.showToast({title:"请检查您的网络",duration:1500,icon:"none"})}})},comFirst:function(){var t=this;if(""==this.contentD)return uni.showToast({title:"内容不能为空",duration:1500,icon:"none"});uni.request({url:"/api/cms/common_comment/reply",header:{Authorization:"Bearer "+this.tk},method:"POST",data:{content:this.contentD,commentId:this.commentId},complete:function(e){if(200==e.statusCode){if(0!=e.data.code)return uni.showToast({title:"你的回复发布失败",duration:1500,icon:"none"});uni.showToast({title:"你的回复发布成功",duration:1500,icon:"none"}),t.getCommentList()}else{if(401==e.statusCode)return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null);uni.showToast({title:"请检查您的网路状态",duration:1500,icon:"none"})}}})},comSecond:function(){var t=this;if(""==this.contentD)return uni.showToast({title:"内容不能为空",duration:1500,icon:"none"});uni.request({url:"/api/cms/common_comment/reply",header:{Authorization:"Bearer "+this.tk},method:"POST",data:{content:this.contentD,commentId:this.commentId},complete:function(e){if(200==e.statusCode){if(0!=e.data.code)return uni.showToast({title:"你的回复发布失败",duration:1500,icon:"none"});uni.showToast({title:"你的回复发布成功",duration:1500,icon:"none"}),t.getCommentList()}else{if(401==e.statusCode)return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null);uni.showToast({title:"请检查您的网路状态",duration:1500,icon:"none"})}}})},gettime:s.gettime,showMore:function(){this.replyVOCurrent+=1;var t=this;uni.request({url:"/api/cms/common_comment/reply_page",header:{Authorization:"Bearer "+t.tk},data:{commentId:t.parId,size:5,current:t.replyVOCurrent,maxId:t.maxId},complete:function(e){if(200==e.statusCode){if(0!==e.data.code)return uni.showToast({title:"获取更多回复失败",duration:1500,icon:"none"});t.replyVOCurrent=e.data.data.data.current,t.commentData.records.forEach((function(n,i){n.commentId==t.parId&&(n.replyVO.current=e.data.data.data.current,n.replyVO.records=n.replyVO.records.concat(e.data.data.data.records))}))}else{if(401==e.statusCode)return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null);uni.showToast({title:"请检查您的网路状态",duration:1500,icon:"none"})}}})},handleToken:function(t){r?window.android.invoke_native("getToken","{resultType:".concat(t,"}"),"androidRst"):m&&window.webkit.messageHandlers.IOSGetToken.postMessage(t)},androidRst:function(t){this.tk=t.token,"commentDetails"==t.resultType?this.comDetail():"commentFirst"==t.resultType?this.comFirst():"commentSecond"==t.resultType?this.comSecond():"showMore"==t.resultType&&this.showMore()},getIosToken:function(t){this.tk=t.token,"commentDetails"==t.type?this.comDetail():"commentFirst"==t.type?this.comFirst():"commentSecond"==t.type?this.comSecond():"showMore"==t.type?this.showMore():"getList"==t.type?this.getCommentList():"getDetail"==t.type?this.getConsultDetail():"praiseDetail"==t.type&&this.praiseDetail()},getCommentList:function(){var t=this;uni.request({header:{Authorization:"Bearer "+this.tk},url:"/api/cms/common_comment/page",data:{dataId:this.id,type:2,current:1,maxId:""},success:function(e){if(0!==e.data.code)return uni.showToast({title:"获取评论列表失败",duration:1500,icon:"none"});t.commentData=e.data.data.data,t.maxId=e.data.data.data.maxId}})},handlePraise:function(t){if(!this.tk)return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null);0==t.ifThumbsUp?uni.request({header:{Authorization:"Bearer "+this.tk},url:"/api/cms/thumbs_up/create",method:"POST",data:{type:2,dataId:t.commentId},success:function(e){0==e.data.code&&(t.ifThumbsUp=1,t.thumbNum+=1)}}):1==t.ifThumbsUp&&uni.request({header:{Authorization:"Bearer "+this.tk},url:"/api/cms/thumbs_up/cancel",method:"POST",data:{type:2,dataId:t.commentId},success:function(e){0==e.data.code&&(t.ifThumbsUp=0,t.thumbNum-=1)}})},tapInput:function(t){this.msgType=t.type,this.isShowBg=!0,this.$nextTick((function(){this.$refs.inputFocus.focus=!0}))},tapCommentFirst:function(t){this.msgType=t.type,this.commentId=t.id,this.isShowBg=!0,this.$refs.inputFocus.focus=!0},tapCommentSecond:function(t){this.msgType=t.type,this.commentId=t.id,this.isShowBg=!0,this.$refs.inputFocus.focus=!0},closeBg:function(){this.isShowBg=!1,this.$refs.inputFocus.focus=!1},inpBlur:function(){this.contentD=this.input1,this.input1="",this.$refs.inputFocus.focus=!1},sendbtn:function(){this.handleToken(this.msgType),this.isShowBg=!1,this.input1=""},praiseDetail:function(){var t=this;if(!this.tk)return window.webkit.messageHandlers.IOSTokenUseless.postMessage(null);this.detail.isLike?uni.request({header:{Authorization:"Bearer "+this.tk},url:"/api/cms/thumbs_up/cancel",method:"POST",data:{type:4,dataId:this.id},success:function(e){uni.showToast({title:"已取消点赞",icon:"none",duration:1e4}),0==e.data.code&&(t.detail.isLike=!1,t.detail.likesNum-=1)}}):uni.request({header:{Authorization:"Bearer "+this.tk},url:"/api/cms/thumbs_up/create",method:"POST",data:{type:4,dataId:this.id},success:function(e){uni.showToast({title:"点赞成功",icon:"none",duration:1e4}),0==e.data.code&&(t.detail.isLike=!0,t.detail.likesNum+=1)}})},bottomGood:function(){this.praiseDetail()},handleShowMore:function(t){this.maxId=t.replyVO.maxId,this.replyVOCurrent=t.replyVO.current,this.parId=t.commentId,this.handleToken("showMore")}},onPageScroll:function(t){},onHide:function(){this.input1="",this.isShowBg=!1}};e.default=d}}]);