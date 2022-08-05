/*
For LL

ps编程参考
https://www.adobe.com/content/dam/acom/en/devnet/photoshop/pdfs/photoshop-cc-javascript-ref-2019.pdf
ps编程指导
​https://www.adobe.com/content/dam/acom/en/devnet/photoshop/pdfs/photoshop-cc-scripting-guide-2019.pdf

By hQ 2022.8.4  20:29
*/

/*///////////////////////////////// 使用说明 ///////////////////////////////////////////////////
功能：将所有打开的PS文件中的指定图层导出到指定格式
1. 文件->脚本->浏览 ， 在文件浏览中选择本脚本运行
2. 可以在输入框中输入要提取的图层名称，空白则表示提取全部图层
3. 点击要导出的图片格式
4. 程序运行结束，默认到 "F:/一日一厨导出图/" 中获取导出的图层
5. 可以修改下面exportFolderPath的值，指定要导出的位置
*/
var exportFolderPath = "F:/一日一厨导出图/";
var isExportHideLayers = false;
var dialog;
var etext;
var docs = [];
docs = app.documents;
dialogShow()

///////////////////////////////////Help Functions///////////////////////////////////////////////
function GetArtLayers (doc, allLayers){
    for (var m = 0; m < doc.layers.length; m++){
        var theLayer = doc.layers[m];
        if (theLayer.typename === "ArtLayer"){
            if(isExportHideLayers == false){
                //alert(theLayer.visible,theLayer.name);
                if(theLayer.visible == true){
                    allLayers.push(theLayer);
            }}else{
                allLayers.push(theLayer);
             }
        }else{
            if (theLayer.typename == "LayerSet" && theLayer.visible == true)
                GetArtLayers(theLayer, allLayers);
        }
    }
    return allLayers;
}
function printLayersName(layerss){
    var text  = "";
    for(var i = 0; i < layerss.length; i++){
        var layer = layerss[i];
        text = text + layer.name + "\n";
    }
    alert(text);
}
function ExportLayers(doc,saveType){
    var docname = doc.name.split(".")[0];
    var docFolderPath = doc.path.fsName.split("\\");
    var docFolderName = docFolderPath[docFolderPath.length-1];
    var prefix = docFolderName + "_" + docname+"_";      //在这里修改导出文件的前缀，单词文件名为 前缀+图层名
    var folderpath = exportFolderPath;
    //var folderpath = doc.path + "/" + docname + "/";  //在这里修改导出的位置，默认为psd文件所在位置
    var folder = Folder(folderpath)
    if(!folder.exists) folder.create()

    var layers = [];
    layers = GetArtLayers(doc,layers);

    var vlayers = [];
    //保存所有可见的类，并隐藏
    for(var i = 0; i < layers.length; i++){
        var layer = layers[i];
        if (layer.visible == true) {
            vlayers.push(layer);
            layer.visible = false;
        }
    }

    for(var i = 0; i < layers.length; i++){
        var layer = layers[i];
        if (etext.text.length > 0 && etext.text != layer.name) {
            continue;
        }
        layer.visible = true;
        //保存
        var filename = prefix + layer.name;
        if(saveType == "png"){
            var file = new File(folderpath + filename+ ".png");
            var saveOptions = new PNGSaveOptions();
            doc.saveAs(file, saveOptions, true, Extension.NONE);
        }else if(saveType == "jpeg"){
            var file = new File(folderpath + filename+ ".jpeg");
            var saveOptions = new JPEGSaveOptions();
            doc.saveAs(file, saveOptions, true, Extension.NONE);
        }
        //隐藏
        layer.visible = false;
    }

    for(var i = 0; i < vlayers.length; i++){
        var layer = vlayers[i];
        layer.visible = true;
    }
}
// DIALOG  
function dialogShow() {
    dialog = new Window("dialog","导出图层");
    dialog.orientation = "column";
    dialog.alignChildren = ["center", "top"];
    dialog.spacing = 10;
    dialog.margins = 16;
    dialog.close=true;//无用的代码
 
    statictext1 = dialog.add("statictext");
    statictext1.text = "要导出的图层名称";

    etext = dialog.add("edittext",[16,20,200,50]);

    var btpng = dialog.add("button");
    btpng.text="PNG";
    btpng.removeEventListener("click",saveAsPNG);
    btpng.addEventListener("click",saveAsPNG);

    var btjpeg = dialog.add("button");
    btjpeg.text="JPEG";
    btjpeg.removeEventListener("click",saveAsJPEG);
    btjpeg.addEventListener("click",saveAsJPEG);

   // var stExportAll = dialog.add("statictext");
   // stExportAll.text = "是否导出隐藏图层？";
    var cbExportAll = dialog.add("checkbox");
    cbExportAll.text = "是否导出隐藏图层？";
    cbExportAll.removeEventListener("click",flipExportFlag);
    cbExportAll.addEventListener("click",flipExportFlag);
    
    var btexit = dialog.add("button");
    btexit.text="退出";
    btexit.removeEventListener("click",exitDialog);
    btexit.addEventListener("click",exitDialog);

    dialog.show();
}
function saveAsPNG(){
    dialog.close();
    for(var i = 0;i<docs.length;i++){
        app.activeDocument = docs[i];
        ExportLayers(docs[i],"png");
    }
    alert("导出完成");
}
function saveAsJPEG() {
    dialog.close();
    for(var i = 0;i<docs.length;i++){
        app.activeDocument = docs[i];
        ExportLayers(docs[i],"jpeg");
    }
    alert("导出完成");
}
function exitDialog(){
    dialog.close()
}
function flipExportFlag(){
    isExportHideLayers = !isExportHideLayers;
}