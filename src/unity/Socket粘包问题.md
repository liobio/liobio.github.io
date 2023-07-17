---
icon: newspaper
category: unity
tag: socket
---
# Socket粘包问题

## 原因

TCP协议是面向字节流传输的，TCP协议会保证字节流传输时顺序不会改变，不会丢失内容，但是TCP协议会灵活的拆分或者合并用户Socket.Send(buffer)出来的内容，将小的数据整合发送或者是将大的数据拆开发送。

所以在实际的编程中就会出现服务端一次Receive就收到了客户端多次Send的数据（“粘包”），或者是客户端只Send了一次，服务端却要多次Receive才能完整接收。

## 解决方法
 **数据包首部添加数据包长度**

自己自定义报文格式，发送时根据固定的格式封包，接收时再按照这个格式解包

接收到数据时，先解析首部的“数据包长度”，再解析数据包内容，如果数据包内容的长度不足数据包首部规定的长度，则认为出现了“分包”，需要等待接收下一个数据包，直到传输完整。如果数据包内容的长度大于数据包首部规定的长度，则出现了“粘包”需要认为将粘包分开。

## 具体实现

**Array.Copy(Array, Int64, Array, Int64, Int64)**

复制 Array中的一系列元素（从指定的源索引开始），并将它们粘贴到另一个Array中（从指定的目标索引开始）。 长度和索引指定为 64 位整数。

```csharp
public static void Copy (Array sourceArray, long sourceIndex, Array destinationArray, long destinationIndex, long length);
```

**自定义发送报文格式**

```csharp
/// <summary>
/// 把int32类型的数据转存到4个字节的byte数组中
/// </summary>
/// <param name="m">int32类型的数据
/// <param name="arry">4个字节大小的byte数组
/// <returns></returns>
private bool ConvertIntToByteArray(Int32 m, ref byte[] arry)
{
	if (arry == null) return false;
	if (arry.Length < 4) return false;
	arry[0] = (byte)(m & 0xFF);
	arry[1] = (byte)((m & 0xFF00) >> 8);
	arry[2] = (byte)((m & 0xFF0000) >> 16);
	arry[3] = (byte)((m >> 24) & 0xFF);
	return true;
}
private byte[] GetSendData(string text)
{
	//数据包内容
	byte[] content = Encoding.Default.GetBytes(text);
	//数据包头部
	byte[] header = new byte[4];
	ConvertIntToByteArray(content.Length, ref header);
	//最终封装好的数据包，数据包首位 0 消息 1 文件，2-5位 数据长度
	byte[] dataToBeSend = new byte[content.Length + 5];
	dataToBeSend[0] = 0;
	Array.Copy(header, 0, dataToBeSend, 1, header.Length);
	Array.Copy(content, 0, dataToBeSend, 5, content.Length);
	return dataToBeSend;
}

```

