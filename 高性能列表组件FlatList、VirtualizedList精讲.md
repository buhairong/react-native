################################################################
# FlatList的由来

在RN0.43版本中引入了 FlatList,SectionList 与 VirtualizedList,其中VirtualizedList是FlatList与SectionList的底层实现

    可能有人要问了，既然有了ListView,那为什么还要设计一个FlatList出来呢？

经常使用ListView的同学都知道：ListView的性能是比较差的，尤其是当有大量的数据需要展示的时候，
ListView对内存的占用是相当可观的、丢帧卡顿那是常有的事

    为什么ListView对于大数据量的情况下性能会很差呢？

深入ListView的原理你会发现，ListView对列表中的Item是全量渲染的，并且没有复用机制，这就难以避免当让ListView渲染大数据量的
时候会发生以下两个问题：

    * 第一次打开与切换Tab时会出现卡顿或白屏的情况：这是因为ListView对所有的Item都是全量渲染的，比如：ListView中有100条Item,
      只有等这100条Item都渲染完成，ListView中的内容才会展示，这就难以避免卡顿白屏的问题
    * 滑动列表时会出现卡顿与不跟手：当因ListView中展示了大量数据的时候，滑动列表你会发现没有少量数据的时候的跟手与流畅，
      这是因为ListView为了渲染大量数据需要大量的内存和计算，这对手机资源是一个很大的消耗，尤其是在一些低端机上甚至会出现OOM（内存溢出）

ListView的这种性能问题一直困扰着RN开发者。有能力的公司、团队都纷纷对ListView做优化，封装自己的列表组件，然而对性能的提升
并不大，所以现在急需一个高性能的列表组件，于是便有了设计FlatList的构想

# 那FlatList都有哪些特性呢？

FlatList是基于VirtualizedList的，要说FlatList的特性还要从VirtualizedList说起

# VirtualizedList

VirtualizedList 是 FlatList 与 SectionList 的底层实现。VirtualizedList通过维护一个有限的渲染窗口（其中包含可见的元素），
并将渲染窗口之外的元素全部用合适的定长空白空间代替的方式，极大的改善了内存消耗以及在有大量数据情况下的使用性能。这个
渲染窗口能响应滚动行为。当一个元素离可视区太远时，它就有一个较低优先级；否则就获得一个较高的优先级。渲染窗口通过这种
方式逐步渲染其中的元素（在进行了任何交互之后），以尽量减少出现空白区域的可能性

#特性

    VirtualizedList有以下特性：

        * 支持滚动加载（具体可以借助onEndReached的回调，做数据动态加载）
        * 支持下拉刷新（借助onRefresh / refreshing 属性实现）
        * 支持可配置的可见性回调（借助onViewableItemsChanged / viewabilityConfig实现）
        * 更动方向增加对Horizontal（水平）方向的支持
        * 更加智能的Item以及section separators支持
        * 支持Multi-column（借助numColumns属性实现）
        * 添加scrollToEnd,scrollToIndex,和scrollToItem方法的支持
        * 对 Flow 更加友好

4:51


1:31