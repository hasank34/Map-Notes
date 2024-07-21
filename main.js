import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { detecIcon, setStorage } from "./helpers.js";
var map;
let coords = [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
var layerGroup = [];
//*haritaya tıkladığımızda çalışır ve parametresine tıkladoğımız yerle alakalı veriler gelir
const onMapClick = (e) => {
  //* haritaya tıkladığımızda form alanının style özelliğini flex yap
  form.style.display = "flex";
  //* coords dizisine tıkladığımız yerin koordinalarını ekle
  coords = [e.latlng.lat, e.latlng.lng];
  console.log(coords);
};

//* Kullanıcının konumuna göre ekrana haritayı göster.
const loadMap = (e) => {
  // haritanın kurulumu.
  map = L.map("map").setView([51.505, -0.09], 13);
  //haritanın nasıl kurulacağını belirler.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  //*Haritada ekrana basılacak olan imleçleri tutacağımız katmandır
  layerGroup = L.layerGroup().addTo(map);

  renderNoteList (notes);

  //* haritada bir tıklanma olduğunda çalışacak fonksiyondur ve fonksiyonun eventına tıkladığımız konumla alakalı veriler gidecektir.
  map.on("click", onMapClick);
};

navigator.geolocation.getCurrentPosition(
  loadMap,
  console.log("Kullanıcı Kabul Etmedi")
);

const renderMarker = (item) => {
  console.log(item);
  L.marker(item.coords, { icon: detecIcon(item.status) })
    .addTo(layerGroup)
    .bindPopup(`${item.desc}`);
};

const renderNoteList = (item) => {
  list.innerHTML = "";

  layerGroup.clearLayers()
  item.forEach((item) => {
    const listElement = document.createElement("li");
    listElement.dataset.id = item.id;

    listElement.innerHTML = `<div>
                    <p>${item.desc}</p>
                    <p><span>Tarih:</span>14.07.2024</p>
                    <p><span>Durum:</span>status</p>
                </div>
                <i id="delete" class="bi bi-x"></i>
                <i id="fly" class="bi bi-airplane-fill"></i>`;

    // list etiketinin içerisine listElementi eklerken öncesine eklemek istediğimiz için insertAdjacentElement kullanılır.
    list.insertAdjacentElement("afterbegin", listElement);

    renderMarker(item);
  });
};

const handleSubmit = (e) => {
  //* sayfanın yenilenmesini engelle
  e.preventDefault();
  // inputların ve selectin içerisindeki değerleri al
  const desc = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;
  // notes dizisine oluşturduğumuz yeni not objesini ekledik
  notes.push({ id: uuidv4(), desc, date, status, coords });

  //*locastoroge ekleme  yapılacak
  setStorage(notes);

  renderNoteList(notes);

  form.style.display = "none";
};

const handleClick = (e) => {
  console.log(e)
  // güncellenecek olan elemanın id si
  const id = e.target.parentElement.dataset.id;
  if(e.target.id === "delete"){
    console.log(notes);
    // id sini bildiğimiz elemanı diziden kaldırma
    notes = notes.filter((note) => note.id != id);
    setStorage(notes);
    renderNoteList(notes)
  }
  if(e.target.id ==="fly"){
    const note = notes.find((note)=> note.id ==id);
    map.flyTo(note.coords);
  }
}

//! HTML den gelenler
const form = document.querySelector("form");
const list = document.querySelector("ul");

//! OLAY İZLEYECİLERİ

form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick)
