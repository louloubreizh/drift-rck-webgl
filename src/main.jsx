import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const dossier = `${import.meta.env.BASE_URL}unity/`;
const build = `${dossier}Build/BuildageWEBGL`;

function Application() {
  const canevas = useRef(null);
  const zone = useRef(null);
  const [erreur, signaler] = useState('');
  const [etat, afficher] = useState({ progression: 0, pret: false, erreur: '' });

  useEffect(() => {
    let active = true;
    let instance;
    const lecteur = document.createElement('script');
    lecteur.src = `${build}.loader.js`;
    const echec = (message) => {
      if (active) afficher({ progression: 0, pret: false, erreur: String(message) });
    };
    lecteur.onerror = () => echec('Le lecteur Unity n’a pas pu être chargé.');
    lecteur.onload = async () => {
      try {
        instance = await window.createUnityInstance(canevas.current, {
          dataUrl: `${build}.data`,
          frameworkUrl: `${build}.framework.js`,
          codeUrl: `${build}.wasm`,
          streamingAssetsUrl: `${dossier}StreamingAssets`,
          companyName: 'DefaultCompany',
          productName: 'jeu_de_voiture',
          productVersion: '1.0',
          devicePixelRatio: Math.min(window.devicePixelRatio, 1.5),
        }, (progression) => {
          if (active) afficher({ progression, pret: false, erreur: '' });
        });
        if (active) afficher({ progression: 1, pret: true, erreur: '' });
        else await instance.Quit();
      } catch (raison) {
        echec(raison);
      }
    };
    document.body.appendChild(lecteur);
    return () => {
      active = false;
      lecteur.remove();
      if (instance) void instance.Quit().catch(() => {});
    };
  }, []);

  async function agrandir() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await zone.current.requestFullscreen();
      signaler('');
      canevas.current.focus();
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
      <div ref={zone} className="jeu">
        <canvas ref={canevas} tabIndex={0} aria-label="Drift RCK, jeu Unity WebGL"
          onPointerDown={() => canevas.current.focus()} />
        {!etat.pret && <div className="chargement" role="status">
          {etat.erreur ? <p>{etat.erreur}</p> : <>
            <span>Chargement du jeu</span>
            <progress max="1" value={etat.progression} aria-label="Chargement du jeu" />
          </>}
        </div>}
      </div>
      {erreur && <p role="status">{erreur}</p>}
      <footer>
        <p>Cliquez dans le jeu pour prendre le contrôle. Les paramètres du jeu ouvrent le garage, les commandes et le classement.</p>
        <a href={`${dossier}index.html`}>Ouvrir le jeu seul</a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('racine')).render(<Application />);
