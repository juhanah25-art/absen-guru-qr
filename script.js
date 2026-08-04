// =============================
// KONFIGURASI
// =============================

const API =
"https://script.google.com/macros/s/AKfycbyAzRESS17oc5ABmxl9--Nd1yoER3E0kzryWecBK7FVW9xPJos7GAW56ldxYb6_J3fOJA/exec";

let idGuru = "";
let namaGuru = "";


// =============================
// JAM DIGITAL
// =============================

function updateJam(){

const sekarang = new Date();

document.getElementById("jam").innerHTML=

sekarang.toLocaleDateString("id-ID")+

"<br>"+

sekarang.toLocaleTimeString("id-ID");

}

setInterval(updateJam,1000);

updateJam();


// =============================
// SETELAH QR BERHASIL DI SCAN
// =============================

function onScanSuccess(decodedText){

idGuru = decodedText;

document.getElementById("idGuru").innerHTML=idGuru;

cariGuru(idGuru);

}// =============================
// CARI GURU
// =============================

function cariGuru(id){

fetch(
API+"?aksi=guru&id="+encodeURIComponent(id)
)

.then(response=>response.json())

.then(data=>{

if(data.status){

namaGuru=data.nama;

document.getElementById("namaGuru").innerHTML=data.nama;

}else{

namaGuru="";

document.getElementById("namaGuru").innerHTML=
"Guru tidak ditemukan";

}

})

.catch(error=>{

console.log(error);

alert("Tidak dapat terhubung ke server.");

});

}// =============================
// ABSEN
// =============================

function absen(status){

if(idGuru==""){

alert("Silakan scan QR terlebih dahulu.");

return;

}

fetch(

API+

"?aksi=absen"+

"&id="+encodeURIComponent(idGuru)+

"&status="+encodeURIComponent(status)

)

.then(response=>response.json())

.then(data=>{

if(data.status){

alert(

"✅ "+data.pesan+

"\n\nNama : "+data.nama+

"\nJam : "+data.jam

);

}else{

alert(data.pesan);

}

})

.catch(error=>{

console.log(error);

alert("Server tidak dapat dihubungi.");

});

}// =============================
// SCANNER QR
// =============================

let sudahScan = false;

const html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras()

.then(cameras=>{

if(cameras && cameras.length){

html5QrCode.start(

cameras[0].id,

{

fps:10,

qrbox:{
width:250,
height:250
}

},

(decodedText)=>{

if(!sudahScan){

sudahScan=true;

function onScanSuccess(decodedText){

alert("Hasil Scan: " + decodedText);

idGuru = decodedText;

document.getElementById("idGuru").innerHTML = idGuru;

cariGuru(idGuru);

}

setTimeout(function(){

sudahScan=false;

},3000);

}

},

(errorMessage)=>{

// Abaikan error scan

}

);

}else{

alert("Kamera tidak ditemukan.");

}

})

.catch(error=>{

console.log(error);

alert("Tidak dapat mengakses kamera.");

});
