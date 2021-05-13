import Vue from 'vue'
import App from './App'
import {isEmpty} from '@/common/utils.js'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$isEmpty = isEmpty

// oss地址
Vue.prototype.$ossUrl = (suffix) => {
	return `https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/hicity/${suffix}`
}

const app = new Vue({
    ...App
})
app.$mount()
