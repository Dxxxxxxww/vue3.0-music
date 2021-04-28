import loadingDirective from '@/components/base/loading/directive'
import { createApp } from 'vue'
// import App from '../App'

const app = createApp({})

app.directive('loading', loadingDirective)
