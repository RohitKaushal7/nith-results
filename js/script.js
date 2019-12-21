
var container = document.querySelector('.container'); // Main Data Container

// controllers 
var branch;
var batch;
var cs = 'c';

var n_elem = 200; // Number of elements per page
var limit = n_elem; // for pagination purpose

var xhr;
var data; // XHR response data
var res; // Search Result
var your_res; // Local user result if exists in the current page (`data`)

var you = document.querySelector('#you'); // Local Username / Result Container
var you_id; // JSON object - Local
var you_obj_res; // User Object JSON.parse(you_id)
var name; // User name S/D stripped

var res_cnt = document.querySelector('#res_cnt'); // Results found Count


getLocalUser(); // greet user if exists
if(you_obj_res.Rollno != 0){
    document.querySelector('#rem').innerText = "Hi," + name; 
}



setTimeout(change,3000); // auto change to full_year in 3 sec.

// change branch or year. > Sends XHR  
function change(){
    limit = n_elem;
    clear();
    branch = document.querySelector('#branch').value;
    batch = document.querySelector('#batch').value;
    xhr = new XMLHttpRequest();

    if(branch == 'FULL_COLLEGE'){
        xhr.open('get', `./json/${branch}/full_college_${cs}gpi.json`);
    }
    else if(branch == 'FULL_YEAR'){
        xhr.open('get', `./json/${branch}/full_year_batch${batch}_${cs}gpi.json`);
    }
    else{
        xhr.open('get', `./json/${branch}/batch_${batch}_${cs}gpi.json`);
    }

    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                data = JSON.parse(xhr.responseText);
                
                render();
            }                  
        }
    }
}

// CGPA / SGPA toggle
function cs_toggle(){
    if(cs=='c'){
        cs = 's';
        this.innerText = 'Sg';
    }
    else {
        cs = 'c';
        this.innerText = 'Cg';
    }
    change();
}



// Search 
var ser = document.querySelector('input[type="search"]');
ser.addEventListener('keyup', function(e){

    if([13,8,32,48,49,50,51,52,53,54,55,56,57,...[...Array(26).keys()].map(x=> 65+x)].indexOf(e.keyCode)==-1){
        // console.log(e.keyCode,'skipped');
        return;
        
    }
    // console.log(e.keyCode,'passed');
    
    let ip = String(document.querySelector('input[type=search]').value).toUpperCase();
    let divs = document.querySelectorAll('.container > div');
    res_cnt.innerHTML = '';
    
    // in FULL SEARCH -search in the data[] instead of divs to find every result.
    if(branch == 'FULL_COLLEGE' || branch == 'FULL_YEAR'){ 
        res = data.filter(obj => JSON.stringify(obj).toUpperCase().indexOf(ip) != -1 );
    
        if( !ip && divs.length < 100 ){ // refresh / clear the search when input is empty 
            change();
        }
        else if(ip){
            clear();
            if(res){
                res_cnt.innerHTML = res.length + ' results found...';
                
                for(let i =0 ;i<Math.min(n_elem,res.length);++i){
                    renderSmooth(res[i],i);
                }
            }
        }
    }

    // search in DOM divs to avoid clearing the whole DOM.
    else{
        for (var div of divs) {
            str = String(div.innerText).toUpperCase();
            if(str.indexOf(ip) > -1){
                div.style.display = "block";
            }
            else{
                div.style.display = "none";
            }
        }
    }
});



// create n new Card for Student // ----------------------------------------------------------------------------------------------------
function create(stud){
    let node = document.createElement('div');
        node.className = 'card';

    let Name = document.createElement('div');
        Name.className = "Name";
        Name.innerText = stud.Name.split('S/D')[0];
        Name.title = 'Name';
    let Rollno = document.createElement('div');
        Rollno.className = "Rollno";
        Rollno.innerText = stud.Rollno;  
        Rollno.title = 'Rollno';
    let Rank = document.createElement('div');
        Rank.className = "Rank";
        Rank.innerText = '#_'+stud.Rank;    
        Rank.title = 'Rank';
    let Cgpa = document.createElement('div');
        Cgpa.className = "Cgpa";
        Cgpa.innerText = cs=='c' ? stud.Cgpa : stud.Sgpa;
        Cgpa.title = cs=='c'? 'Cgpa' : 'Sgpa';
    let Sgpa = document.createElement('div');
        Sgpa.className = "Sgpa";
        Sgpa.innerText = cs=='c' ? stud.Sgpa : stud.Cgpa;
        Sgpa.title = cs=='c'? 'Sgpa' : 'Cgpa';
    let Points = document.createElement('div');
        Points.className = "Points";
        Points.innerText = stud.Points;
        Points.title = 'Points';

    if(branch == 'FULL_COLLEGE'){ // + Branch, Year
        let Branch  = document.createElement('div');
            Branch.className = "Branch";
            Branch.innerText = stud.Branch; 
        let Year = document.createElement('div');
            Year.className = "Year";
            Year.innerText = stud.Year; 
        node.append(Rank,Name,Rollno,Branch,Year,Points,Sgpa,Cgpa);
    }
    else if(branch == 'FULL_YEAR'){ // + Branch
        let Branch  = document.createElement('div');
            Branch.className = "Branch";
            Branch.innerText = stud.Branch;
        node.append(Rank,Name,Rollno,Branch,Points,Sgpa,Cgpa);
    }
    else{ // + 
        node.append(Rank,Name,Rollno,Points,Sgpa,Cgpa);
    }

    node.setAttribute('data-rank',stud.Rank);
    node.setAttribute('data-base',parseInt(Cgpa.innerText));
    
    return node;
}

