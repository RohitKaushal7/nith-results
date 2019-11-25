
var container = document.querySelector('.container');
var branch;
var batch;
var data;
var xhr;
var limit = 500;

var you = document.querySelector('#you');
var res_cnt = document.querySelector('#res_cnt');
var your_res;

var you_id = localStorage.getItem('you_id') | '';
if(you_id){
    document.querySelector('#rem').innerText = "Hi," + you_id; 
}

// auto full year in 3 sec.
setTimeout(change,3000); 

// change branch or year.
function change(){
    limit = 500;
    clear();
    branch = document.querySelector('#branch').value;
    batch = document.querySelector('#batch').value;
    xhr = new XMLHttpRequest();

    if(branch == 'FULL_COLLEGE'){
        xhr.open('get', `./json/${branch}/full_college_cgpi.json`);
    }
    else if(branch == 'FULL_YEAR'){
        xhr.open('get', `./json/${branch}/full_year_batch${batch}_cgpi.json`);
    }
    else{
        xhr.open('get', `./json/${branch}/batch_${batch}_cgpi.json`);
    }

    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                data = JSON.parse(xhr.responseText);
                limit =  (limit < data.length)?limit:data.length;

                // enable page buttons if data exceeds 500
                if(data.length > 500){
                    document.querySelector('.nav').style.display = 'flex';
                }
                else{
                    document.querySelector('.nav').style.display = 'none';
                }


                // find your result
                your_res =  data.filter(obj => obj.Rollno == you_id )[0];
                if(your_res){
                    you.innerHTML ='';
                    you.appendChild(create(your_res));
                }
                else{
                    you.innerHTML = "<span id ='rem'>You are not Here..!</span>"   
                }
            
                let i =0;
                for (const stud of data) {
                    renderSmooth(stud,i,20);
                    i++;
                    if(i>limit) break;
                }
            }                  
        }
    }
}

// Search 
document.addEventListener('keyup', function(e){

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
                
                for(let i =0 ;i<Math.min(500,res.length);++i){
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

function clear(){
    let divs = document.querySelectorAll('.container > div');

    for (var div of divs) {
        div.parentElement.removeChild(div);
    }
}

function create(stud){
    let node = document.createElement('div');
    let Name = document.createElement('div'); Name.className = "Name"; Name.innerText = stud.Name.split('S/D')[0];
    let Rollno = document.createElement('div'); Rollno.className = "Rollno"; Rollno.innerText = stud.Rollno;
    let Rank = document.createElement('div'); Rank.className = "Rank"; Rank.innerText = '#_'+stud.Rank;
    let Cgpa = document.createElement('div'); Cgpa.className = "Cgpa"; Cgpa.innerText = stud.Cgpa; 
    let Sgpa = document.createElement('div'); Sgpa.className = "Sgpa"; Sgpa.innerText = stud.Sgpa; 
    let Points = document.createElement('div'); Points.className = "Points"; Points.innerText = stud.Points; 
    if(branch == 'FULL_COLLEGE'){
        let Branch  = document.createElement('div'); Branch.className = "Branch"; Branch.innerText = stud.Branch; 
        let Year = document.createElement('div'); Year.className = "Year"; Year.innerText = stud.Year; 
        node.append(Rank,Name,Rollno,Branch,Year,Points,Sgpa,Cgpa);
    }
    else if(branch == 'FULL_YEAR'){
        let Branch  = document.createElement('div'); Branch.className = "Branch"; Branch.innerText = stud.Branch;
        node.append(Rank,Name,Rollno,Branch,Points,Sgpa,Cgpa);
    }
    else{
        node.append(Rank,Name,Rollno,Points,Sgpa,Cgpa);
    }

    node.setAttribute('data-rank',stud.Rank);
    
    return node;
    // container.appendChild(node);
}

function renderSmooth(div,i,n=50){
    if(i<n){ // animations delay for some first divs
        anim_div=create(div);
        anim_div.style.animationDelay=i/50+'s';
        container.appendChild(anim_div);
    }
    else{
        container.appendChild(create(div));
    }
}


function next(){
    clear();
    limit +=500;
    limit = (limit>data.length)?data.length:limit;
    for(i=Math.max(0,limit-500);i<limit;++i){
        container.appendChild(create(data[i]));
    }
}

function prev(){
    clear();
    limit -=500;
    limit = limit<500? 500: limit;
    for(i=Math.max(0,limit-500);i<limit;++i){
        container.appendChild(create(data[i]));
    }
}

function save(){
    tmp = prompt("Enter Your Roll No. to Remember you on this device. Tip- you can always change roll no by clicking on your info.");
    console.log(tmp);
    
    you_id = tmp != '' && tmp != null ? tmp: you_id;
    localStorage.setItem('you_id',you_id);
    change();
}
