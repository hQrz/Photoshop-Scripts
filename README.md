# Photoshop-Scripts
1. 导出图层
导出文档范围：所有在PS中打开的文档
导出格式：PNG、JPEG
导出位置：默认在F盘中，也可以自行修改脚本中的导出位置
其它功能：
    a.指定图层名称
    b.隐藏图层是否导出

3. 检查字体
检查范围：所有在PS中打开的文档
检查字体范围：朴朴规定的字体，也可以自行修改，但是要修改为字体对应的PostScript Name。脚本提供获取PostScript Name的函数，需要执行修改脚本 
检查结果：显示在文本框中，列出有问题的图层
其它功能：
    a.文字图层中包含多字体，只检查第一个字符的字体，其余字符都修改为首字符的字体
    b.可以打印图层中的所有字体，但是需要修改脚本的函数调用。
