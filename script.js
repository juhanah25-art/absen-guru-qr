function updateJam(){

const sekarang=new Date();

document.getElementById("jam").innerHTML=
sekarang.toLocaleDateString("id-ID")+
"<br>"+
sekarang.toLocaleTimeString("id-ID");

}

setInterval(updateJam,1000);

updateJam();

document
.getElementById("btnTes")
.onclick=function(){

alert("Website GitHub berhasil!");

}
