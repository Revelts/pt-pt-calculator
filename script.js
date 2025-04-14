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
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }
  
  // Strip formatting to get plain number from formatted Rupiah
  function fromRupiahFormat(str) {
    return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
  }
  
  // Format while typing in hargaBotol
  document.addEventListener('DOMContentLoaded', () => {
    const hargaInput = document.getElementById('hargaBotol');
    hargaInput.addEventListener('input', () => {
      const cursorPos = hargaInput.selectionStart;
      const number = fromRupiahFormat(hargaInput.value);
      hargaInput.value = toRupiah(number);
      hargaInput.setSelectionRange(cursorPos, cursorPos); // maintain cursor
    });
  });
  
  function generate() {
    const hargaBotolFormatted = document.getElementById('hargaBotol').value;
    const hargaBotol = fromRupiahFormat(hargaBotolFormatted);
    const namaBotol = document.getElementById('namaBotol').value;
    const jumlahOrang = parseInt(document.getElementById('jumlahOrang').value);
    const pajak = parseFloat(document.getElementById('pajak').value);
    const namaVenue = document.getElementById('namaVenue').value;
  
    if (isNaN(hargaBotol) || isNaN(jumlahOrang) || isNaN(pajak) || !namaBotol || !namaVenue) {
      document.getElementById('output').innerText = "Please fill in all fields correctly.";
      return;
    }
  
    const tax = (hargaBotol * pajak) / 100;
    const totalPrice = hargaBotol + tax;
    const pricePerPax = totalPrice / jumlahOrang;
  
    let result = `Venue : ${namaVenue}\n`;
    result += `Bottle : ${namaBotol}\n`;
    result += `Price (after Tax ${pajak}%) : ${toRupiah(totalPrice)}\n`;
    result += `Price (per pax) : ${toRupiah(pricePerPax)}\n`;
  
    for (let i = 1; i <= jumlahOrang; i++) {
      result += `${i}.\n`;
    }
  
    document.getElementById('output').innerText = result;
    document.getElementById('copyBtn').style.display = 'inline-block';
  }
  