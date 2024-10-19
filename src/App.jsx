import { useState } from 'react';
import './App.css';
import Swal from 'sweetalert2';

function Screen({ value, onChange }) {
  return (
    <input className="screen" type="text" value={value} onChange={onChange} />
  );
}

function KeyPad({ value, onClick }) {
  const buttonClass = value === 'C' || value === 'Del' ? 'specialKeypad' : 'keyPad';

  return (
    <button className={buttonClass} onClick={() => onClick(value)}>
      {value}
    </button>
  );
}

function FillForm({ onChange, selectedOption }) {
  return (
    <>
      <label htmlFor="dropdown">Pilih Status Pernikahan:</label>
      <select id="dropdown" value={selectedOption} onChange={onChange}className ="selectOption">
        <option value="lajang">Lajang</option>
        <option value="menikah">Menikah</option>
        <option value="menikah_anak">Menikah + 1 Anak</option>
        <option value="menikah_2anak">Menikah + 2 Anak</option>
        <option value="menikah_3anak">Menikah + 3 Anak</option>
      </select>
    </>
  );
}

function App() {
  const [nilai, setNilai] = useState('0');
  const [selectedOption, setSelectedOption] = useState('bujangan');

  function formatNumber(num) {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function onClick(value) {
    if (value !== 'C' && value !== 'Del') {
      setNilai(prev => {
        const nextValue = prev === '0' ? value : prev + value;
        return nextValue.length <= 12 ? nextValue : prev;
      });
    } else if (value === 'C') {
      setNilai('0');
    } else if (value === 'Del') {
      setNilai(prev => (prev.length > 1 ? prev.slice(0,-1) : '0'));
    }
  }

  function handleInputChange(event) {
    const inputValue = event.target.value.replace(/\./g, '');
    if (/^\d*$/.test(inputValue) && nilai.length <= 11) {
      setNilai(inputValue);
    }
  }

  function handleDropdownChange(event) {
    setSelectedOption(event.target.value);
  }

  function CalculateTax() {
    const penghasilan = parseFloat(nilai.replace(/\./g, ''));
    let PTKP = selectedOption === 'menikah' ? 58500000 : 
               selectedOption === 'menikah_anak' ? 63000000 :
               selectedOption === 'menikah_2anak' ? 67500000 : 
               selectedOption === 'menikah_3anak' ? 72000000 :
               54000000;

    const PKP = penghasilan * 12 - PTKP; // Menghitung Penghasilan Kena Pajak
    let pajakProgresif = 0;
  
    // Fungsi pembantu untuk menghitung pajak sesuai dengan batas dan tarif
    function hitungPajak(sisaPKP, batas, tarif) {
      const dikenakanPajak = sisaPKP > batas ? batas : sisaPKP;
      pajakProgresif += dikenakanPajak * tarif;
      return sisaPKP - dikenakanPajak;
    }
  
    // Mulai menghitung pajak dengan menggunakan fungsi pembantu dan menjaga urutan pengecekan
    if (PKP > 0) {
      let pajakDummy = PKP;
  
      pajakDummy = hitungPajak(pajakDummy, 60000000, 0.05); // Pajak 5% untuk PKP <= 60 juta
      pajakDummy = hitungPajak(pajakDummy, 190000000, 0.15); // Pajak 15% untuk PKP <= 190 juta
      pajakDummy = hitungPajak(pajakDummy, 250000000, 0.25); // Pajak 25% untuk PKP <= 250 juta
      pajakDummy = hitungPajak(pajakDummy, 4500000000, 0.30); // Pajak 30% untuk PKP <= 4.5 Miliar
  
      // Jika masih ada sisa PKP, hitung pajak 35%
      if (pajakDummy > 0) {
        pajakProgresif += pajakDummy * 0.35;
      }
  
      // Tampilkan hasil pajak dengan Swal
      Swal.fire({
        title: 'Hasil Perhitungan Pajak',
        text: `Pajak yang harus dibayar: Rp ${formatNumber(pajakProgresif.toFixed(0))}`,
        icon: 'info',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: 'Pemberitahuan',
        text: 'Penghasilan tidak kena pajak (PKP <= 0)',
        confirmButtonText: 'OK'
      });
    }
  }

  return (
    <>
      <div className="Page">
        <div className="fillForm">
          <FillForm selectedOption={selectedOption} onChange={handleDropdownChange} />
        </div>

        <div className="calculator">
          <Screen value={formatNumber(nilai)} onChange={handleInputChange} />
          <KeyPad value={'1'} onClick={onClick} />
          <KeyPad value={'2'} onClick={onClick} />
          <KeyPad value={'3'} onClick={onClick} />
          <KeyPad value={'4'} onClick={onClick} />
          <KeyPad value={'5'} onClick={onClick} />
          <KeyPad value={'6'} onClick={onClick} />
          <KeyPad value={'7'} onClick={onClick} />
          <KeyPad value={'8'} onClick={onClick} />
          <KeyPad value={'9'} onClick={onClick} />
          <KeyPad value={'C'} onClick={onClick} />
          <KeyPad value={'0'} onClick={onClick} />
          <KeyPad value={'Del'} onClick={onClick} />
          <button className="btn" onClick={CalculateTax}>Hitung</button>
        </div>
      </div>
    </>
  );
}

export default App;
