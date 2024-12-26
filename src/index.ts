// doT.js
// 2011-2014, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.
// Updated to TypeScript by Carlo Taleon 2024, https://github.com/Blankeos/dot.js

export interface TemplateSettings {
  evaluate: RegExp;
  interpolate: RegExp;
  encode: RegExp;
  use: RegExp;
  useParams: RegExp;
  define: RegExp;
  defineParams: RegExp;
  conditional: RegExp;
  iterate: RegExp;
  varname: string;
  strip: boolean;
  append: boolean;
  selfcontained: boolean;
  doNotSkipEncoded: boolean;
}

export type RenderFunction<T = Record<string, any>> = (data: T) => string;

declare global {
  interface String {
    encodeHTML(): string;
  }
}

export default class tsdot {
  static name = "tsdot";
  static version = "1.1.6";
  static templateSettings: TemplateSettings = {
    evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g,
    encode: /\{\{!([\s\S]+?)\}\}/g,
    use: /\{\{#([\s\S]+?)\}\}/g,
    useParams:
      /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
    define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
    defineParams: /^\s*([\w$]+):([\s\S]+)/,
    conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
    iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
    varname: "it",
    strip: true,
    append: true,
    selfcontained: false,
    doNotSkipEncoded: false,
  };
  // template: undefined; //fn, compile template
  // compile: undefined; //fn, for express

  static _globals: any = (function () {
    return tsdot || (0, eval)("this");
  })();

  static encodeHTMLSource(doNotSkipEncoded?: boolean): (input: string) => string {
    const encodings: Record<string, string> = {
      "&": "&#38;",
      "<": "&#60;",
      ">": "&#62;",
      '"': "&#34;",
      "'": "&#39;",
      "/": "&#47;",
    };

    const matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;

    return function (code) {
      return code
        ? code.toString().replace(matchHTML, function (m) {
            return encodings[m] || m;
          })
        : "";
    };
  }

  static startend = {
    append: { start: "'+(", end: ")+'", startencode: "'+encodeHTML(" },
    split: { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" },
  };

  static skip = /$^/;

  static resolveDefs(c: TemplateSettings, block: string | Function, def: Record<string, any>) {
    return (typeof block === "string" ? block : block.toString())
      .replace(c.define || tsdot.skip, function (m: any, code: any, assign: any, value: any) {
        if (code.indexOf("def.") === 0) {
          code = code.substring(4);
        }
        if (!(code in def)) {
          if (assign === ":") {
            if (c.defineParams)
              value.replace(c.defineParams, function (m: any, param: any, v: any) {
                def[code] = { arg: param, text: v };
              });
            if (!(code in def)) def[code] = value;
          } else {
            new Function("def", "def['" + code + "']=" + value)(def);
          }
        }
        return "";
      })
      .replace(c.use || tsdot.skip, function (m: any, code: any): any {
        if (c.useParams)
          code = code.replace(c.useParams, function (m: any, s: any, d: any, param: any) {
            if (def[d] && def[d].arg && param) {
              var rw = (d + ":" + param).replace(/'|\\/g, "_");
              def.__exp = def.__exp || {};
              def.__exp[rw] = def[d].text.replace(
                new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"),
                "$1" + param + "$2"
              );
              return s + "def.__exp['" + rw + "']";
            }
          });
        var v = new Function("def", "return " + code)(def);
        return v ? tsdot.resolveDefs(c, v, def) : v;
      });
  }

  static unescape(code: string) {
    return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
  }

  static template<T>(tmpl: string, c?: TemplateSettings | null, def?: {}): RenderFunction<T> {
    c = c || tsdot.templateSettings;
    var cse = c.append ? tsdot.startend.append : tsdot.startend.split,
      needhtmlencode,
      sid = 0,
      indv,
      str = c.use || c.define ? tsdot.resolveDefs(c, tmpl, def || {}) : tmpl;

    str = (
      "var out='" +
      (c.strip
        ? str
            .replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ")
            .replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "")
        : str
      )
        .replace(/'|\\/g, "\\$&")
        .replace(c.interpolate || tsdot.skip, function (m: any, code: any) {
          return cse.start + unescape(code) + cse.end;
        })
        .replace(c.encode || tsdot.skip, function (m: any, code: any) {
          needhtmlencode = true;
          return cse.startencode + unescape(code) + cse.end;
        })
        .replace(c.conditional || tsdot.skip, function (m: any, elsecase: any, code: any) {
          return elsecase
            ? code
              ? "';}else if(" + unescape(code) + "){out+='"
              : "';}else{out+='"
            : code
              ? "';if(" + unescape(code) + "){out+='"
              : "';}out+='";
        })
        .replace(c.iterate || tsdot.skip, function (m: any, iterate: any, vname: any, iname: any) {
          if (!iterate) return "';} } out+='";
          sid += 1;
          indv = iname || "i" + sid;
          iterate = unescape(iterate);
          return (
            "';var arr" +
            sid +
            "=" +
            iterate +
            ";if(arr" +
            sid +
            "){var " +
            vname +
            "," +
            indv +
            "=-1,l" +
            sid +
            "=arr" +
            sid +
            ".length-1;while(" +
            indv +
            "<l" +
            sid +
            "){" +
            vname +
            "=arr" +
            sid +
            "[" +
            indv +
            "+=1];out+='"
          );
        })
        .replace(c.evaluate || tsdot.skip, function (m: any, code: any) {
          return "';" + unescape(code) + "out+='";
        }) +
      "';return out;"
    )
      .replace(/\n/g, "\\n")
      .replace(/\t/g, "\\t")
      .replace(/\r/g, "\\r")
      .replace(/(\s|;|\}|^|\{)out\+='';/g, "$1")
      .replace(/\+''/g, "");
    //.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

    if (needhtmlencode) {
      if (!c.selfcontained && tsdot._globals && !tsdot._globals._encodeHTML)
        tsdot._globals._encodeHTML = tsdot.encodeHTMLSource(c.doNotSkipEncoded);
      str =
        "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : (" +
        tsdot.encodeHTMLSource.toString() +
        "(" +
        (c.doNotSkipEncoded || "") +
        "));" +
        str;
    }
    try {
      // @ts-ignore
      return new Function(c.varname, str);
    } catch (e) {
      /* istanbul ignore else */
      if (typeof console !== "undefined")
        console.log("Could not create a template function: " + str);
      throw e;
    }
  }

  static compile(tmpl: string, def?: {}) {
    return tsdot.template(tmpl, null, def);
  }
}
