async function buildContainer(){
    const reg = (o, n) => o ? o[n] : '';
    const cn = (o, s) => o ? o.getElementsByClassName(s) : null;
    const tn = (o, s) => o ? o.getElementsByTagName(s) : null;
    const gi = (o, s) => o ? o.getElementById(s) : null;
    const rando = (n) => Math.round(Math.random() * n);
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const ele = (t) => document.createElement(t);
    const attr = (o, k, v) => o.setAttribute(k, v);
    const reChar = (s) => typeof s == 'string' && s.match(/&#.+?;/g) && s.match(/&#.+?;/g).length > 0 ? s.match(/&#.+?;/g).map(el=> [el,String.fromCharCode(/d+/.exec(el)[0])]).map(m=> s = s.replace(new RegExp(m[0], 'i'), m[1])).pop() : s;
    const a = (l, r) => r.forEach(a => attr(l, a[0], a[1]));
    const unqHsh = (a,o) => a.filter(i=> o.hasOwnProperty(i) ? false : (o[i] = true));
    function inlineStyler(elm,css){
    Object.entries(JSON.parse(
    css.replace(/(?<=:)\s*(\b|\B)(?=.+?;)/g,'"')
        .replace(/(?<=:\s*.+?);/g,'",')
        .replace(/[a-zA-Z-]+(?=:)/g, k=> k.replace(/^\b/,'"').replace(/\b$/,'"'))
        .replace(/\s*,\s*}/g,'}')
    )).forEach(kv=> { elm.style[kv[0]] = kv[1]});
    }
    function topZIndexer(){
        let n = new Date().getTime() / 100000;
        let r = (n - Math.floor(n)) * 1000;
        return Math.round(n+r);
    }
    function dragElement() { 
        var el = this.parentElement.parentElement;
        var pos1 = 0,    pos2 = 0,    pos3 = 0,    pos4 = 0;
        if (document.getElementById(this.id)) document.getElementById(this.id).onmousedown = dragMouseDown;
        else this.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            inlineStyler(el,`{z-index: ${topZIndexer()};}`);
        }
        function elementDrag(e) {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            inlineStyler(el,`{top: ${(el.offsetTop - pos2)}px; left: ${(el.offsetLeft - pos1)}px; opacity: 0.85; transition: opacity 100ms;}`);
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            el.style.opacity = "1";
        }
    }
    function setQuickliCSS(style_id){
        if(gi(document,`${style_id}_style`)) gi(document,`${style_id}_style`).outerHTML = '';
        let csselm = ele('style');
        a(csselm,[['class',`${style_id}_style`]]);
        document.head.appendChild(csselm);
        csselm.innerHTML = `
            .pad2 {
                padding: 2px;
            }
            .pad4 {
                padding: 4px;
            }
            .pad6 {
                padding: 6px;
            }
            .pad8 {
                padding: 8px;
            }
            .centertext {
                text-align: center;
            }
            .h32 {
                height: 32px;
            }
            .mover-left-gradient {
                background-image: linear-gradient(to bottom right, #ffffff, #ffffff, #f7f9fa);
                border-bottom-right-radius: 1em;
            }
            .textarea {
                outline: none;
                border-radius: 0.4em;
                border: 0px;
                background: transparent;
                box-shadow: rgb(204, 219, 232) 2px 2px 4px 1px inset, rgba(255, 255, 255, 0.5) -1px -2px 4px 2px inset;
                color: #788fa5;
            }
            .load_shiner {
                background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
                border-radius: 1em;
                background-size: 200% 100%;
                animation: 1.5s shine linear infinite;
            }
            
            @keyframes shine {
                to {
                  background-position-x: -200%;
                }
            }
   
            .label {
                display: inline-flex;
                align-items: center;
                cursor: pointer;
                color: #394a56;
            }
            
            .label-text {
                margin-left: 16px;
            }
            
            .toggle {
                isolation: isolate;
                position: relative;
                height: 30px;
                width: 60px;
                border-radius: 2em;
                overflow: hidden;
                box-shadow:
                -8px -4px 8px 0px #ffffff,
                8px 4px 12px 0px #d1d9e6,
                4px 4px 4px 0px #d1d9e6 inset,
                -4px -4px 4px 0px #ffffff inset;
            }
            
            .toggle-state {
                display: none;
            }
            
            .indicator {
                height: 100%;
                width: 200%;
                background: #ecf0f3;
                border-radius: 2em;
                
                transform: translate3d(-75%, 0, 0);
                transition: transform 0.4s cubic-bezier(0.85, 0.05, 0.18, 1.35);
                box-shadow:
                -8px -4px 8px 0px #ffffff,
                8px 4px 12px 0px #d1d9e6;
            }
            
            .toggle-state:checked ~ .indicator {
                transform: translate3d(25%, 0, 0);
                background: #d0f2e5;
            }
            .${style_id} {
                box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
                font-size: 1.2em;
                cursor: pointer;
                background: #ffffff;
                color: #788fa5;
                border-radius: 2em;
                transition: all 111ms;
                user-select: none;
            }
            .${style_id}:hover {
                box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 6px 0px, rgba(255, 255, 255, 0.8) -6px -2px 6px -3px;
                color: #788fa5;
            }
            .${style_id}:active {
                box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
                color: #788fa5;
            }
            `;
    }
    function keepElmInBoundary(elm){ 
        if(elm.getBoundingClientRect().right >= window.innerWidth){
            inlineStyler(elm,`{left: ${(window.innerWidth - (elm.getBoundingClientRect().width+30))}px;}`);
        }
        if(elm.getBoundingClientRect().bottom >= window.innerHeight){
            inlineStyler(elm,`{top: ${(window.innerHeight - (elm.getBoundingClientRect().height+60))}px;}`);
        }
    }

    setQuickliCSS('quickli_job_btn');

    const height = window.innerHeight <=600 ? window.innerHeight * 0.9 : window.innerHeight > 600 && window.innerHeight < 1100 ? window.innerHeight * 0.7 : window.innerHeight * 0.6;
    const width = window.innerWidth <= 800 ? window.innerWidth * 0.9 : window.innerWidth > 800 && window.innerWidth < 1161 ? window.innerWidth * 0.7 : window.innerWidth * 0.6;
    const left_p_h = 500;

    if(cn(document,'quickli_flash_info_card')) Array.from(cn(document,'quickli_flash_info_card')).forEach(r=> { r.outerHTML = ''; });
    const cont = ele('div');
    a(cont,[['class','quickli_flash_info_card']]);

    let shadow = 'box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;';

    inlineStyler(cont,`{position: fixed; z-index: ${topZIndexer()}; top: 500px; left: 0px; display: grid; grid-template-columns: 32px 1fr 92px; grid-gap: 12px; ${shadow} text-align: left; max-height: ${height}px; max-width: ${width}px; background: #ffffff; color: #374552; border-radius: 1em; padding: 12px; transition: all 111ms;}`);
    document.body.appendChild(cont);
    
    const panel = ele('div');
    a(panel,[['class','mover-left-gradient']]);
    inlineStyler(panel,`{display: grid; grid-template-rows: 32px 1fr; grid-gap: 12px; user-select: none;}`);
    cont.appendChild(panel);

    const cls = ele('div');
    panel.appendChild(cls);
    a(cls,[['class','quickli_job_btn h32']]);
    cls.innerHTML = `<svg style="border-radius: 2em; height: 30px; width: 30px;" x="0px" y="0px" viewBox="0 0 100 100"><g style="transform: scale(1, 1)" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(2, 2)" stroke="#e21212" stroke-width="8"><path d="M47.806834,19.6743435 L47.806834,77.2743435" transform="translate(49, 50) rotate(225) translate(-49, -50) "/><path d="M76.6237986,48.48 L19.0237986,48.48" transform="translate(49, 50) rotate(225) translate(-49, -50) "/></g></g></svg>`;
    cls.onclick = () => cont.outerHTML = '';

    const mover = ele('div');
    inlineStyler(mover,`{cursor: move; user-select: none;}`);
    panel.appendChild(mover);
    mover.onmouseover = dragElement;

    const left = ele('div');
    inlineStyler(left,`{padding: 0px;}`);
    cont.appendChild(left);

    const textarea = ele('textarea');
    a(textarea,[['class','query_item textarea pad8'],['placeholder','Line Separated Queries']]);
    inlineStyler(textarea,`{width: ${left_p_h-16}px; height: 400px;}`);
    left.appendChild(textarea);

    const textarea2 = ele('textarea');
    a(textarea2,[['class','fetch_item textarea pad8'],['placeholder','Paste Fetch From Network Here']]);
    inlineStyler(textarea2,`{width: ${left_p_h-16}px; height: 100px;}`);
    left.appendChild(textarea2);

    const btn = ele('div');
    a(btn,[['class','quickli_job_btn centertext pad8']]);
    left.appendChild(btn);
    btn.innerText = 'Run Queries';
    btn.onclick = initCSEclientMiner;

    const right = ele('div');
    inlineStyler(right,`{display: grid; grid-template-rows: 20px minmax(30px,60px); grid-gap: 8px;}`);
    cont.appendChild(right);
    right.innerHTML = `<div title="Select to match the results back to the query. Specifically for LinkedIn, attempts to match name information" style="user-select: none; font-size: 0.9em; text-align: center;">Filter Matches</div>
    <div>
        <label title="Select to match the results back to the query. Specifically for LinkedIn, attempts to match name information" class="label">
            <div class="label-text"></div>
            <div class="toggle">
                <input id="remap_query_filter" class="toggle-state" type="checkbox" name="check" value="check" />
                <div class="indicator"></div>
            </div>
        </label>
    </div>
  `;
    // const toggle = ele('input');
    // a(toggle,[['class','tgl-btn tgl-ios']]);
    // right.appendChild(toggle);

    keepElmInBoundary(cont);
    inlineStyler(cont,`{left: ${((window.innerWidth - cont.getBoundingClientRect().width) * 0.5)}px;}`);
    keepElmInBoundary(cont);
    [textarea2,textarea,btn].forEach(b=> inlineStyler(b,`{width: ${(left.getBoundingClientRect().width - (28))}px;}`))
    
    // inlineStyler(textarea2,`{width: ${(left.getBoundingClientRect().width - (32))}px;}`);
}


