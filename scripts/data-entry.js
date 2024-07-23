const urlParams = new URLSearchParams(window.location.search);
const itemApi = urlParams.get('val');
const apiUrlRoot = "https://www.dnd5eapi.co";
const itemUrl = apiUrlRoot + itemApi;
const option_keys = ["proficiency_choices", "starting_equipment_options", "starting_proficiency_options", "language_options"]

function append_paragraph(parent, string, ind = 0){
    let p = document.createElement('p');
    p.style.textIndent = (2*ind) +'em'
    p.innerHTML = clean(string);
    parent.appendChild(p);
}

// function append_paragraph_ind(parent, string){
//     let p = document.createElement('p');
//     p.style.textIndent = '2em'
//     p.innerHTML = clean(string);
//     parent.appendChild(p);
// }

function check_reference(data){
    return (JSON.stringify(Object.keys(data)) == JSON.stringify(['index', 'name', 'url']));
}

function clean(key){
    let string = String(key).replace(/_/gi, " ");
    string = string[0].toUpperCase() + string.slice(1);
    return string;
}

function class_spell_list(parent, url){
    fetch(url)
        .then(response => {
            if (!response.ok){
                append_paragraph(parent, "Unable to Fetch Spell list. Please refresh page or try again later.")
            }
            return response.json();
        })
        .then(data => {
            let table = document.createElement('table')
            table.setAttribute('id', 'spell_table')
            let row = document.createElement('tr')
            let header1 = document.createElement('th')
            header1.innerText = "Name"
            let header2 = document.createElement('th')
            header2.innerText = "Required Level"
            row.appendChild(header1)
            row.appendChild(header2)
            table.appendChild(row)
            let spell_list = data.results
            for( i = 0; i < data.count; i++){
                let row = document.createElement('tr')
                let spell = document.createElement('td')
                spell.innerHTML = "<a href='data-entry.html?val=" + spell_list[i].url + "'>" + spell_list[i].name + "</a>"
                let level = document.createElement('td')
                level.innerHTML = spell_list[i].level
                row.appendChild(spell)
                row.appendChild(level)
                table.appendChild(row)
            }
            parent.appendChild(table)
        })
}

function display_chioce(parent, data, intInd=0){
    append_paragraph(parent, 'Choose ' + data.choose + " From", intInd)
    let ind = intInd +1;
    if (data.from.option_set_type == "options_array"){
        for(let i = 0; i < data.from.options.length; i++){
            if (data.from.options[i].option_type == "counted_reference"){
                append_paragraph(parent, "<a href='data-entry.html?val=" + data.from.options[i].of.url + "'>" + data.from.options[i].of.name + "</a>: " + data.from.options[i].count, ind)
            } else if(data.from.options[i].option_type == "reference"){
                append_paragraph(parent, "<a href='data-entry.html?val=" + data.from.options[i].item.url + "'>" + data.from.options[i].item.name + "</a>", ind)
            } else if(data.from.options[i].option_type == "choice"){
                // append_paragraph(parent, )
                display_chioce(parent, data.from.options[i].choice, ind)
            } else if (data.from.options[i].option_type == "multiple"){
                let string = "";
                for(let j = 0; j < data.from.options[i].items.length; j++){
                    if (data.from.options[i].items[j].option_type == "counted_reference"){
                        string = string + "<a href='data-entry.html?val=" + data.from.options[i].items[j].of.url + "'>" + data.from.options[i].items[j].of.name + "</a>: " + data.from.options[i].items[j].count + "; "
                    } else if (data.from.options[i].items[j].option_type == "reference"){
                        string = string + "<a href='data-entry.html?val=" + data.from.options[i].items[j].of.url + "'>" + data.from.options[i].items[j].of.name + "</a>; "
                    } else if (data.from.options[i].items[j].option_type == "choice"){
                        string = string + data.from.options[i].items[j].choice.desc + "; "
                    }
                }
                append_paragraph(parent, string, ind)
            }
        }
    } else if(data.from.option_set_type == "equipment_category"){
        append_paragraph(parent, "<a href='data-entry.html?val=" + data.from.equipment_category.url + "'>" + data.from.equipment_category.name + "</a>", ind)
    } else if (false){

    }
}

function generate_cell(parent, data){
    let string;
    let cell = document.createElement('td')
    if(Array.isArray(data)){
        for(let i = 0; i < data.length; i++){
            if (typeof data[i] == "object"){
                append_paragraph(cell, data[i].name)
            } else {
                append_paragraph(cell, data[i])
            }
        }
        parent.appendChild(cell)
        return;
    } else if (typeof data == "object"){

    } else {
        string = clean(data)
    }
    append_paragraph(cell, string)
    parent.appendChild(cell)
}

