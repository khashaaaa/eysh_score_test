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
    <div className="payment">
      <h2>Purchase Packages</h2>
      <ul>
        {packages.map(pkg => (
          <li key={pkg.id}>
            {pkg.name} - ${pkg.price}
            <button onClick={() => purchase(pkg.id)}>Purchase</button>
          </li>
        ))}
      </ul>
      {qrCode && <QRCode value={qrCode} size={500} />}
    </div>
  );
}

export default Payment;