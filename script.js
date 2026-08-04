// ======================================
// KONFIGURASI
// ======================================

const API = "https://script.google.com/macros/s/AKfycbzniwbPCeK4hA7UXnU5kyAhSAVMJnjILloPJKa1EyQtD0DS3yJXZdpKVcryHUVLZKseSA/exec";

let html5QrCode;
let idGuru = "";
let sudahScan = false;

// ======================================
// JAM REAL-TIME
// ======================================

function updateJam() {
    const sekarang = new Date();
    document.getElementById("jam").innerHTML =
        sekarang.toLocaleDateString("id-ID") +
        "<br>" +
        sekarang.toLocaleTimeString("id-ID");
}

setInterval(updateJam, 1000);
updateJam();

// ======================================
// HASIL SCAN QR CODE
// ======================================

function onScanSuccess(decodedText) {
    if (sudahScan) return;
    sudahScan = true;

    idGuru = decodedText.trim();
    
    // Tampilkan ID Guru sementara proses pencarian nama
    document.getElementById("idGuru").innerHTML = `Mencari ID: ${idGuru}...`;

    // 1. OTOMATIS CARI NAMA GURU KE GOOGLE SHEETS
    const urlCari = `${API}?aksi=guru&id=${encodeURIComponent(idGuru)}`;

    fetch(urlCari, {
        method: "GET",
        redirect: "follow" // WAJIB: Mengikuti redirect Google Script
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            // Jika guru ditemukan, tampilkan namanya
            document.getElementById("idGuru").innerHTML = `<strong>${data.nama}</strong> (ID: ${idGuru})`;
            alert(`Guru Terdeteksi:\nNama: ${data.nama}\nID: ${idGuru}`);
        } else {
            document.getElementById("idGuru").innerHTML = `<span style="color: red;">ID tidak terdaftar!</span>`;
            alert("Error: " + data.pesan);
            idGuru = ""; // Reset ID karena tidak valid
        }
    })
    .catch(error => {
        console.error("Error saat cari guru:", error);
        document.getElementById("idGuru").innerHTML = `<span style="color: red;">Gagal terhubung ke server</span>`;
        alert("Gagal terhubung ke server saat memverifikasi ID Guru.");
        idGuru = "";
    })
    .finally(() => {
        // Berikan jeda 3 detik sebelum bisa scan QR Code berikutnya
        setTimeout(() => {
            sudahScan = false;
        }, 3000);
    });
}

// ======================================
// INISIALISASI KAMERA DAN SCANNER
// ======================================

const kameraSelect = document.getElementById("kamera");
html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras()
.then(cameras => {
    if (!cameras || cameras.length === 0) {
        alert("Kamera tidak ditemukan.");
        return;
    }

    // Kosongkan loading option
    kameraSelect.innerHTML = "";

    cameras.forEach(camera => {
        const option = document.createElement("option");
        option.value = camera.id;
        option.text = camera.label || `Kamera ${kameraSelect.length + 1}`;
        kameraSelect.appendChild(option);
    });

    // Jalankan kamera pertama secara default
    mulaiScanner(cameras[0].id);

    // Event listener jika user mengganti kamera (misal ke kamera belakang)
    kameraSelect.addEventListener("change", function() {
        html5QrCode.stop()
        .then(() => {
            mulaiScanner(this.value);
        })
        .catch(console.error);
    });
})
.catch(err => {
    console.error(err);
    alert("Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.");
});

function mulaiScanner(cameraId) {
    html5QrCode.start(
        cameraId,
        {
            fps: 10,
            qrbox: {
                width: 250,
                height: 250
            }
        },
        onScanSuccess,
        () => {} // Callback saat tidak ada QR (diabaikan agar tidak spam console)
    )
    .catch(console.error);
}

// ======================================
// PROSES TOMBOL ABSEN
// ======================================

const btnAbsen = document.getElementById("btnAbsen");

btnAbsen.addEventListener("click", () => {
    if (idGuru === "") {
        alert("Silakan scan QR Code terlebih dahulu sampai nama guru muncul.");
        return;
    }

    btnAbsen.disabled = true;
    btnAbsen.innerHTML = "Mengirim...";

    const status = document.getElementById("status").value;
    const urlAbsen = `${API}?aksi=absen&id=${encodeURIComponent(idGuru)}&status=${encodeURIComponent(status)}`;

    // Kirim data absensi
    fetch(urlAbsen, {
        method: "GET",
        redirect: "follow" // WAJIB
    })
    .then(response => response.json()) // Baca respon sebagai JSON
    .then(data => {
        if (data.status) {
            alert(`✅ ABSENSI BERHASIL!\n\nNama: ${data.nama}\nTanggal: ${data.tanggal}\nJam: ${data.jam}\nStatus: ${data.statusAbsen}`);
            // Reset setelah sukses
            document.getElementById("idGuru").innerHTML = "Belum Scan";
            idGuru = "";
        } else {
            alert(`❌ GAGAL ABSEN:\n${data.pesan}`);
        }
    })
    .catch(error => {
        console.error("Error saat kirim absen:", error);
        alert("Koneksi gagal! Absensi tidak terkirim ke Google Sheets.");
    })
    .finally(() => {
        btnAbsen.disabled = false;
        btnAbsen.innerHTML = "ABSEN SEKARANG";
    });
});