解包类

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScoketWinform
{
    public class SocketTcpPack
    {
        /// <summary>
        /// 接收是否完成了
        /// </summary>
        public bool IsComplete = false;
        /// <summary>
        /// 接收缓存
        /// </summary>
        public byte[] Buffer;
        /// <summary>
        /// 下次接收从Buffer的哪里开始写入
        /// </summary>
        public int Offset = 0;
        /// <summary>
        /// 下次写入Buffer的长度
        /// </summary>
        public int Size;
        /// <summary>
        /// 接收到的数据
        /// </summary>
        public List<ReceiveDataModel> DataList = new List<ReceiveDataModel>();

        /// <summary>
        /// 缓存长度
        /// </summary>
        private readonly int BufferLength;
        public SocketTcpPack(int bufferLength = 1024)
        {
            BufferLength = bufferLength;
            Buffer = new byte[BufferLength];
            Size = BufferLength;
        }
        /// <summary>
        /// 处理接收到的数据
        /// </summary>
        /// <param name="currentDataSize">接收到的数据长度，Socket.Receive()方法返回的数值</param>
        public void UntiePack(int currentDataSize)
        {
            //Size != BufferLength说明Buffer中保留了一些上次接收的数据，要把这部分数据长度加上
            int dataSize = currentDataSize;
            if (Size != BufferLength)
            {
                dataSize += Offset;
            }
            if (DataList.Count == 0)
            {
                SplitData(Buffer, dataSize);
            }
            else
            {
                //取出DataList中的最后一个元素，通过判断这个元素是否完整来判断是有分包需要补充完整
                ReceiveDataModel LastReceiveData = DataList[DataList.Count - 1];
                if (LastReceiveData.IsComplete)
                {
                    SplitData(Buffer, dataSize);
                }
                else
                {
                    //最后一个包的剩余长度
                    int remainingDataLength = LastReceiveData.DataLength - LastReceiveData.Content.Length;
                    //剩余长度 < 本次接收的数据长度，说明这一次接收就可以把上一个分包补充完整
                    if (remainingDataLength < dataSize)
                    {
                        int realLength = LastReceiveData.Content.Length;
                        byte[] b = new byte[LastReceiveData.DataLength];
                        Array.Copy(LastReceiveData.Content, 0, b, 0, LastReceiveData.Content.Length);
                        LastReceiveData.Content = b;
                        Array.Copy(Buffer, 0, LastReceiveData.Content, realLength, remainingDataLength);

                        //继续处理剩下的数据
                        byte[] last = new byte[dataSize - remainingDataLength];
                        Array.Copy(Buffer, remainingDataLength, last, 0, last.Length);
                        SplitData(last, last.Length);
                    }
                    //剩余长度 > 本次接收的数据长度，说明这一次接收还不能把上一个分包补充完整，还需要继续等待接收
                    else if (remainingDataLength > dataSize)
                    {
                        int realLength = LastReceiveData.Content.Length;
                        byte[] b = new byte[LastReceiveData.Content.Length + dataSize];
                        Array.Copy(LastReceiveData.Content, 0, b, 0, LastReceiveData.Content.Length);
                        LastReceiveData.Content = b;
                        Array.Copy(Buffer, 0, LastReceiveData.Content, realLength, dataSize);

                        Offset = 0;
                        Size = BufferLength;
                        Buffer = new byte[BufferLength];
                    }
                    else
                    {
                        int realLength = LastReceiveData.Content.Length;
                        byte[] b = new byte[LastReceiveData.DataLength];
                        Array.Copy(LastReceiveData.Content, 0, b, 0, LastReceiveData.Content.Length);
                        LastReceiveData.Content = b;
                        Array.Copy(Buffer, 0, LastReceiveData.Content, realLength, remainingDataLength);

                        Offset = 0;
                        Size = BufferLength;
                        Buffer = new byte[BufferLength];
                        IsComplete = true;
                    }
                }
            }
        }

        /// <summary>
        /// 处理byte[]前5位就是包首部的这种数据
        /// </summary>
        /// <param name="data">byte[]</param>
        /// <param name="dataSize">内容的实际长度</param>
        private void SplitData(byte[] data, int dataSize)
        {
            //长度 <= 5 说明包首部还没有接收完成，需要继续接收
            if (dataSize <= 5)
            {
                byte[] temp = new byte[BufferLength];
                Array.Copy(data, 0, temp, 0, dataSize);
                Buffer = temp;
                Offset = dataSize;
                Size = BufferLength - dataSize;
                IsComplete = true;
                return;
            }

            //包首部
            byte[] header = new byte[5];
            //包内容
            byte[] content = new byte[dataSize - 5];

            Array.Copy(data, 0, header, 0, 5);
            Array.Copy(data, 5, content, 0, dataSize - 5);

            //包内容长度
            int dataLength = BitConverter.ToInt32(header, 1);

            //dataLength < content.Length 说明本次接收的数据中已经包含一个完整的包，将这个完整的包取出后继续处理剩下的数据
            if (dataLength < content.Length)
            {
                //发生了粘包
                byte[] b = new byte[dataLength];
                Array.Copy(content, 0, b, 0, dataLength);
                ReceiveDataModel receiveData = new ReceiveDataModel()
                {
                    DataType = header[0],
                    DataLength = dataLength,
                    Content = b
                };
                DataList.Add(receiveData);
                byte[] last = new byte[content.Length - dataLength];
                Array.Copy(content, dataLength, last, 0, last.Length);
                SplitData(last, last.Length);
            }
            //dataLength >= content.Length 说明本次接收的数据不完整，保存后继续接收
            else if (dataLength >= content.Length)
            {
                //发生了分包或者什么都没发生
                ReceiveDataModel receiveData = new ReceiveDataModel()
                {
                    DataType = header[0],
                    DataLength = dataLength,
                    Content = content
                };
                DataList.Add(receiveData);
                Offset = 0;
                Size = BufferLength;
                Buffer = new byte[BufferLength];
                if (dataLength == content.Length) IsComplete = true;
            }
        }

        public void Clear()
        {
            if (DataList.Count > 0)
            {
                DataList.Clear();
                IsComplete = false;
            }
        }
    }

    public class ReceiveDataModel
    {
        /// <summary>
        /// 数据类型 0 文本，1 文件
        /// </summary>
        public byte DataType { get; set; }
        /// <summary>
        /// 数据长度
        /// </summary>
        public int DataLength { get; set; }

        /// <summary>
        /// 数据
        /// </summary>
        public byte[] Content { get; set; }
        public bool IsComplete
        {
            get
            {
                if (DataLength == 0) return false;
                return DataLength == Content.Length;
            }
        }
    }
}

