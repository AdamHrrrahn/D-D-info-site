const urlParams = new URLSearchParams(window.location.search);
const listName = urlParams.get('val');
const apiUrlRoot = "https://www.dnd5eapi.co/api/";
const listUrl = apiUrlRoot + listName;
document.title = "List: " + listName;
let pageCount = 0;
let current_page = 0;

function jump_page(){
    number = document.getElementById('page_number').selectedIndex + 1
    // console.log(number)
    if (current_page != number){
        document.getElementById("page"+current_page).style.display="none";
        document.getElementById("page"+number).style.display="block";
        if (number > 1){
            document.getElementById("previous").style.display="block";
            if (number > 2){
                document.getElementById("beginning").style.display="block";
            } else {
                document.getElementById("beginning").style.display="none";
            }
        } else {
            document.getElementById("beginning").style.display="none";
            document.getElementById("previous").style.display="none";
        }
        if (number < pageCount){
            document.getElementById("next").style.display="block";
            if (number < (pageCount-1)){
                document.getElementById("end").style.display="block";
            } else {
                document.getElementById("end").style.display="none";
            }
        } else {
            document.getElementById("end").style.display="none";
            document.getElementById("next").style.display="none";
        }
        current_page = number;
    }
}

function beginning_button(){
    if (current_page > 1){
        document.getElementById("page"+current_page).style.display="none";
        document.getElementById("page1").style.display="block";
        document.getElementById("beginning").style.display="none";
        document.getElementById("previous").style.display="none";
        document.getElementById("next").style.display="block";
        if(pageCount > 2){
            document.getElementById("end").style.display="block";
        }
        current_page = 1;
        document.getElementById("page_number").selectedIndex = current_page-1;
    }
}

function previous_button(){
    if (current_page > 1){
        document.getElementById("page"+current_page).style.display="none";
        current_page = current_page - 1;
        document.getElementById("page"+current_page).style.display="block";
        if(current_page < 3){
            document.getElementById("beginning").style.display="none";
        }
        if (current_page == 1){
            document.getElementById("previous").style.display="none";
        }
        document.getElementById("next").style.display="block";
        if(current_page < (pageCount-1)){
            document.getElementById("end").style.display="block";
        }
        document.getElementById("page_number").selectedIndex = current_page-1;
    }
}

function next_button(){
    if (current_page < pageCount){
        document.getElementById("page"+current_page).style.display="none";
        current_page = current_page + 1;
        document.getElementById("page"+current_page).style.display="block";
        if(current_page >= (pageCount-1)){
            document.getElementById("end").style.display="none";
        }
        if (current_page == pageCount){
            document.getElementById("next").style.display="none";
        }
        document.getElementById("previous").style.display="block";
        if(current_page > 2){
            document.getElementById("beginning").style.display="block";
        }
        document.getElementById("page_number").selectedIndex = current_page-1;
    }
}

function end_button(){
    if (current_page < pageCount){
        document.getElementById("page"+current_page).style.display="none";
        document.getElementById("page"+pageCount).style.display="block";
        if (pageCount > 2){
            document.getElementById("beginning").style.display="block";
        }
        document.getElementById("previous").style.display="block";
        document.getElementById("next").style.display="none";
        document.getElementById("end").style.display="none";
        current_page = pageCount;
        document.getElementById("page_number").selectedIndex = current_page-1;
    }
}

fetch(listUrl)
    .then(response => {
        if (!response.ok){
            document.getElementById("error_message").style.display="block";
            document.getElementById("list_div").style.display="none";
        }
        return response.json();
    })
    .then(data => {
        dataArr = data.results;
        // console.log(dataArr);
        length = dataArr.length;
        pageCount = Math.ceil(length/20);
        page_selector = document.getElementById("page_number");
        for(let i = 1; i <= pageCount; i++){
            option = document.createElement('option');
            option.setAttribute('value', i);
            option.innerHTML = i;
            page_selector.appendChild(option);
            page = document.createElement("ul");
            page.setAttribute("id", "page"+i);
            for(let j = 1; (j < 21)&&((i-1)*20+j <= length); j++ ){
                index = (i-1)*20 + j - 1;
                item = document.createElement('li');
                item.innerHTML = "<a href='data-entry.html?val=" + dataArr[index].url + "'>" + dataArr[index].name + "</a>"
                page.appendChild(item);
            }
            page.style.display="none";
            document.getElementById("list_container").appendChild(page);
        }
        document.getElementById("beginning").style.display="none";
        document.getElementById("previous").style.display="none";
        document.getElementById("page1").style.display="block";
        current_page = 1;
        if (pageCount < 2){
            document.getElementById("button_line").style.display="none";
        }
        else{
            document.getElementById("beginning").addEventListener("click", beginning_button)
            document.getElementById("previous").addEventListener("click", previous_button)
            document.getElementById("next").addEventListener("click", next_button)
            document.getElementById("end").addEventListener("click", end_button)
        }
        if (pageCount < 3){
            document.getElementById("end").style.display="none";
        }
        if (window.innerHeight > document.body.offsetHeight){
            footer = document.getElementById("footer");
            footer.style.position = "absolute";
            footer.style.bottom = 0;
        }
        page_selector.selectedIndex = 0;
        page_selector.addEventListener("change", jump_page)
    })