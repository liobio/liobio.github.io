---
icon: table
category:
  - 杂项
tag:
  - Test

---
# 1.30 Test

## 数组和链表的实现原理

- **数组**
  - 本质就是在内存中开辟的一段连续的空间地址，每个元素空间的大小对应泛型的数据大小，通过访问数组元素对应索引的地址直接访问数据内容，所以按下标访问数据的时间复杂度直接为O(1)
  - 因为数组内存地址的连续性，所以数组移动元素位置操时作需要依次其他元素的内存地址。效率较低，另外实际使用中还要考虑下标访问越界的情况
  - 数组可以很好的管理同一类型数据，因为访问下标速度快，经常在其他数据结构中被用到

- **链表**

  - 和数组刚好相反 ，链表的内存地址是不连续性的，因为他可以动态开辟内存空间，不会有要向数组一样，在编译前就需要确定内存空间大小，且编译后内存空间固定的情况，非常灵活。最简单的链表结构就是单链表，只需要一个可以储存数据内容和储存下个一点内存地址的结构体就可以实现，当N个这个结点头尾相连时 它们就实现了一个单链表结构，只需要知道第一个结点 也就是头结点就可查询或者操作整个链表

  - 因为链表实际上就是N个节点头尾相连，所以对链表的增删插等操作十分简单，只需要剔除对应结点或者直接“插队“在两个结点之间，动态性强( 插入和删除为O(1) )。缺点就是查询某一个数据时，在单链表中需要从头开始依次查询每一个数据，最坏的结果就是，你甚至需要遍历完整个单链表才能知道尾结点的数据到底是什么( 查询为O(N) )。

  - 应用场景：在不知道你要管理数据内容的大小的情况下，或者频繁使用插入删除操作时且查询操作少的情况下可以使用链表

要想实现出队时间复杂度为O(1),就不能有大量的移动元素操作，但是也可以多添加变量储存队列头尾的信息结合数组的访问下标的时间复杂度实现以上要求，代码如下：

```c#
Public Class MyQueue<T> {
    
    private T[] datas;
    private int head;
    private int tail;
    private int max;
    public MyQueue<T>(int size){ 
        this.max=size;
        this.head=0;
        this.tail=0;
        this.datas=new T(size);
    }
    public bool EnQueue (T Node){
        if((tail+1)%max==head){
            print("QueueIsMaxNow");
            retuen false;
        }
        else{
            date[tail]=Node;
            tail=(tail+1)%max;
            return true;
        }
    }
    public T Dequeqe(){ 
        if(head==tail){
            print("QueueisNUllNow")
            return null;
        }else{
            T node=datas[head];
            head=(head+1)%max;
            return node;
        }        
    }
}
```