/* 
    *************************************************
                        CSE Miner
    *************************************************
*/

async function initCSEclientMiner(){
    function convert2TsvAndDownload(records, named_file){
       var fileArray = records;
       var tsvReady = (s) => s ? s.replace(/\t|\u0009|&#9;/g, ' ').replace(/[\r\n]+/g, '↵').replace(/\u2029|\u2028|\x85|\x1e|\x1d|\x1c|\x0c|\x0b/g,'↵').replace(/"/g, "'") : s;
       var unqHsh = (a, o) => a.filter(i => o.hasOwnProperty(i) ? false : (o[i] = true));
       var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
       var str = (o) => typeof o == 'object' ? tsvReady(JSON.stringify(o).replace(/\n|\r/g, ' ')) : o;
       var firstLevel = fileArray.map(el => Object.entries(el));
       var header = unqHsh(firstLevel.map(el => el.map(itm => itm[0])).flat(),{});
       var table = [header];
       for (var i = 0; i < firstLevel.length; i++) {
         var arr = [];
         var row = [];
         var record = firstLevel[i];
         for (var s = 0; s < record.length; s++) {
           var record_kv = record[s];
           var col_key = record_kv[0];      
           var place = header.indexOf(col_key);
           arr[place] = record_kv[1];
         }
         for (var a = 0; a < arr.length; a++) {
           if (arr[a]) {
             row.push(arr[a]);
           } else {
             row.push('');
           }
         }
         table.push(row);
       }
       function downloadr(arr2D, filename) {
         var data = /\.json$|.js$/.test(filename) ? JSON.stringify(arr2D) : arr2D.map(el => el.reduce((a, b) => a + '\t' + b)).reduce((a, b) => a + '\r' + b);
         var type = /\.json$|.js$/.test(filename) ? 'data:application/json;charset=utf-8,' : 'data:text/plain;charset=utf-8,';
         var file = new Blob([data], {
           type: type
         });
         if (window.navigator.msSaveOrOpenBlob) {
           window.navigator.msSaveOrOpenBlob(file, filename);
         } else {
           var a = document.createElement('a'),
             url = URL.createObjectURL(file);
           a.href = url;
           a.download = filename;
           document.body.appendChild(a);
           a.click();
           setTimeout(() => {
             document.body.removeChild(a);
             window.URL.revokeObjectURL(url);
           }, 10);
         }
       }
       var output_ = table.map(el => el.map(itm => str(itm)));
       downloadr(output_, named_file);
     }
 
     async function getCSERes(url){
         var res = await fetch(url);
         var text = await res.text();
         var d = JSON.parse(text.replace(/\n/g,'').replace(/^.+?\(/,'').replace(/\);$/,''))
         return d;
     }
 
     function parseURIasJSON(url){
         var obj = {base: url.replace(/\?.+/,'')};
         if(url.match(/(?<=\?|\&)\S+?(?=\&|$)/g)) url.match(/(?<=\?|\&)\S+?(?=\&|$)/g).map(r=> r ? r.split(/\=/) : [[]]).forEach(r=> obj[r[0]] = decodeURIComponent(r[1]))
         return obj;
     }
     function parseJSONasURI(obj){
         return Object.entries(obj).map((k,i,r)=> i == 0 ? k[1]+'?' : '&'+k[0]+'='+encodeURIComponent(k[1]) ).reduce((a,b)=> a+b);
     }
 
     function buildAPIQuery(search,url){
         var json_q = parseURIasJSON(url);
         json_q.q = search;
         json_q.oq = search;
         return parseJSONasURI(json_q);
     }
     var cleanObject = (ob) => 
       Object.entries(ob).reduce((r, [k, v]) => {
         if(v != null && v != undefined && v != "" && ( typeof v == 'boolean' || typeof v == 'string' || typeof v == 'symbol' || typeof v == 'number' || typeof v == 'function' || (typeof v == 'object'  && ((Array.isArray(v) && v.length) || (Array.isArray(v) != true)) ) ) ) { 
           r[k] = v; 
           return r;
         } else { 
          return r; 
         }
       }, {});
 
    function parseCSEResponse(d){
        var tsvReady = (s) => s ? s.replace(/\t|\u0009|&#9;/g, ' ').replace(/[\r\n]+/g, '↵').replace(/\u2029|\u2028|\x85|\x1e|\x1d|\x1c|\x0c|\x0b/g,'↵').replace(/"/g, "'") : s;
        return d?.results?.map(r=> {
            let x_title = r?.richSnippet?.metatags?.profileFirstName && r?.richSnippet?.metatags?.profileLastName ? new RegExp('^'+r?.richSnippet?.metatags?.profileFirstName +'\\s+'+r?.richSnippet?.metatags?.profileLastName + '\\s*-\\s*','i') : /^/;
            return cleanObject({
                headline: tsvReady(r?.titleNoFormatting?.replace(x_title,'')),
                content: tsvReady(r?.contentNoFormatting),
                image_url: tsvReady(r?.richSnippet?.metatags?.ogImage),
                first_name: tsvReady(r?.richSnippet?.metatags?.profileFirstName),
                last_name: tsvReady(r?.richSnippet?.metatags?.profileLastName),
                url: r?.unescapedUrl,
            });
        })
    }
    function unqKey(array,key){  var q = [];  var map = new Map();  for (const item of array) {    if(!map.has(item[key])){        map.set(item[key], true);        q.push(item);    }  }  return q;}
 

    function filterResponsesOnQuery(responses, query){
        const regXready = (str) => str && typeof str == 'string' ? str.replace(/\[/g, '\[').replace(/\]/g, '\]')
        .replace(/\{/g, '\{').replace(/\}/g, '\}').replace(/\\/g, '\\').replace(/\//g, '\/')
        .replace(/\?/g, '\?').replace(/\+/g, '\+').replace(/\*/g, '\*').trim() : '^$';
        var query_arr = query.split(/\s+/);
        const matches = responses.map(r=> {
            let target =  r.last_name && r.first_name ? ((r.first_name ? r.first_name : '') + (r.last_name ? ' ' + r.last_name : '')) : r.headline.replace(/\s-\s.+/,'');
            return query_arr.map(q=> [q.slice(1,(q.length)), q.slice(0,(q.length-1))]).map(q=> new RegExp(q[0].replace(/\W/g,'.{0,1}'),'i').test(target) || new RegExp(q[1].replace(/\W/g,'.{0,1}'),'i').test(target)  ).filter(i=> i)
        }).map(i=> i.length);
        let prime = Math.max(...matches);
        let prime_indexes = matches.map((m,i,r)=> m == prime ? i : -1).filter(i=> i > -1);
        return prime_indexes.map(p=> responses[p]);
    }

    async function loopThroughCSEsearch(bool_search,api_url){
        var rando = (n) => Math.round(Math.random() * n);
        var delay = (ms) => new Promise(res => setTimeout(res, ms));
        var api_query = buildAPIQuery(bool_search,api_url);
        var search_res = await getCSERes(api_query);
        var pages = search_res?.cursor?.pages?.map(i=> i?.start);
        const remap_query_filter = document.getElementById('remap_query_filter')?.checked;
        if(remap_query_filter){
            let res_arr = parseCSEResponse(search_res);
            let refiltered = res_arr?.length ? unqKey(filterResponsesOnQuery(res_arr,bool_search),'url') : [{content: 'no matches'}]
            return refiltered.length > 1 ? [{content: 'no matches'}] : refiltered;
        }else{
            if(pages && pages.length){
                pages.shift();
                var contain_arr = [parseCSEResponse(search_res)];
                for(let i=0; i<pages.length; i++){
                    let uri = /start=/.test(api_query) ? api_query.replace(/start=\d+/, 'start='+pages[i]) : api_query+'&start='+pages[i];
                    let res = await getCSERes(uri);
                    contain_arr.push(parseCSEResponse(res));
        console.log([pages[i],uri]);
                    await delay(rando(3000)+1225);
                }
                return unqKey(contain_arr.flat().filter(r=> r),'url');
            }else{return [{content: 'no matches'}]}
        }
    }
    const rando = (n) => Math.round(Math.random() * n);
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const tsvReady = (s) => s ? s.replace(/\t|\u0009|&#9;/g, ' ').replace(/[\r\n]+/g, '↵').replace(/\u2029|\u2028|\x85|\x1e|\x1d|\x1c|\x0c|\x0b/g,'↵').replace(/"/g, "'") : s;
    const reg = (o, n) => o ? o[n] : '';
    const searches = this.parentElement.getElementsByClassName('query_item')?.[0]?.value?.split(/\n/)?.map(r=> r.trim())?.filter(r=> r);
    const api_url = reg(/https:\/\/cse.google.com\/.+?(?="|$)/.exec(this.parentElement.getElementsByClassName('fetch_item')?.[0]?.value?.trim()),0)?.replace(/start=\d+/,'start=0');
console.log([searches,api_url]);
    const remap_query_filter = document.getElementById('remap_query_filter')?.checked;
    if(api_url && searches?.length){
        const res_contain_arr = [];
        for(let i=0; i<searches.length; i++){
            let output_json = await loopThroughCSEsearch(searches[i],api_url);
            console.log(output_json);
            res_contain_arr.push( output_json.map(j=> {return {...j,...{query: tsvReady(searches[i])}} } ) );
            await delay(rando(3000)+1225);
        }
        if(remap_query_filter){
            convert2TsvAndDownload(res_contain_arr.flat(),'cse target filtered list.tsv');
        }else{
            convert2TsvAndDownload(unqKey(res_contain_arr.flat(),'url'),'cse results list.tsv');
        }
    }
}
 
buildContainer()
