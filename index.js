
 let data=[];
 async function getData() {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
    try {
        const res = await fetch(url);
        data = await res.json();
        
    if (!data || data.length === 0) {
        console.warn("⚠️ Data is empty or not yet loaded.");
        return;
    }
        renderTable(data);
        
    } catch (error) {
        console.log("Error : ",error);
    }
    
}

function renderTable(arr){
    const tbody = document.getElementById("table-body");
    tbody.innerHTML="";
    arr.forEach(coin => {
        rowData = `
                    <td><img src="${coin.image}" width="30" height="30" /></td>
                    <td>${coin.id}</td>
                    <td>${coin.name}</td>
                    <td>${coin.symbol.toUpperCase()}</td>
                    <td>$${coin.current_price}</td>
                    <td>${coin.total_volume.toLocaleString()}</td>
                    <td>${coin.market_cap.toLocaleString()}</td>
                    <td style="color: ${coin.price_change_percentage_24h >= 0 ? 'green' : 'red'}">
                        ${coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                `;
                const row  = document.createElement("tr");
                row.innerHTML = rowData;
                tbody.appendChild(row);
    });
    
}

function marketCap(){
    const sorted = [...data].sort((a,b)=> b.market_cap - a.market_cap);
    renderTable(sorted);
}

function percentage(){
    const sorted = [...data].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    renderTable(sorted);
}



function filterDataBasedOnInput(){
    let inputVal = document.getElementById("name").value.toLowerCase();
   
    const filterData = data.filter((coin)=> coin.name.toLowerCase().includes(inputVal));
    renderTable(filterData);
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const debouncedFilter = debounce(filterDataBasedOnInput, 300);


window.onload = ()=>{
    getData();
    document.getElementById("name").addEventListener("input", debouncedFilter);
}
