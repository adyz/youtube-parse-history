function getElements(html){
    let textArr = []

    $(html).find('a').each(function(i, elem) {
        textArr[i] = {
            name: $(this).text(),
            url: $(this).attr('href')
        };
    });

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


function handleFileSelect(evt) {
    const files = evt.target.files; // FileList object
    
    //get the first
    const file = files[0];
    console.log('file', file);

    var reader = new FileReader();



    reader.onload = function(){
        var html = reader.result;
        var outputArea = document.getElementById('content');
        let elementsArray = getElements(html);
        let groupObject = groupByViews(elementsArray);
        let sort = _.groupBy(groupObject, 'count');
        const final = _.toArray(sort).reverse();
        let stringJSON = JSON.stringify(final);
        outputArea.innerText = JSON.stringify(final, null, 4);
        console.log('Done');

        var data = "text/json;charset=utf-8," + encodeURIComponent(stringJSON);

        //Show donwload link
        document.getElementById('download').innerHTML = '<a href="data:' + data + '" download="data.json">download JSON</a>';
    };

    reader.readAsText(file);

    
}

  document.getElementById('file-input').addEventListener('change', handleFileSelect, false);