function fetch_class_levels(info, url){
    fetch(url)
    .then(response => {
        if (!response.ok){
            append_paragraph(parent, "Unable to Fetch Class level table. Please refresh page or try again later.")
        }
        return response.json();
    })
    .then(data => {
        let columns = Object.keys(data[19])
        columns.splice(columns.indexOf("class"), 1)
        columns.splice(columns.indexOf("index"), 1)
        columns.splice(columns.indexOf("url"), 1)
        columns.splice(columns.indexOf("class_specific"), 1)
        let spellcaster = false;
        let spellcasting_keys;
        if (columns.includes("spellcasting")){
            columns.splice(columns.indexOf("spellcasting", 1))
            spellcaster = true
        }
        let table = document.createElement('table')
        let header = document.createElement('tr')
        for(let i = 0; i < columns.length; i++){
            let cell = document.createElement('th')
            append_paragraph(cell, columns[i])
            header.appendChild(cell)
        }
        let class_specific_keys = Object.keys(data[19].class_specific)
        for(let i = 0; i < class_specific_keys.length; i++){
            let cell = document.createElement('th')
            append_paragraph(cell, class_specific_keys[i])
            header.appendChild(cell)
        }
        if(spellcaster){
            spellcasting_keys = Object.keys(data[19].spellcasting)
            for(let i = 0; i < spellcasting_keys.length; i++){
                let cell = document.createElement('th')
                append_paragraph(cell, spellcasting_keys[i])
                header.appendChild(cell)
            }

        }
        table.appendChild(header)
        for(i = 0; i < 20; i++){
            let row = document.createElement('tr')
            for(let j = 0; j < columns.length; j++){
                generate_cell(row, data[i][columns[j]])
            }
            for(let j = 0; j < class_specific_keys.length; j++){
                generate_cell(row, data[i].class_specific[class_specific_keys[j]])

            }
            if(spellcaster){
                for(let j = 0; j < spellcasting_keys.length; j++){
                    generate_cell(row, data[i].spellcasting[spellcasting_keys[j]])
                }

            }
            table.appendChild(row)
        }
        info.appendChild(table)

    })
}

function fetch_subclass_levels(info, url){
    fetch(url)
    .then(response => {
        if (!response.ok){
            append_paragraph(parent, "Unable to Fetch Class level table. Please refresh page or try again later.")
        }
        return response.json();
    })
    .then(data => {
        let table = document.createElement('table')
        let header = document.createElement('tr')
        let h1 = document.createElement('th')
        append_paragraph(h1, "Level")
        header.appendChild(h1)
        let h2 = document.createElement('th')
        append_paragraph(h2, "Feature")
        header.appendChild(h2)
        table.appendChild(header)
        for(let i = 0; i < data.length; i++){
            let row = document.createElement('tr')
            generate_cell(row, data[i].level)
            generate_cell(row, data[i].features)
            table.appendChild(row)
        }
        info.appendChild(table)
    })
}

function sub_create_info_element(info, data, key){
    if ((typeof data) == "object"){
        if(Array.isArray(data)){
            if (data.length == 1){
                if (check_reference(data[0])){
                    append_paragraph(info, "<a href='data-entry.html?val=" + data[key][0].url + "'>" + data[0].name + "</a>")
                }else{
                    sub_create_info_element(info, data[0], key);
                }
            }else if(data.length == 0){
                append_paragraph(info, "None")
            }
        } else if (check_reference(data)){
            append_paragraph(info, "<a href='data-entry.html?val=" + data.url + "'>" + data.name + "</a>")
        }
    } else if (((typeof data) == "string")&&(data[0] == '/')){
        if (data.slice(-4) == ".png"){
            info.innerHTML = "<img src=\"" + apiUrlRoot + data[key] + "\" alt=\"" + data.name + "\">";
        }
    } else {
        if (typeof data[key] == "string")
            append_paragraph(info, data)
        else{
            let p = document.createElement('p')
            p.innerHTML = data;
            info.appendChild(p);
        }
    }
}