```

**具体使用**

::: code-tabs#shell
@tab 发送端

```csharp
public class SocketDemo : MonoBehaviour
{
    // Start is called before the first frame update
    public Text laber;
    string serverIP = "127.0.0.1";
    int PortNo = 2023;
    byte[] RecBuffer = new byte[1024];
    string ErrorInfo;
    Socket clientSocket;
    void Start()
    {
        laber.text = ReceivedMsg;
        IPAddress ip = IPAddress.Parse(serverIP);
        clientSocket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

        try
        {
            clientSocket.Connect(new IPEndPoint(ip, PortNo)); //配置服务器IP与端口
            Debug.Log("连接服务器成功");
        }
        catch
        {
            Debug.Log("连接服务器失败！");
            return;
        }
        
        clientSocket.BeginReceive(RecBuffer, 0, 1024, SocketFlags.None, ReceiveWinMsg, null);
        SendSeverMsg("msg");

    }
    public void SendSeverMsg(string msg)
    {
        try
        {
            byte[] dataToBeSend = GetSendData(msg.Trim());
            clientSocket.Send(dataToBeSend);
            Debug.Log("向服务器发送消息：" + msg);
        }
        catch (Exception exp)
        {
            Debug.LogError(exp.Message);
            //发生数据异常-自动断开连接
            CloseConnect();
        }
    }
}
    
```

@tab 接收端

```csharp
private Socket serverSocket;
private Socket clientSocket;
/// <summary>
/// 存储客户端连接
/// </summary>
private Dictionary<string, Socket> ClientSocketList = new Dictionary<string, Socket>();

public void StartServer()
{
    //在服务端创建一个负责监听IP和端口号的Socket
    IPAddress ipAddress = IPAddress.Parse("127.0.0.1");
    this.serverSocket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
    //绑定端口号
    this.serverSocket.Bind(new IPEndPoint(ipAddress, 2023));
    //设置监听
    this.serverSocket.Listen(10);
    Msg= string.Concat("启动监听:", this.serverSocket.LocalEndPoint.ToString(), "成功");
    serverSocket.BeginAccept(Accept,serverSocket);
}

private void Accept(IAsyncResult result)
{
    Socket socket = (Socket)result.AsyncState;
    Socket clientSocket = socket.EndAccept(result);
    string clientIP = clientSocket.RemoteEndPoint.ToString();
    ClientSocketList.Add(clientIP, clientSocket);
    Msg = clientIP + "连接成功";
    IP = clientIP;
    SocketTcpPack tcpPack = new SocketTcpPack(1024);
    ReceiveBufferDic.Add(clientIP, tcpPack);
    //开始接受客户端消息
    clientSocket.BeginReceive(ReceiveBufferDic[clientIP].Buffer, ReceiveBufferDic[clientIP].Offset, ReceiveBufferDic[clientIP].Size, SocketFlags.None, Receive, clientSocket);
    //接受下一个连接
    socket.BeginAccept(Accept, socket);
}
/// <summary>
/// BeginReceive的回调
/// </summary>
/// <param name="result"></param>
private void Receive(IAsyncResult result)
{
    Socket socket = (Socket)result.AsyncState;
    try
    {
        string clientIP = socket.RemoteEndPoint.ToString();
        int dataSize = socket.EndReceive(result);
        if (dataSize > 0)
        {
            //对接收到的消息进行解包
            ReceiveBufferDic[clientIP].UntiePack(dataSize);
            if (ReceiveBufferDic[clientIP].IsComplete)
            {
                foreach (var item in ReceiveBufferDic[clientIP].DataList)
                {
                    string str = Encoding.UTF8.GetString(item.Content, 0, item.DataLength);
                    Msg = socket.RemoteEndPoint + ":" + str;
                }
                ReceiveBufferDic[clientIP].Clear();
            }
            //接收下一条消息
            socket.BeginReceive(ReceiveBufferDic[clientIP].Buffer, ReceiveBufferDic[clientIP].Offset, ReceiveBufferDic[clientIP].Size, SocketFlags.None, Receive, socket);
        }
        else
        {
            Close(clientIP);
        }         
    }
    catch (SocketException)
    {
        string ip = socket.RemoteEndPoint.ToString();
        Close(ip);
    }
}
```

:::
