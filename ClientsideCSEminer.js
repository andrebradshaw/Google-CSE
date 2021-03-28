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
    async function loopThroughCSEsearch(bool_search,api_url){
        function unqKey(array,key){  var q = [];  var map = new Map();  for (const item of array) {    if(!map.has(item[key])){        map.set(item[key], true);        q.push(item);    }  }  return q;}
        var rando = (n) => Math.round(Math.random() * n);
        var delay = (ms) => new Promise(res => setTimeout(res, ms));
        
        var api_query = buildAPIQuery(bool_search,api_url);

        var search_res = await getCSERes(api_query);
        var pages = search_res?.cursor?.pages?.map(i=> i?.start);
        pages.shift();
        var contain_arr = [parseCSEResponse(search_res)];
        for(let i=0; i<pages.length; i++){
            let res = await getCSERes(api_query+'&start='+pages[i]);
            contain_arr.push(parseCSEResponse(res));
            console.log(pages[i]);
            await delay(rando(3000)+1225);
        }
        return unqKey(contain_arr.flat().filter(r=> r),'url');
    }

    var api_url = "https://cse.google.com/cse/element/v1?rsz=filtered_cse&num=10&hl=en&source=gcsc&gss=.com&cselibv=none&cx=005119108291209832701:txobnpkvmyk&q=intitle%3A%20(sourcer%20OR%20recruiter)%20AND%20Atlanta&cse_tok=AJvRUv2SRPhQWa8qchlkYCzuMR1M:1616942750170&sort=&exp=csqr,cc&oq=intitle%3A%20(sourcer%20OR%20recruiter)%20AND%20Atlanta&gs_l=partner-generic.12...1089264.1130732.2.1141933.74.73.0.0.0.2.131.4148.70j3.73.0.csems%2Cnrl%3D13...0.1130738j1186810746116j117j7...1.34.partner-generic..112.0.0.dqEwWdgPLQc&callback=google.search.cse.api16552";

    var bool_search = "intitle: (sourcer OR recruiter) AND atlanta";
    var output_json = await loopThroughCSEsearch(bool_search,api_url);
    convert2TsvAndDownload(output_json,bool_search+'.tsv');
}

initCSEclientMiner();
