// Ambil elemen tombol plus, minus, dan input
const plusBtn = document.getElementById('plus-btn');
const minusBtn = document.getElementById('minus-btn');
const inputQty = document.getElementById('quantity');

// Tambahkan event listener untuk tombol plus
plusBtn.addEventListener('click', function() {
  // Tambahkan nilai pada input
  inputQty.value = parseInt(inputQty.value) + 1;
});

// Tambahkan event listener untuk tombol minus
minusBtn.addEventListener('click', function() {
  // Kurangi nilai pada input jika nilainya lebih besar dari 1
  if (inputQty.value > 1) {
    inputQty.value = parseInt(inputQty.value) - 1;
  }
});
