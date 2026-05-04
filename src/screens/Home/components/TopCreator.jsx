import React, { useMemo } from "react";

const DEFAULT_PROFILE = "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772147595/1751816044094_fvqghc.png";

export default function TopCreator({ creators = [], setView, setSelectedUser, neonColor = "#00fff2" }) {
  
  // ✅ LOGIQUE DE CLASSEMENT "ELITE"
  const rankedCreators = useMemo(() => {
    return [...creators]
      .sort((a, b) => {
        // Score basé sur Inks (poids lourd) + Activité
        const scoreA = (a.inks || 0) * 2 + (a.contributions || 0) * 10;
        const scoreB = (b.inks || 0) * 2 + (b.contributions || 0) * 10;
        return scoreB - scoreA;
      })
      .slice(0, 8);
  }, [creators]);

  return (
    <div className="top-creators-section">
      <div className="section-header-pro">
        <div className="title-block">
          <h3 style={{ color: neonColor }}>🏆 L'ÉLITE DU STUDIO</h3>
          <p className="period-label">Période : Avril 2026</p>
        </div>
        <button className="view-all-btn" onClick={() => setView("leaderboard")}>CLASSEMENT</button>
      </div>

      <div className="creators-horizontal-scroll">
        {rankedCreators.map((user, index) => (
          <div 
            key={user.id} 
            className={`creator-node ${index === 0 ? 'rank-first' : ''}`}
            onClick={() => { setSelectedUser(user); setView("profile"); }}
          >
            {/* AVATAR AVEC BADGE DE RANG */}
            <div className="avatar-wrapper">
              <div className="rank-number">#{index + 1}</div>
              <img 
                src={user.photoURL || DEFAULT_PROFILE} 
                alt={user.username} 
                onError={(e) => e.target.src = DEFAULT_PROFILE}
              />
              {/* Animation Néon pour le Top 1 */}
              {index === 0 && <div className="crown-icon">👑</div>}
            </div>

            {/* INFOS DE CONTRIBUTION */}
            <div className="creator-meta">
              <span className="username">{user.username}</span>
              <div className="inks-count">
                <span className="ink-icon">🖋️</span> {user.inks?.toLocaleString() || 0}
              </div>
              <div className="activity-tag">
                {user.lastAchievement || "Actif récemment"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .top-creators-section { margin: 35px 0; padding: 0 10px; }
        
        .section-header-pro { 
          display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; 
        }
        .title-block h3 { margin: 0; font-size: 16px; font-weight: 900; letter-spacing: 1px; }
        .period-label { margin: 0; font-size: 9px; color: #666; text-transform: uppercase; font-weight: bold; }
        .view-all-btn { background: #111; border: 1px solid #222; color: #fff; font-size: 9px; padding: 4px 10px; border-radius: 4px; }

        .creators-horizontal-scroll { 
          display: flex; gap: 20px; overflow-x: auto; padding: 10px 5px; scrollbar-width: none;
        }
        .creators-horizontal-scroll::-webkit-scrollbar { display: none; }

        .creator-node { 
          display: flex; flex-direction: column; align-items: center; min-width: 85px; cursor: pointer; transition: 0.3s;
        }

        .avatar-wrapper { 
          position: relative; width: 70px; height: 70px; margin-bottom: 10px;
        }
        .avatar-wrapper img { 
          width: 100%; height: 100%; border-radius: 50%; object-fit: cover; 
          border: 2px solid #1a1a1a; transition: 0.3s;
        }
        
        .rank-number {
          position: absolute; top: -5px; left: -5px; background: #000; color: #fff;
          font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 6px;
          border: 1px solid #333; z-index: 2;
        }

        .rank-first img { border-color: gold !important; box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
        .crown-icon { position: absolute; top: -15px; right: -5px; font-size: 16px; }

        .creator-meta { text-align: center; width: 100%; }
        .username { color: #fff; font-size: 11px; font-weight: bold; display: block; margin-bottom: 3px; }
        .inks-count { font-size: 10px; color: #00fff2; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 3px; }
        .activity-tag { font-size: 7px; color: #555; text-transform: uppercase; margin-top: 4px; font-weight: bold; }
      `}</style>
    </div>
  );
}
