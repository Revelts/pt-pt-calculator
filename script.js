document.addEventListener('DOMContentLoaded', function(){
  const gliderEl = document.querySelector('.glider');
  if (gliderEl && typeof Glider !== 'undefined') {
    new Glider(gliderEl, {
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: true,
      dots: '.dots',
      arrows: {
        prev: '.glider-prev',
        next: '.glider-next'
      }
    });
  }
});


function copyOutput() {
  const output = document.getElementById('output').innerText;

  navigator.clipboard.writeText(output).then(() => {
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = 'Copy Output';
    }, 1500);
  }).catch(err => {
    alert('Failed to copy: ', err);
  });
}


function toRupiah(number) {
  if (isNaN(number)) number = 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

function fromRupiahFormat(str) {
  return parseInt(str.replace(/\D/g, ''), 10) || 0;
}

document.addEventListener('DOMContentLoaded', () => {
  const hargaInput = document.getElementById('hargaBotol');

  hargaInput.addEventListener('input', () => {
    const raw = hargaInput.value;

    // Get the cursor position
    const start = hargaInput.selectionStart;

    // Extract just the digits
    const digitsBeforeCursor = raw.slice(0, start).replace(/\D/g, '');

    // Full number as plain integer
    const rawNumber = fromRupiahFormat(raw);
    const formatted = toRupiah(rawNumber);

    hargaInput.value = formatted;

    // Recalculate cursor: how many digits were before?
    let digitCount = digitsBeforeCursor.length;
    let newCursor = formatted.length;

    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        count++;
      }
      if (count === digitCount) {
        newCursor = i + 1;
        break;
      }
    }

    hargaInput.setSelectionRange(newCursor, newCursor);
  });
});


  
function generate() {

  
  const outputElement = document.getElementById('output');
  const copyButton = document.getElementById('copyBtn');
  const resultCard = document.getElementById('resultCard');

  const hargaBotolFormatted = document.getElementById('hargaBotol').value;
  const hargaBotol = fromRupiahFormat(hargaBotolFormatted);
  const namaBotol = document.getElementById('namaBotol').value;
  const jumlahOrang = parseInt(document.getElementById('jumlahOrang').value);
  const pajak = parseFloat(document.getElementById('pajak').value);
  const namaVenue = document.getElementById('namaVenue').value;
  const nomorRekening = document.getElementById('nomorRekening').value;
  const namaRekening = document.getElementById('namaRekening').value;
  const ongoingEvent = document.getElementById('ongoingEvent').value;
  const contactPerson = document.getElementById('contactPerson').value;
  const namaBank = document.getElementById('namaBank').value;

  if (isNaN(hargaBotol) || isNaN(jumlahOrang) || isNaN(pajak) || !namaBotol || !namaVenue) {
    // Keep output hidden if validation fails
    if (resultCard) resultCard.style.display = 'none';
    outputElement.style.display = 'none';
    copyButton.style.display = 'none';
    return;
  }

  const tax = (hargaBotol * pajak) / 100;
  const totalPrice = hargaBotol + tax;
  const pricePerPax = totalPrice / jumlahOrang;

  let result = `🌃 Venue : ${namaVenue}\n`;
  if(ongoingEvent !== "") {
    result += `⭐ Event : ${ongoingEvent}\n`
  }

  result += `💼 Item : ${namaBotol}\n`;
  result += `💰 Price (after Tax ${pajak}%) : ${toRupiah(totalPrice)}\n`;
  result += `💲 Price (per pax) : ${toRupiah(pricePerPax)}\n`;

  for (let i = 1; i <= jumlahOrang; i++) {
    result += `${i}.\n`;
  }

  console.log(nomorRekening)
  if(nomorRekening !== "") {
    result += `\n`
    result += `HANYA MENERIMA VIA TF👌\n ${namaBank == "" ? "-" : namaBank} ${nomorRekening} a/n ${namaRekening == "" ? "-" : namaRekening}\n HUBUNGI ${contactPerson == "" ? "-" : contactPerson} UNTUK LIST DAN BOLEH PAKE NAMA SAMARAN !!`
  }
  

  outputElement.innerText = result;
  if (resultCard) resultCard.style.display = 'block';
  outputElement.style.display = 'block';
  copyButton.style.display = 'inline-block';
}