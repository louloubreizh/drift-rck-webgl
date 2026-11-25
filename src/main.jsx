import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const lecteur = `${import.meta.env.BASE_URL}${import.meta.env.VITE_UNITY_PLAYER || 'unity'}/index.html`;

function Application() {
  const cadre = useRef(null);
  const [erreur, signaler] = useState('');

  function adapterLecteur() {
    const documentUnity = cadre.current.contentDocument;
    const styles = documentUnity.createElement('style');
    styles.textContent = `
      html, body, #unity-container {
        margin: 0; width: 100%; height: 100%; overflow: hidden;
      }
      #unity-container { position: absolute; inset: 0; transform: none; }
      #unity-canvas { display: block; width: 100% !important; height: 100% !important; touch-action: none; }
      #unity-footer { display: none; }
    `;
    documentUnity.head.appendChild(styles);
  }

  async function agrandir() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await cadre.current.requestFullscreen();
      signaler('');
      cadre.current.focus();
    } catch {
      signaler('Plein écran indisponible sur cet appareil.');
    }
  }

  return (
    <main>
      <header>
        <h1>Drift <span>RCK</span></h1>
        <button type="button" onClick={agrandir}>Plein écran</button>
      </header>
      <div className="jeu">
        <iframe ref={cadre} src={lecteur} title="Drift RCK, jeu Unity WebGL"
          onLoad={adapterLecteur} allow="autoplay; fullscreen; gamepad" allowFullScreen />
      </div>
      {erreur && <p role="status">{erreur}</p>}
      <footer>
        <p>Cliquez dans le jeu pour prendre le contrôle. L’engrenage ouvre le garage, les commandes et le classement.</p>
        <a href={lecteur}>Ouvrir le jeu seul</a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('racine')).render(<Application />);
