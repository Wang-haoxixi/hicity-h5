import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// oss地址
Vue.prototype.$ossUrl = (suffix) => {
	return `https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/hicity/${suffix}`
}

const app = new Vue({
    ...App
})
app.$mount()