// render `data` > divs in the container // ----------------------------------------------------------------------------------------------------
function render(){
    limit =  (limit < data.length)?limit:data.length;
    // enable page-navigation buttons if data exceeds n_elem
    if(data.length > n_elem){
        document.querySelector('.nav').style.display = 'flex';
    }
    else{
        document.querySelector('.nav').style.display = 'none';
    }


    // find User result
    getLocalUser();
    your_res =  data.filter(obj => obj.Rollno == you_obj_res.Rollno )[0];
    if(your_res){
        you.innerHTML ='';
        you.appendChild(create(your_res));
    }
    else{
        you.innerHTML = "<span id ='rem'>You are not Here..!</span>"   
    }

    // Render the divs
    let i =0;
    for (const stud of data) {
        renderSmooth(stud,i,20);
        i++;
        if(i>limit) break;
    }
}

// Renders with animation
function renderSmooth(div,i,n=50){
    if(Number(div.Cgpa)){
        if(i<n){ // animations delay for some first divs
            anim_div=create(div);
            anim_div.style.animationDelay=i/50+'s';
            container.appendChild(anim_div);
        }
        else{
            container.appendChild(create(div));
        }
    }
}

// Clears the Container
function clear(){
    let divs = document.querySelectorAll('.container > div');

    for (var div of divs) {
        div.parentElement.removeChild(div);
    }
}



// Pagination navigation // ----------------------------------------------------------------------------------------------------
function next(){
    clear();
    p_data = res || data;
    limit +=n_elem;
    limit = (limit>p_data.length)?p_data.length:limit;
    for(i=Math.max(0,limit-n_elem);i<limit;++i){
        if(Number(p_data[i].Cgpa)){
            container.appendChild(create(p_data[i]));
        }
    }
}

function prev(){
    clear();
    p_data = res || data;
    limit -=n_elem;
    limit = limit<n_elem? n_elem: limit;
    for(i=Math.max(0,limit-n_elem);i<limit;++i){
        if(Number(p_data[i].Cgpa)){
            container.appendChild(create(p_data[i]));
        }
    }
}



// Local User Popup // ----------------------------------------------------------------------------------------------------
var popup = document.querySelector('.popup');
function togglePopup(){
    
    if(popup.style.display == 'none'){
        popup.style.display = 'flex';
        popup.style.transform = "scale(1)";
        popup.style.opacity = 1;
        popup.querySelector('input').focus();
    }
    else{
        setTimeout(()=>{
            popup.style.display = 'none';
        },1000);
        popup.style.transform = "scale(1.1)";
        popup.style.opacity = 0;
    }
}

// Esc popup
popup.addEventListener('keydown', function(e){
    if(e.keyCode == 27) 
        togglePopup();
});

// store User rollNo on LocalStorage
document.querySelector('#form_you_inp').addEventListener('submit', function(e){
    e.preventDefault(e);
    tmp = document.querySelector('#you_inp').value;
    console.log(tmp);
    rollno_ip = tmp != '' && tmp != null ? tmp: you_id;
    you_obj = data.filter(obj => JSON.stringify(obj).toUpperCase().indexOf(rollno_ip) != -1 )[0];
    console.log(you_obj);

    let save_str;
    if(you_obj){
        save_str = JSON.stringify(you_obj);
    }
    else{
        save_str = JSON.stringify({Rollno : rollno_ip, Name : 'There'});
    }
    console.log(save_str);
    
    localStorage.setItem('you_id',save_str);
    change();
    togglePopup();
});

// get the local user if it is in the localStorage
function getLocalUser(){
    you_id = localStorage.getItem('you_id') || '';
    if(you_id){
        you_obj_res = JSON.parse(you_id);
    }
    else{
        you_obj_res = {Rollno : 0, Name: "There"}
    }
    if(you_obj_res) name = toTitleCase(you_obj_res.Name.split('S/D')[0]);
}



// Helper Fuctions // ----------------------------------------------------------------------------------------------------
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}