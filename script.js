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
const parsed_content = document.getElementById('content');

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
        document.getElementById('json-placeholder').value = JSON.stringify(superFinal, null, 4);

        //Show donwload link
        document.getElementById('download-link-placeholder').innerHTML = '<a href="data:' + "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(superFinal)) + '" download="data.json">Download JSON</a>';

        //Render the table
        if(vuecomp) {
            EventBus.$emit('newData',superFinal);
        } else {
            renderTable(superFinal);
        }
        

        //Hide loading
        loading.style.display = 'none';


        //Show content
        parsed_content.style.display = 'block'
    };

    //Read the file
    const file = evt.target.files[0];
    reader.readAsText(file);

    
}

// Listen when a file is uploaded
document.getElementById('file-input').addEventListener('change', handleFileSelect, false);

let vuecomp = false;
let EventBus = new Vue();

function renderTable(data) {
    Vue.component('demo-grid', {
        template: '#grid-template',
        props: {
          data: Array,
          columns: Array,
          filterKey: String
        },
        created: function(){
            const self = this;
            EventBus.$on('newData', function(data){
                self.newData(data);
            });
        },
        data: function () {
          var sortOrders = {}
          this.columns.forEach(function (key) {
            sortOrders[key] = 1
          })
          return {
            sortKey: '',
            sortOrders: sortOrders
          }
        },
        computed: {
          filteredData: function () {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
              data = data.filter(function (row) {
                return Object.keys(row).some(function (key) {
                  return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                })
              })
            }
            if (sortKey) {
              data = data.slice().sort(function (a, b) {
                a = a[sortKey]
                b = b[sortKey]
                return (a === b ? 0 : a > b ? 1 : -1) * order
              })
            }
            return data
          }
        },

        filters: {
          capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
          }
        },

        methods: {
          sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
          },
          newData: function(data) {
              this.data = data;
          }
        }
      })
      
      // bootstrap the demo
      vuecomp = new Vue({
        el: '#table',
        data: {
          searchQuery: '',
          gridColumns: ['name', 'count', 'url'],
          gridData: data
        }
      })
}
