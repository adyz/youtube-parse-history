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

        let superFinal = [];
        final.forEach(function(finalArrayWithItems){
            finalArrayWithItems.forEach(function(item){
                const newItem = {
                    count: item.count,
                    name: item.name.name,
                    url: item.name.url
                };
                superFinal.push(newItem);
            })
        });

        //console.table(superFinal);

        //Show the JSON
        document.getElementById('content').innerText = JSON.stringify(superFinal, null, 4);

        //Show donwload link
        document.getElementById('download').innerHTML = '<a href="data:' + "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(superFinal)) + '" download="data.json">download JSON</a>';

        //Hide loading
        loading.style.display = 'none';
    };

    //Read the file
    const file = evt.target.files[0];
    reader.readAsText(file);

    
}

// Listen when a file is uploaded
document.getElementById('file-input').addEventListener('change', handleFileSelect, false);
