// ======================================
// KONFIGURASI
// ======================================

const API = "https://script.google.com/macros/s/AKfycbyAzRESS17oc5ABmxl9--Nd1yoER3E0kzryWecBK7FVW9xPJos7GAW56ldxYb6_J3fOJA/exec";

let html5QrCode;
let idGuru = "";
let sudahScan = false;

// ======================================
// JAM
// ======================================

function updateJam() {

    const sekarang = new Date();

    document.getElementById("jam").innerHTML =
        sekarang.toLocaleDateString("id-ID") +
        "<br>" +
        sekarang.toLocaleTimeString("id-ID");

}

setInterval(updateJam,1000);

updateJam();

// ======================================
// HASIL SCAN
// ======================================

function onScanSuccess(decodedText){

    if(sudahScan) return;

    sudahScan = true;

    idGuru = decodedText.trim();

    document.getElementById("idGuru").innerHTML = idGuru;

    setTimeout(()=>{

        sudahScan = false;

    },3000);

}

// ======================================
// KAMERA DAN SCANNER
// ======================================

const kameraSelect = document.getElementById("kamera");

html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras()

.then(cameras => {

    if (!cameras || cameras.length === 0) {

        alert("Kamera tidak ditemukan.");

        return;

    }

    cameras.forEach(camera => {

        const option = document.createElement("option");

        option.value = camera.id;
        option.text = camera.label || "Camera";

        kameraSelect.appendChild(option);

    });

    mulaiScanner(cameras[0].id);

    kameraSelect.addEventListener("change", function(){

        html5QrCode.stop()

        .then(() => {

            mulaiScanner(this.value);

        })

        .catch(console.error);

    });

})

.catch(err => {

    console.error(err);

    alert("Tidak dapat mengakses kamera.");

});

// ======================================
// MULAI SCANNER
// ======================================

function mulaiScanner(cameraId){

    html5QrCode.start(

        cameraId,

        {
            fps:10,
            qrbox:{
                width:250,
                height:250
            }
        },

        onScanSuccess,

        () => {}

    )

    .catch(console.error);

}

// ======================================
// ABSEN
// ======================================

const btnAbsen = document.getElementById("btnAbsen");

btnAbsen.addEventListener("click", () => {

    if(idGuru==""){

        alert("Silakan scan QR Code terlebih dahulu.");

        return;

    }

    btnAbsen.disabled = true;
    btnAbsen.innerHTML = "Mengirim...";

    const status = document.getElementById("status").value;

    fetch(

        API +
        "?aksi=absen" +
        "&id=" + encodeURIComponent(idGuru) +
        "&status=" + encodeURIComponent(status)

    )

    .then(res => res.json())

    .then(data => {

        if(data.status){

            alert(
                "✅ ABSENSI BERHASIL\n\n" +
                "Nama : " + data.nama +
                "\nStatus : " + data.statusAbsen +
                "\nTanggal : " + data.tanggal +
                "\nJam : " + data.jam
            );

            idGuru = "";

            document.getElementById("idGuru").innerHTML = "Belum Scan";

        }else{

            alert("❌ " + data.pesan);

        }

    })

    .catch(err => {

        console.error(err);

        alert("Tidak dapat terhubung ke server.");

    })

    .finally(() => {

        btnAbsen.disabled = false;
        btnAbsen.innerHTML = "ABSEN SEKARANG";

    });

});
