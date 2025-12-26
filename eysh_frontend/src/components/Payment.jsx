import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import QRCode from 'qrcode.react';

function Payment() {
  const [packages, setPackages] = useState([]);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get('/payment/packages');
        setPackages(res.data);
      } catch (error) {
        alert('Error fetching packages');
      }
    };
    fetchPackages();
  }, []);

  const purchase = async (packageId) => {
    try {
      const res = await axios.post(`/payment/purchase/${packageId}`, {});
      setQrCode(res.data.qrCode);
    } catch (error) {
      alert('Error purchasing');
    }
  };

  return (
    <div className="payment" style={{ fontFamily: 'Times New Roman, serif', backgroundColor: '#ffffff', color: '#333333', padding: '20px', border: '1px solid #cccccc', maxWidth: '900px', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '20px', textDecoration: 'underline' }}>Purchase Packages</h2>
      <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
        {packages.map(pkg => (
          <li key={pkg.id} style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #dddddd', borderRadius: '4px' }}>
            {pkg.name} - ${pkg.price}
            <button onClick={() => purchase(pkg.id)} style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Purchase</button>
          </li>
        ))}
      </ul>
      {qrCode && <div style={{ textAlign: 'center', marginTop: '20px' }}><QRCode value={qrCode} size={500} /></div>}
    </div>
  );
}

export default Payment;