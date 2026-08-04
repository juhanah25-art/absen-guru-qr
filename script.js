// =============================
// KONFIGURASI
// =============================

const API = "https://script.google.com/macros/s/AKfycbyAzRESS17oc5ABmxl9--Nd1yoER3E0kzryWecBK7FVW9xPJos7GAW56ldxYb6_J3fOJA/exec";

let idGuru = "";
let namaGuru = "";
let html5QrCode = null;
let cameraId = "";
let sudahScan = false;


// =============================
// JAM DIGITAL
// =============================

function updateJam() {

    const sekarang = new Date();

    document.getElementById("jam").innerHTML =
        sekarang.toLocaleDateString("id-ID") +
        "<br>" +
        sekarang.toLocaleTimeString("id-ID");

}

setInterval(updateJam, 1000);

updateJam();


// =============================
// SETELAH QR BERHASIL DI SCAN
// =============================

function onScanSuccess(decodedText) {

    if (sudahScan) return;

    sudahScan = true;

    idGuru = decodedText.trim();

    document.getElementById("idGuru").innerHTML = idGuru;

    cariGuru(idGuru);

    setTimeout(() => {

        sudahScan = false;

    }, 3000);

}
// =============================
// CARI GURU
// =============================

function cariGuru(id) {

    fetch(API + "?aksi=guru&id=" + encodeURIComponent(id))
        .then(response => response.json())
        .then(data => {

            if (data.status) {

                namaGuru = data.nama;

                document.getElementById("namaGuru").innerHTML = data.nama;

            } else {

                namaGuru = "";

                document.getElementById("namaGuru").innerHTML = "Guru tidak ditemukan";

            }

        })
        .catch(error => {

            console.error(error);

            document.getElementById("namaGuru").innerHTML = "Server Error";

            alert("Tidak dapat terhubung ke server.");

        });

}


// =============================
// ABSEN
// =============================

function absen(status) {

    if (idGuru == "") {

        alert("Silakan scan QR terlebih dahulu.");

        return;

    }

    fetch(
        API +
        "?aksi=absen" +
        "&id=" + encodeURIComponent(idGuru) +
        "&status=" + encodeURIComponent(status)
    )

    .then(response => response.json())

    .then(data => {

        if (data.status) {

            alert(
                "✅ " + data.pesan +
                "\n\nNama : " + data.nama +
                "\nTanggal : " + data.tanggal +
                "\nJam : " + data.jam
            );

            // Reset setelah berhasil absen
            idGuru = "";
            namaGuru = "";

            document.getElementById("idGuru").innerHTML = "-";
            document.getElementById("namaGuru").innerHTML = "Belum Scan";

        } else {

            alert(data.pesan);

        }

    })

    .catch(error => {

        console.error(error);

        alert("Tidak dapat terhubung ke server.");

    });

}
// =============================
// SCANNER QR + PILIH KAMERA
// =============================

const kameraSelect = document.getElementById("kamera");

html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras()

.then(cameras => {

    if (!cameras || cameras.length === 0) {

        alert("Kamera tidak ditemukan.");

        return;

    }

    // Isi daftar kamera
    cameras.forEach(cam => {

        const option = document.createElement("option");

        option.value = cam.id;
        option.text = cam.label || "Camera";

        kameraSelect.appendChild(option);

    });

    // Pilih kamera pertama
    cameraId = cameras[0].id;

    kameraSelect.value = cameraId;

    mulaiScanner(cameraId);

    // Jika pengguna mengganti kamera
    kameraSelect.addEventListener("change", function () {

        cameraId = this.value;

        html5QrCode.stop()

        .then(() => {

            mulaiScanner(cameraId);

        })

        .catch(err => console.log(err));

    });

})

.catch(error => {

    console.error(error);

    alert("Tidak dapat mengakses kamera.");

});


// =============================
// MULAI SCANNER
// =============================

function mulaiScanner(idCamera) {

    html5QrCode.start(

        idCamera,

        {
            fps: 10,
            qrbox: {
                width: 250,
                height: 250
            }
        },

        onScanSuccess,

        errorMessage => {
            // Abaikan error scan
        }

    )

    .catch(err => {

        console.error(err);

        alert("Gagal membuka kamera.");

    });

}
