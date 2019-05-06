##########
在React Native中布局采用的是FlexBox（弹性框）进行布局。
FlexBox提供了在不同尺寸设备上都能保持一致的布局方式。FlexBox是CSS3弹性框布局规范，
目前还处于最终征求意见稿阶段，并不是所有的浏览器都支持FlexBox，但大家在做React Native开发时
不必担心FlexBox的兼容性问题，因为既然React Native选择用FlexBox布局，那么React Native对
FlexBox的支持自然会做的很好。

#################
在React Native中尺寸是没有单位的，它代表了设备独立像素。
<View style={{width:100,height:100}}>
    <Text style={{fontSize:16}}>尺寸</Text>
</View>
上述代码，运行在Android上时，View的长和宽被解释成:100dp 100dp 单位是dp
字体被解释成: 16sp 单位是sp
运行在IOS上时尺寸单位被解释成了pt
这些单位确保了布局在任何不同dp的手机屏幕上显示不会发生改变

##############
React Native中的FlexBox 和 Web CSS上的FlexBox工作方式是一样的。但有些地方还是有出入的。
React Native中的FlexBox和Web CSS上FlexBox的不同之处
* flexDirection:React Native中默认为flexDirection:'column',在Web CSS中默认为flex-direction:'row'
* alignItems:React Native中默认为alignItems:'stretch',在Web CSS中默认align-items:'flex-start'
* flex:相比Web CSS的flex接受多参数，如 flex: 2 2 10%; , 但在React Native中flex只接受一个参数
* 不支持属性：align-content,flex-basis,order,flex-basis,flex-flow,flex-grow,flex-shrink

父视图属性（容器属性）
flexDirection: 定义了父视图中的子元素沿横轴或侧轴的排列方式
    row： 从左向右依次排列
    column： 默认的排列方式，从上向下排列
    row-reverse：从右向左依次排列
    column-reverse：从下向上排列
flexWrap:定义了子元素在父视图内是否允许多行排列，默认为nowrap
    wrap:flex的元素只排列在一行上，可能导致溢出
    nowrap:flex的元素在一行排列不下时，就进行多行排列
justifyContent: flex-start,flex-end,center,space-between,space-around
alignItems: flex-start,flex-end,center,stretch
