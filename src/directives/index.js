import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/directive'

export default function registerDirective(app) {
  app.directive('loading', loadingDirective)
  app.directive('no-result', noResultDirective)
}
