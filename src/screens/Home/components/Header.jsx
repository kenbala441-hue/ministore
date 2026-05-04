import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

export default function Header({ toggleBurger, setView, notifCount = 0 }) {
  return (
    <header className="app-header-clean">
      <div className="header-content">
        {/* Côté Gauche : Menu et Nom de l'app */}
        <div className="brand-section">
          <button className="btn-icon" onClick={toggleBurger}>
            <Menu size={22} color="#00fff2" strokeWidth={1.5} />
          </button>
          <h1 className="main-title">
            COMIC<span className="accent">CRAFTE</span>
          </h1>
        </div>

        {/* Côté Droit : Recherche et Notifications */}
        <div className="actions-section">
          <button className="btn-icon" onClick={() => setView('search')}>
            <Search size={20} color="#fff" strokeWidth={1.5} />
          </button>
          
          <button className="btn-icon relative" onClick={() => setView('notifications')}>
            <Bell size={20} color="#fff" strokeWidth={1.5} />
            {notifCount > 0 && <span className="notification-ping"></span>}
          </button>
        </div>
      </div>

      <style>{`
        .app-header-clean {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-bottom: 0.5px solid rgba(0, 255, 242, 0.2);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          height: 56px; /* Taille standard mobile très propre */
        }

        .brand-section, .actions-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .main-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 1px;
          margin: 0;
        }
        
        .accent {
          color: #00fff2;
          font-weight: 300;
        }

        .btn-icon {
          background: transparent;
          border: none;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 50%;
          transition: background 0.3s;
        }

        .btn-icon:active {
          background: rgba(0, 255, 242, 0.1);
        }

        .relative { position: relative; }

        .notification-ping {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: #00fff2;
          border-radius: 50%;
          box-shadow: 0 0 10px #00fff2;
        }
      `}</style>
    </header>
  );
}
