/*
For LL

ps编程参考
https://www.adobe.com/content/dam/acom/en/devnet/photoshop/pdfs/photoshop-cc-javascript-ref-2019.pdf
ps编程指导
​https://www.adobe.com/content/dam/acom/en/devnet/photoshop/pdfs/photoshop-cc-scripting-guide-2019.pdf

By hQ   2022.8.4  21:49
*/

/*////////////////////////////////// Scripting Tips  ////////////////////////////////////////////////
1. PhotoShop存储文字的方式如下：
    a.令Layer的typename是ArtLayer
    b.令ArtLayer的kind为LayerKind.TEXT
    c.给ArtLayer的TextItem赋值，其中属性content是文字内容，属性font是字体的后端名称(PostScriptName)，TextItem其余属性见文档
2. 字体有前后端名称，前端作为在不同语种系统下的显示名称，后端PostScript Name作为唯一ID在系统中使用
3. 处理文档时，要令 “app.activeDocumentd = docs[当前文档]”，否则图层的kind均为 NROMAL
*/

/*///////////////////////////////// 使用说明 ///////////////////////////////////////////////////
功能：检查所有打开的PS文件中的文字字体是否符合朴朴要求(截至2022.8.4)
1. 文件->脚本->浏览 ， 在文件浏览中选择本脚本运行
2. 程序运行结束，在对话框中可以看见检查结果
*/

///////////////////////////////////Help Var ///////////////////////////////////////////////
//朴朴允许的字体名称
var PuPuFonts = [
    "zihun2hao-liliangcuheiti",
    "zihun3hao-yingxiongheiti",
    "zihun5hao-wuwairunheiti",
    "zihun15hao-minguohuabaoti-Regular",
    "20--Regular",
    "21--Regular",
    "24--Regular",
    "zihun27hao-budingti-Regular",
    "zihun31hao-ningsong-Regular",
    "35--Regular",
    "43--Regular",
    "45--Regular",
    "49--Regular",
    "50--Regular",
    "zihun55hao-longyinshoushu",
    "56--Regular",
    "zihun64hao-mengquruantangti",
    "zihun84hao-yunxijinshu",
    "zihun100hao-fangfangxianfengti",
    "zihun103hao-haitangshoushu",
    "zihun109hao-fanggexiziti",
    "zihun110hao-wulinjianghuti",
    "zihun111hao-jibangzhaopaiti",
    "zihun131hao-kulechaowanti",
    "zihun137hao-chanyinglishu",
    "zihun138hao-baranshoushu",
    "zihun142hao-xiaohuanxiong",
    "zihun143-zhengkuchaojihei",
    "zihun144hao-langyuanti",
    "zihun156hao-mengqusudabing",
    "zihun166hao-quweiti",
    "zihun178hao-xinchaozhuoyueti",
    "zihun181hao-feichibiaotiti",
    "zihun184hao-yinyichuangshihei",
    "zihun189hao-xingyanleheiti",
    "zihun191hao-naiyouxuegaoti",
    "zihun199hao-mengqucuicuiti",
    "zihun203hao-xinchaobowenti",
    "zihun222hao-mengquhahasong",
    "zihun227hao-mengquluoboti",
    "zihun231hao-tucaoxingrenti",
    "zihun232hao-caihonggaoguangti",
    "XQzhishuaiti",
    "XQzhaopaitiJF",
    "XiQuezhaopaiti-Regular",
    "Zaishanlintinew-Regular",
    "XiQuezaishanlinti-regular",
    "XQyanshutiJF",
    "XiQuexiaoqingsong-regular",
    "XiquewudongmianTi-regular",
    "XiQueLedunti-Regular",
    "XiQuejuzhenti-regular",
    "XiQueguzidian-regular",
    "GuFengXiaoKaiXique-regular",
    "SourceHanSerifCN-Heavy",
    "SourceHanSerifCN-Bold",
    "SourceHanSerifCN-SemiBold",
    "SourceHanSerifCN-Regular",
    "SourceHanSerifCN-Medium",
    "SourceHanSerifCN-Light",
    "SourceHanSerifCN-ExtraLight",
    "NotoSansHans-Black",
    "NotoSansHans-Bold",
    "NotoSansHans-Medium",
    "NotoSansHans-Regular",
    "NotoSansHans-Light",
    "NotoSansHans-Thin",
    "NotoSansHans-DemiLight"
];
var docs = app.documents;
var fontInfo = "";//最终打印的结果
var fontbook = {};//字体字典 {PostName : FontName}
initFontBook();//生成字体名称与字体系统后端名称的字典
CheckDocs ();
//PrintDocsFonts ();//生成字体信息，excel处理后粘贴到PuPuFonts中
dialogShow ();

