function getElements(html){
    let textArr = []
    // console.log('htmlToDom', html);
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = html;
    const list = htmlObject.querySelectorAll('a');
    list.forEach(function(val, i){
        textArr[i] = {
            name: val.innerText,
            url: val.getAttribute("href")
        };
    })

    return textArr;
}

function groupByViews(arr){
    const group = {}

    arr.forEach(function(item){
        if(item.url.includes('watch')) {
            const name = item.name;
            if(group[name]) {
                group[name].count = group[name].count + 1;
                group[name].name = item;
            } else {
                group[name] = {
                    count: 1,
                    name: item
                };
            }
        }
    });
    return group;
}

console.log('Ready');

const loading = document.getElementById('loading');
const loading_dots = document.getElementById('loading-dots');

function repeatOften() {
    if(loading_dots.innerText.length > 2) {
        loading_dots.innerText = '.'
    } else {
        loading_dots.innerText = loading_dots.innerText + '.';
    }
    requestAnimationFrame(repeatOften);
}
requestAnimationFrame(repeatOften);

function handleFileSelect(evt) {

    //Show loading
    loading.style.display = 'block';
    

    //Create uploaded file reader
    const reader = new FileReader();

    //File loaded
    reader.onload = function(){
        const html = reader.result;
        const elementsArray = getElements(html);
        const groupObject = groupByViews(elementsArray);
        const sort = _.groupBy(groupObject, 'count');
        const final = _.toArray(sort).reverse();

        //Show the JSON
        document.getElementById('content').innerText = JSON.stringify(final, null, 4);

        //Show donwload link
        document.getElementById('download').innerHTML = '<a href="data:' + "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(final)) + '" download="data.json">download JSON</a>';

        //Hide loading
        loading.style.display = 'none';
    };

    //Read the file
    const file = evt.target.files[0];
    reader.readAsText(file);

    
}

  document.getElementById('file-input').addEventListener('change', handleFileSelect, false);
