# FlatList的扩展SwipeableFlatList讲解

FlatList的扩展Swipeable讲解SwipeableFlatList是一个带滑动显示更多菜单的FlatList组件，是RN在版本0.50中引入的一个组件，不过目前
官网还有对SwipeableFlatList的相关介绍，它支持FlatList的所有功能，另外在此基础上添加了对侧滑显示更多菜单的支持。

# 属性

    renderQuickActions?: ?(rowData, sectionID, rowID) => ?React.Element <any>

用于创建侧滑菜单

    maxSwipeDistance?: ?PropTypes.number | PropTypes.func

设置最大滑动距离

    bounceFirstRowOnMount?: boolean

默认false，如果设置true第一行向左滑动，然后再向后移动以向用户显示该行可以滑动



