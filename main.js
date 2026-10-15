let darktheme=document.getElementById("darktheme")
darktheme.addEventListener("click",()=>{
    darktheme.classList.toggle("ri-moon-fill")
    darktheme.classList.toggle("ri-sun-fill")
    document.body.classList.toggle("darkmodeon")
})
let start=document.getElementById("start")
let lap=document.getElementById("lap")
let reset=document.getElementById("reset")
let showtime=document.getElementById("showtime")
let firsttimelap=document.getElementById("firsttimelap")
let secondtimelap=document.getElementById("secondtimelap")
let thirdtimelap=document.getElementById("thirdtimelap")
let exportcsv=document.getElementById("exportcsv")
let resoflap=document.getElementById("resoflap")
let i,previouslap=0,laparray=[],run=false,lapnumber=0;
let hour=0,minute=0,second=0,hundreths=0;
function startfunc(){
    if(run===false){
        run=true
        start.innerHTML=`<i class="ri-pause-line"></i> Stop`
        i=setInterval(() => {
            hundreths++
            if(hundreths===100){
                hundreths=0
                second++
            }
            if(second>59){
                second=0
                minute++
            }
            if(minute>59){
                minute=0
                hour++
            }
            showtime.textContent=String(hour).padStart(2,"0") + " : "+String(minute).padStart(2,"0")+" : "+String(second).padStart(2,"0") +" . "+String(hundreths).padStart(2,"0")
        },10);
    }else{
        run=false
        clearInterval(i)
        start.innerHTML=`<i class="ri-play-line"></i> Start`
    }
}
function lapfunc(){
    if(run===false){
        return;
    }
    let currenttotaltime=hour*60*60*100+minute*60*100+second*100+hundreths
    let currentlaptime = currenttotaltime-previouslap
    previouslap=currenttotaltime
    lapnumber++
    laparray.push(currentlaptime)
    displaylapinresoflap(lapnumber,currentlaptime)
    updatestatistics()
}
function displaylapinresoflap(number,laptime){
    if(laparray.length===1){
        resoflap.innerHTML=""
    }
    let div=document.createElement("div")
    let p=document.createElement("p")
    p.innerHTML=`Lap : ${number} Time : ${formatlap(laptime)}`
    div.append(p)
    resoflap.append(div)
}
function formatlap(time){
    let h=String(Math.floor((time)/360000)).padStart(2,"0")
    let m=String(Math.floor((time % 360000)/6000)).padStart(2,"0")
    let s=String(Math.floor((time%6000)/100)).padStart(2,"0")
    let hun=String(Math.floor((time)%100)).padStart(2,"0")
    return `${h} : ${m} : ${s} . ${hun}`
}
function updatestatistics(){
    let fastest=laparray[0]
    for(let i=1;i<laparray.length;i++){
        if(laparray[i]<fastest){
            fastest=laparray[i]
        }
    }
    let slowest=laparray[0]
     for(let i=1;i<laparray.length;i++){
        if(laparray[i]>slowest){
            slowest=laparray[i]
        }
    }
    let total=0
     for(let i=0;i<laparray.length;i++){
        total+=laparray[i]
    }
    let avg=Math.floor(total / laparray.length)
    
    firsttimelap.textContent=formatlap(fastest)
    secondtimelap.textContent=formatlap(slowest)
    thirdtimelap.textContent=formatlap(avg)
}
function resetfunc(){
     hour=0,minute=0,second=0,hundreths=0,run=false
    start.innerHTML=`<i class="ri-play-fill"></i> Start`
    clearInterval(i)
    showtime.textContent=String(hour).padStart(2,"0") + " : "+String(minute).padStart(2,"0")+" : "+String(second).padStart(2,"0")+" . "+String(hundreths).padStart(2,"0")
    previouslap=0
    laparray=[]
    lapnumber=0
    resoflap.innerHTML=` <p class="flaglap"><i class="ri-flag-fill"></i></p> <p class="flagtxt">Your lap Time will appear here</p>`
    firsttimelap.innerHTML=`--:--:--.--`
    secondtimelap.innerHTML=`--:--:--.--`
    thirdtimelap.innerHTML=`--:--:--.--`
}
start.addEventListener("click",(e)=>{
    startfunc()
})
lap.addEventListener("click",()=>{
    lapfunc()
})
reset.addEventListener("click",()=>{
    resetfunc()
})
exportcsv.addEventListener("click",()=>{
    exportcsvfunc()
})
function exportcsvfunc(){
    if(laparray.length===0){
        alert("No lap data Found")
        return
    }
    let csv=`Lap Numbers , Lap Timing `+"\n"
    for(let i=0;i<laparray.length;i++){
        csv+=`Lap : ${i+1} , ${formatlap(laparray[i])}\n`
    }
    let blob=new Blob([csv],{
        type:"text/csv"
    })
    let url=URL.createObjectURL(blob)
    let a=document.createElement("a")
    a.href=url
    a.download="Lap timing Exported CSV File"
    a.click()
    URL.revokeObjectURL(url)
}
document.addEventListener("keydown",(e)=>{
   if(e.code==="Space"){
    e.preventDefault()
    startfunc()
   }
   if(e.key==="r" || e.key==="R"){
    resetfunc()
   }
   if(e.key==="l" || e.key==="L"){
    lapfunc()
   }
})



