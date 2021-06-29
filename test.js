// // 测试导入根目录文件
// export default function abc() {
//   console.log('abc')
// }
// vue 编译前
// <scroll
//   v-bind="$props"
//   ref="scrollRef"
//   @scroll="$emit('scroll', $event)"
// >
// <slot></slot>
// </scroll>
// vue 编译后
import {
  renderSlot as _renderSlot,
  resolveComponent as _resolveComponent,
  mergeProps as _mergeProps,
  withCtx as _withCtx,
  openBlock as _openBlock,
  createBlock as _createBlock
} from 'vue'

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_scroll = _resolveComponent('scroll')

  return (
    _openBlock(),
    _createBlock(
      _component_scroll,
      _mergeProps(_ctx.$props, {
        ref: 'scrollRef',
        onScroll: $event => _ctx.$emit('scroll', $event)
      }),
      {
        default: _withCtx(
          () => [_renderSlot(_ctx.$slots, 'default')],
          undefined,
          true
        ),
        _: 3 /* FORWARDED */
      },
      16 /* FULL_PROPS */,
      ['onScroll']
    )
  )
}

// Check the console for the AST
