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
function onScanSuccess(decodedText){

document.getElementById("hasilQR").innerHTML=
"QR : "+decodedText;

}

let html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras().then(devices=>{

if(devices.length){

html5QrCode.start(

devices[0].id,

{
fps:10,
qrbox:250
},

onScanSuccess

);

}

});
