import React from 'react';

const ErrorPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>サーバーに接続されていません</h1>
      <p>サーバーがダウンしているか、ネットワークに問題があるようです。</p>
      <p>しばらくしてからもう一度接続をお試しくください。</p>
    </div>
  );
};

export default ErrorPage;
