const ncname = '[a-zA-Z_][\\w\\-\\.]*'; // 标签名 <div></div>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 用来获取标签名：match后索引为1的
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配闭合标签
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的key=value{"xx"| 'xx'| xx }
const startTagClose = /^\s*(\/?)>/; // /> </div>
const defaultRE = /\{\{((?:.|\r?\n))+?\}\}/g; // {{xxxx}}
//const doctype = /^<!DOCTYPE [^>]+>/i
//const comment = /^<!\--/
//const conditionalComment = /^<!\[/

function start(tagName, attributes) {

}

function end(tagName) {

}
function chars(text) {

}
//html字符串解析成对应的脚本来触发 tokens <div id="app">{{name}}</div>
function parserHTML(html) {
    function advance(len) {
        html = html.substring(len)
    }
    function parserStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1], //标签名
                attrs: []
            }
            advance(start[0].length)
            let end; //如果没有遇到标签结尾就会不停的解析
            let attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
                advance(attr[0].length)
            }
            if (end) {
                advance(end.length)
            }
        }
        return false; //不是开始标签
    }
    while (html) { //要解析的内容是否存在
        let textEnd = html.indexOf('<')
        if (textEnd == 0) {
            const startTagMatch = parserStartTag(html) //解析开始标签
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue;
            }
            break;
            // const endTagMatch = parserEndTag() //解析开始标签
            // if (endTagMatch) {

            // }
        }
        let text; //  {{name}}</div>
        if (textEnd > 0) {
            text = html.substring(0, textEnd)
        }
        if(text){
            chars(text)
            advance(text.length)
        }

    }
}


export const compileToFunction = function (template) {
    //库 htmlparser2
    parserHTML(template)
}