///////////////////////////////////Help Functions///////////////////////////////////////////////
//导出文档中的所有字体
function PrintDocsFonts(){
    for(var i = 0;i<docs.length;i++){
            app.activeDocument = docs[i];
            fontInfo += "《" +docs[i].name.split(".")[0] + "》图层对应字体情况如下：\n";
            var textlayers = [];
            //递归查找所有包含文字的图层
            textlayers = GetTextLayers(docs[i],textlayers);
           //查询所有文字图层的文字类型
            for(var j = 0;j<textlayers.length;j++){
                var postname = textlayers[j].textItem.font;
                var fontname = fontbook[postname];
                fontInfo += textlayers[j].textItem.contents+","+postname +"\n";
            }
            fontInfo += "\n\n-------------------------------------------------------------------------------\n\n";
    }
}

function  initFontBook(){
    for(var i = 0;i < app.fonts.length;i++){
        fontbook[app.fonts[i].postScriptName] = app.fonts[i].name;
    }
}
//检查文档，打印违规字体
function  CheckDocs(){
    for(var i = 0;i<docs.length;i++){
        app.activeDocument = docs[i];
        var allfonts = [];
        allfonts = GetDocFonts (docs[i],allfonts);
        if(allfonts.length > 0){
            fontInfo += "！！！《" +docs[i].name.split(".")[0] + "》检查情况：\n";
            fontInfo += allfonts.join("\n");
            fontInfo += "\n\n-------------------------------------------------------------------------------\n\n";
        }else{
            fontInfo += " --《" +docs[i].name.split(".")[0] + "》 "+"正常 Good。--\n\n-------------------------------------------------------------------------------\n\n";
        }
        delete allfonts;
    }
}

//查询list中是否含有元素ele
function  findElement(list,ele){
    for(var i = 0; i < list.length;i++){
        if(list[i]==ele)
            return i;
    }
    return -1;
}

//获取该文档的字体集合
function  GetDocFonts(doc,allfonts){
    var textlayers = [];
    //递归查找所有包含文字的图层
    textlayers = GetTextLayers(doc,textlayers);
   //查询所有文字图层的文字类型
    for(var j = 0;j<textlayers.length;j++){
        if(textlayers[j].textItem.contents.length > 0){
            var postname = textlayers[j].textItem.font;
            var fontname = fontbook[postname];
            
            textlayers[j].textItem.font = postname;
            
            if(findElement(PuPuFonts,postname)== -1){
                allfonts.push("#图层名称：[   "+ textlayers[j].name +"   ] "+"  #文本内容：["+textlayers[j].textItem.contents+" ] ==违规字体==> "+fontname+" ( PostName："+postname+")");
        }}else{
            allfonts.push("#图层名称：[   "+ textlayers[j].name +"   ] 是空白的，没有内容。");
        }
    }
    return allfonts;
}
//获取所有字体图层
function  GetTextLayers (doc, allLayers){
    for (var m = 0; m < doc.layers.length; m++){
        var theLayer = doc.layers[m];
        if (theLayer.typename === "ArtLayer" && theLayer.kind == LayerKind.TEXT){
            allLayers.push(theLayer);
        }else{
            if (theLayer.typename == "LayerSet"){
                GetTextLayers(theLayer, allLayers);
            }
        }
    }
    return allLayers;
}
//显示结果
var dialog;
function  dialogShow() {
    dialog = new Window("dialog","字体信息");
    dialog.orientation = "column";
    dialog.alignChildren = ["center", "top"];
    dialog.spacing = 10;
    dialog.margins = 16;
    dialog.height = 100;
    dialog.width = 300;

    dialog.close=true;//无用的代码
 
    statictext1 = dialog.add("statictext");
    statictext1.text = "所有打开文档字体信息：";

    var etext = dialog.add("edittext",[16,20,500,300],"",{multiline :true});
    etext.text = fontInfo
    
    var btexit = dialog.add("button");
    btexit.text="退出";
    btexit.removeEventListener("click",exitDialog);
    btexit.addEventListener("click",exitDialog);

    dialog.show();
}
function  exitDialog(){
    dialog.close()
}