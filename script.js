const API = "https://script.google.com/macros/s/AKfycbyAzRESS17oc5ABmxl9--Nd1yoER3E0kzryWecBK7FVW9xPJos7GAW56ldxYb6_J3fOJA/exec";

let idGuru = "";
let namaGuru = "";

function updateJam() {
  const sekarang = new Date();

  document.getElementById("jam").innerHTML =
    sekarang.toLocaleDateString("id-ID") +
    "<br>" +
    sekarang.toLocaleTimeString("id-ID");
}

setInterval(updateJam, 1000);
updateJam();

function onScanSuccess(decodedText) {
function absen(status) {

  if (idGuru == "") {
    alert("Silakan scan QR Code terlebih dahulu!");
    return;
  }

  fetch(
    API +
      "?aksi=absen&id=" +
      encodeURIComponent(idGuru) +
      "&status=" +
      encodeURIComponent(status)
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        alert(
          "Absensi berhasil\n\n" +
          data.nama +
          "\n" +
          status
        );
      } else {
        alert(data.pesan);
      }
    })
    .catch(() => {
      alert("Gagal terhubung ke server.");
    });
}
  idGuru = decodedText;

  document.getElementById("idGuru").innerHTML = decodedText;

  fetch(API + "?aksi=guru&id=" + encodeURIComponent(decodedText))
    .then(res => res.json())
    .then(data => {

      if (data.status) {

        namaGuru = data.nama;

        document.getElementById("namaGuru").innerHTML = data.nama;

      } else {

        document.getElementById("namaGuru").innerHTML = "Guru tidak ditemukan";

      }

    });

}
