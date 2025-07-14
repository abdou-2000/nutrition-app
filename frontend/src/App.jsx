import { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Réponse du backend :', data.message); // Log côté navigateur
        setMsg(data.message);
      })
      .catch(err => {
        console.error('❌ Erreur de connexion au backend :', err);
      });
  }, []);

  return (
    <div className="p-6 text-center text-xl">
      <h1 className="font-bold text-2xl text-green-700 mb-4">Suivi nutritionnel</h1>
      <p>{msg}</p>
    </div>
  );
}

export default App;