function create_info_element(info, data, key){
    if (key == "spells"){
        if (Array.isArray(data[key])){
            sub_create_info_element(info, data[key], key);
        } else{
            class_spell_list(info, apiUrlRoot + data[key])
        }
    }else if (key == "cost"){
        info.innerText = data[key].quantity + data[key].unit;
    }else if (key == "class_levels"){
        fetch_class_levels(info, apiUrlRoot+data[key])
    }else if (key == "subclass_levels"){
        fetch_subclass_levels(info, apiUrlRoot+data[key])
    }else if (key == "multi_classing"){
        let keys = Object.keys(data[key])
        if(keys[0] == "prerequisite_options"){
        } else{
            append_paragraph(info, keys[0] + ":")
            let keys2 = Object.keys(data[key][keys[0]][0])
            for(let i = 0; i < data[key][keys[0]].length; i++){
                append_paragraph(info, keys2[0] + ": <a href='data-entry.html?val=" + data[key][keys[0]][i][keys2[0]].url + "'>" + data[key][keys[0]][i][keys2[0]].name + "</a>; "+ clean(keys2[1]) + ": " + data[key][keys[0]][i][keys2[1]], 1)
            }
            append_paragraph(info, keys[1] +":")
            for(let i = 0; i < data[key][keys[1]].length; i++){
                append_paragraph(info, "<a href='data-entry.html?val=" + data[key][keys[1]][i].url + "'>" + data[key][keys[1]][i].name + "</a>;", 1)
            }
            if (keys.length == 3){
                append_paragraph(info, keys[2] +":")

            }
        }
    }else if (key == "spellcasting"){
        for(let i = 0; i < data[key].info.length; i++){
            append_paragraph(info, data[key].info[i].name + ": " + data[key].info[i].desc)
        }
    }else if (option_keys.includes(key)){
        if(Array.isArray(data[key])){
            for(let i = 0; i < data[key].length; i++){
                display_chioce(info, data[key][i])
            }
        } else {
            display_chioce(info, data[key])
        }
    }else if (["speed", "senses", "area_of_effect"].includes(key)){
        let keys = Object.keys(data[key])
        for(let i = 0; i < keys.length; i++){
            append_paragraph(info, keys[i] + ": " + data[key][keys[i]])
        }
    }else if (key == "armor_class"){    
        for(let i = 0; i < data[key].length;i++){
            let keys = Object.keys(data[key][i]);
            append_paragraph(info, data[key][i][keys[0]] +": "+data[key][i][keys[1]]);
        }
    }else if (key == "damage"){    
        let keys = Object.keys(data[key]);
        append_paragraph(info, keys[0] + ": <a href='data-entry.html?val=" + data[key][keys[0]].url + "'>" + data[key][keys[0]].name + "</a>")
        let levels = Object.keys(data[key][keys[1]])
        let table = document.createElement('table')
        let dmg_row = document.createElement('tr')
        let lvl_row = document.createElement('tr')
        let header1 = document.createElement('th')
        header1.innerText = "Level"
        let header2 = document.createElement('th')
        header2.innerText = clean(keys[1])
        lvl_row.appendChild(header1)
        dmg_row.appendChild(header2)
        for (let i = 0; i < levels.length; i++){
            let lvl = document.createElement('td')
            lvl.innerText = levels[i]
            let dmg = document.createElement('td')
            dmg.innerText = " " + data[key][keys[1]][levels[i]]
            lvl_row.appendChild(lvl)
            dmg_row.appendChild(dmg)
        }
        table.appendChild(lvl_row)
        table.appendChild(dmg_row)
        info.appendChild(table)
    }else if (["special_abilities", "actions", "legendary_actions"].includes(key)){
        console.log(data[key])
        let table = document.createElement('table')
        if (data[key].length == 0){
            append_paragraph(info, "None")
        }
        for(let i = 0; i < data[key].length; i++){
            let row = document.createElement('tr')
            let cell = document.createElement('td')
            let keys = Object.keys(data[key][i]);
            for(let j = 0; j < keys.length; j++){
                if ((typeof data[key][i][keys[j]]) == "object"){
                    if (keys[j] == "damage"){
                        let string = "Damage: "

                        for(let k = 0; k < Object.keys(data[key][i].damage).length; k++){
                            if (k > 0)
                                string = string + " + "
                            string = string + data[key][i].damage[k].damage_dice + " <a href='data-entry.html?val=" + data[key][i].damage[k].damage_type.url + "'>" + data[key][i].damage[k].damage_type.name + "</a>"
                        }
                        append_paragraph(cell, string)
                    } else if(keys[j] == "dc"){
                        append_paragraph(cell, "DC "+ data[key][i].dc.dc_value + " <a href='data-entry.html?val=" + data[key][i].dc.dc_type.url + "'>" + data[key][i].dc.dc_type.name + "</a>")
                    } else if(["actions", "multiattack_type"].includes(keys[j])){

                    } else if (keys[j] == "usage"){
                        let string = "Usage: "
                        let usage_keys = Object.keys(data[key][i].usage)
                        for(let k = 0; k< usage_keys.length; k++){
                            if (!Array.isArray(data[key][i].usage[usage_keys[k]])){
                                string = string + usage_keys[k] + ": " + data[key][i].usage[usage_keys[k]] + "; "
                            }
                        }
                        append_paragraph(cell, string)
                    }
                } else {
                    append_paragraph(cell, data[key][i][keys[j]])
                }
            }
            row.appendChild(cell)
            table.appendChild(row)
        }
        info.appendChild(table)
    }else if ((typeof data[key]) == "object"){
        if(Array.isArray(data[key])){
            if (data[key].length == 1){
                if (check_reference(data[key][0])){
                    append_paragraph(info, "<a href='data-entry.html?val=" + data[key][0].url + "'>" + data[key][0].name + "</a>")
                } else if ((typeof data[key][0]) == "object"){
                    let keys = Object.keys(data[key][0])
                    if (check_reference(data[key][0][keys[0]])){
                        for(let i = 0; i < data[key].length; i++){
                            append_paragraph(info, "<a href='data-entry.html?val=" + data[key][i][keys[0]].url + "'>" + data[key][i][keys[0]].name + "</a>: " + data[key][i][keys[1]])
                        }
                    } else if (check_reference(data[key][0][keys[1]])){
                        for(let i = 0; i < data[key].length; i++){
                            append_paragraph(info, "<a href='data-entry.html?val=" + data[key][i][keys[1]].url + "'>" + data[key][i][keys[1]].name + "</a>: " + data[key][i][keys[0]])
                        }
                    }
                } else {
                    sub_create_info_element(info, data[key][0], key);
                }
            }else if(data[key].length == 0){
                append_paragraph(info, "None")
            } else{
                let state = true;
                for (let i = 0; i < ((data[key].length) && (state)); i++){
                    if (typeof data[key][i] != "string"){
                        state = false;
                    }                
                }
                if (state){
                    if (key == "components"){
                        let string;
                        for (let i = 0; i < data[key].length; i++){
                            string = string + data[key][i] + ' ';
                        }
                        info.innerText = string;
                    }else{
                        for (let i = 0; i < data[key].length; i++){
                            append_paragraph(info, data[key][i]);
                        }
                    }
                } else {
                    let state = true;
                    for (let i = 0; i < ((data[key].length) && (state)); i++){
                        state = check_reference(data[key][i]);
                    }
                    if (state){
                        for(let i = 0; i < data[key].length; i++){
                            if(key == "traits"){
                                append_paragraph(info, data[key][i].name);
                            } else {
                                append_paragraph(info, "<a href='data-entry.html?val=" + data[key][i].url + "'>" + data[key][i].name + "</a>");
                            }
                        }
                    } else {
                        let keys = Object.keys(data[key][0])
                        if (check_reference(data[key][0][keys[0]])){
                            for(let i = 0; i < data[key].length; i++){
                                append_paragraph(info, "<a href='data-entry.html?val=" + data[key][i][keys[0]].url + "'>" + data[key][i][keys[0]].name + "</a>: " + data[key][i][keys[1]])
                            }
                        } else if (check_reference(data[key][0][keys[1]])){
                            for(let i = 0; i < data[key].length; i++){
                                append_paragraph(info, "<a href='data-entry.html?val=" + data[key][i][keys[1]].url + "'>" + data[key][i][keys[1]].name + "</a>: " + data[key][i][keys[0]])
                            }
                        }
                    }
                }
            }
        } else if (check_reference(data[key])){
            append_paragraph(info, "<a href='data-entry.html?val=" + data[key].url + "'>" + data[key].name + "</a>")
        } else {
        }
    } else if (((typeof data[key]) == "string")&&(data[key][0] == '/')){
        if (data[key].slice(-4) == ".png"){
            info.innerHTML = "<img src=\"" + apiUrlRoot + data[key] + "\" alt=\"" + data.name + "\">";
        } else {
            
        }
    } else {
        if (typeof data[key] == "string")
            append_paragraph(info, data[key])
        else{
            let p = document.createElement('p')
            p.innerHTML = data[key]
            info.appendChild(p)
        }
    }
}

fetch(itemUrl)
    .then(response => {
        if (!response.ok){
            document.getElementById("error_message").style.display="block";
            document.getElementById("item_content").style.display="none";
        }
        return response.json();
    })
    .then(data => {
        let keys = Object.keys(data);
        let length = keys.length;
        for(let i = 0; i < length; i++){
            let key = keys[i];
            if ((key == "index") || (key == "url") || (key == "dc")){
            } else if (key =="name"){
                    document.title = "Data Entry: " + data[key];
                    document.getElementById('entry_name').innerText = data[key];
                } else {
                    let row = document.createElement('tr')
                    let lable = document.createElement('td')
                    lable.innerText = clean(key);
                    lable.classList.add("first_collumn")
                    row.appendChild(lable)
                    let info = document.createElement('td')
                    create_info_element(info, data, key)
                    row.appendChild(info)
                    document.getElementById('data_table').appendChild(row)
            }
        }
        if (window.innerHeight > document.body.offsetHeight){
            let footer = document.getElementById("footer");
            footer.style.position = "fixed";
            footer.style.bottom = 0;
        }
    })