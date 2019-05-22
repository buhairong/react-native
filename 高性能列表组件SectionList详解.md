# SectionList

SectionList是一个基于VirtualizedList的高性能的分组(section)列表组件，支持下面这些常用的功能：

    * 完全跨平台
    * 支持水平布局模式
    * 行组件显示或隐藏时可配置回调事件
    * 支持单独的头部组件
    * 支持单独的尾部组件
    * 支持自定义行间分隔线
    * 支持下拉刷新
    * 支持上拉加载

它和<FlatList>不同之处在于它支持分组(section)列表的功能

    如果你的列表不需要分组(section),那么可以使用结构更简单的<FlatList>

# 简单用例

<SectionList
    renderItem = {({item}) => <ListItem title = {item.title} />}
    renderSectionHeader = {({section}) => <Header title={section.key} />}
    sections = {[ // 不同section渲染相同类型的子组件
        {data: [...], title: ...},
        {data: [...], title: ...},
        {data: [...], title: ...},
    ]}
/>

<SectionList
    sections = {[ // 不同section渲染不同类型的子组件
        {data: [...], renderItem: ...},
        {data: [...], renderItem: ...},
        {data: [...], renderItem: ...},
    ]}
/>

# 属性

    sections: $ReadOnlyArray<Section>

用来渲染的数据，类似于中的data属性。一般格式：

sections: $ReadOnlyArray<{data: $ReadOnlyArray<SectionItem>,renderItem?: ({item :Section})}>

    renderItem: (info: {item: Item, index: number}) => ?React.Element<any>

用来渲染每一个section中的每一个列表项的默认渲染器。可以在section级别上进行覆盖重写

    renderSectionHeader?:?(info: {section:SectionT}) => ?React.Element<any>

在每个section的头部渲染。在ios上，这些headers是默认粘接在ScrollView的顶部的。参见stickySectionHeadersEnabled

    refreshing?: ?boolean

在等待加载新数据时将此属性设为true,列表就会显示出一个正在的符号

    onRefresh?: ? () => void

如果设置了此选项，则会在列表头部添加一个标准的RefreshControl控件，以便实现“下拉刷新”的功能。同时你需要正确设置refreshing属性

    stickySectionHeadersEnabled?: boolean

当下一个section把它的前一个section的可视区推离屏幕的时候，让这个section的header粘连在屏幕的顶端。这个属性在ios上是默认可用的，
因为这是ios的平台规范

    ItemSeparatorComponent?:?ReactClass<any>

行与行之间的分隔线组件。不会出现在第一行之前和最后一行之后。

    ListFooterComponent?:?ReactClass<any>

通过它设置尾部组件

    ListHeaderComponent?:?ReactClass<any>

通过它设置头部组件

    ListEmptyComponent?:?ReactClass<any> | React.Element<any>

当列表为空时渲染。可以是一个React组件类，一个渲染函数，或一个已经渲染的元素

    SectionSeparatorComponent?:?ReactClass<any>

在每个section的顶部和底部渲染（区别于ItemSeparatorComponent,它仅在列表项之间渲染）。它的作用是为了从视觉上把section与它上方或
下方的headers区别开来，从这个意义上讲，它的作用和ItemSeparatorComponent是一样的，它也接受highlighted,[leading / trailing][Item / Separator]
这两个默认提供的属性或其他通过separators.updateProps添加的自定义属性

    extraData?:any

如果有除data以外的数据用在列表中(不论是用在renderItem还是Header或者Footer中)，请在此属性中指定。同时此数据在修改时也需要先修改
其引用地址（比如先复制到一个新的Object或者数组中），然后再修改其值，否则界面很可能不会刷新

    initialNumToRender: number

指定一开始渲染的元素数量，最好刚刚够填满一个屏幕，这样保证了用最短的时间给用户呈现可见的内容。注意这第一批次渲染的元素不会在滑动
过程中被卸载。这样是为了保证用户执行返回顶部的操作时，不需要重新渲染首批元素

    inverted?: ?boolean

翻转滚动方向。实质是将scale变换设置为-1

    keyExtractor: (item: ItemT, index: number) => string

此函数用于为给定的item生成一个不重复的key。Key的作用是使React能够区分同类元素的不同个体。以便在刷新时能够确定其变化的位置，减少
重新渲染的开销。若不指定此函数，则默认抽取item.key作为key值。若item.key不存在，则使用数组下标

    onEndReached?:?(info: {distanceFromEnd: number}) => void

当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用

    onEndReachedThreshold?: ?number

决定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如：0.5表示距离内容最底部的距离为当前列表
可见长度的一半时触发

# 方法

    scrollToLocation(params: object)

将可视区内位于特定sectionIndex 或 itemIndex (section内)位置的列表项，滚动到可视区的制定位置。比如说，viewPosition为0时将这个列表
项滚动到可视区顶部（可能会被顶部粘接的header覆盖）,为1时将它滚动到可视区底部，为0.5时将它滚动到可视区中央。viewOffset是一个以像素为
单位，到最终位置偏移距离的固定值，比如为了弥补粘接的header所占据的空间

注意：如果没有设置getItemLayout,就不能滚动到位于外部渲染区的位置。

    recordInteraction()

主动通知列表发生了一个事件，以使列表重新计算可视区域。比如说当waitForInteractions为true并且用户没有滚动列表时，就可以调用这个方法。
不过一般来说，当用户点击了一个列表项，或发生了一个导航动作时，我们就可以调用这个方法

    flashScrollIndicators()

短暂地显示滚动指示器

# 实例

