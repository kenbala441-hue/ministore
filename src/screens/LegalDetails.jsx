import React from 'react';

export default function LegalDetails({ setView }) {
  return (
    <div style={s.container}>
      <div style={s.header}>
        <button onClick={() => setView('terms')} style={s.back}>← RETOUR</button>
        <h2 style={s.title}>ARCHIVES LÉGALES INTÉGRALES</h2>
      </div>

      <div style={s.scrollArea}>
        {/* --- SECTION 1: CONFIDENTIALITÉ --- */}
        <section style={s.section}>
          <h3 style={s.secTitle}>Ⅰ. POLITIQUE DE CONFIDENTIALITÉ (RGPD & INTERNATIONALE)</h3>
          <p style={s.text}>
            ComicCraft applique le principe de **collecte minimale**. Nous ne stockons que les données vitales : 
            email, identifiant de sécurité et logs de transaction. Vos données sont cryptées en AES-256. 
            Conformément aux lois internationales, vous disposez d'un droit de suppression totale de vos données 
            via une demande au support.
          </p>
        </section>

        {/* --- SECTION 2: COOKIES --- */}
        <section style={s.section}>
          <h3 style={s.secTitle}>Ⅱ. GESTION DES COOKIES ET TRACKERS</h3>
          <p style={s.text}>
            Nous utilisons des "Nanos-Cookies" pour :
            <br/>• **Session :** Garder votre accès ouvert au Multivers.
            <br/>• **Sécurité :** Détecter les tentatives de connexion suspectes.
            <br/>• **Préférences :** Retenir votre thème (Dark/Neon) et vos lectures.
            <br/>Aucun cookie tiers n'est vendu à des fins publicitaires externes.
          </p>
        </section>

        {/* --- SECTION 3: MODÉRATION & CONTENU --- */}
        <section style={s.section}>
          <h3 style={s.secTitle}>Ⅲ. ÉTHIQUE ET RÈGLES DE PUBLICATION</h3>
          <p style={s.text}>
            **ComicCraft est un espace d'imagination débordante.** Cependant :
            <br/>• **Images Interdites :** La nudité explicite, le contenu pornographique ou la violence gratuite sont strictement interdits dans le flux "Grand Public".
            <br/>• **Espaces Adultes :** Les œuvres matures doivent être obligatoirement taguées [18+]. Ces espaces sont modérés rigoureusement pour garantir la sécurité.
            <br/>• **Responsabilité :** Vous êtes le SEUL responsable de vos publications. ComicCraft fournit l'outil, vous fournissez l'esprit. Tout abus entraînera un signalement aux autorités compétentes.
          </p>
        </section>

        {/* --- SECTION 4: LES 20+ RÈGLES DE SÉCURITÉ --- */}
        <section style={s.section}>
          <h3 style={s.secTitle}>Ⅳ. PROTOCOLES DE SÉCURITÉ ADDITIONNELS</h3>
          <ul style={s.list}>
            <li>1. Amende de 1 000 USD pour tout vol de données ou leak.</li>
            <li>2. Bannissement immédiat pour tentative de Jailbreak Premium.</li>
            <li>3. Interdiction d'usurpation d'identité d'un autre auteur.</li>
            <li>4. Les gains (10%-45%) sont sujets à une vérification anti-fraude.</li>
            <li>5. Maintenance : L'app peut être hors-ligne pour sécurisation.</li>
            <li>6. Respect strict des agents : toute insulte est éliminatoire.</li>
            <li>7. Pas de spam ou de manipulation d'algorithme par robots.</li>
            <li>8. Le Studio ne peut être tenu responsable des pertes liées au réseau.</li>
          </ul>
        </section>

        <div style={s.disclaimer}>
          EN UTILISANT CETTE INTERFACE, VOUS RECONNAISSEZ QUE COMICCRAFT EST UN OUTIL D'APPRENTISSAGE ET DE LIBERATION CRÉATIVE, ET VOUS ACCEPTEZ LES RISQUES LIÉS À SON UTILISATION.
        </div>
      </div>
    </div>
  );
}

const s = {
  container: { backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '2px solid #a855f7', paddingBottom: '15px' },
  back: { background: '#111', border: '1px solid #333', color: '#a855f7', padding: '5px 15px', borderRadius: '5px', fontSize: '10px' },
  title: { fontSize: '14px', letterSpacing: '2px', color: '#00f5d4' },
  scrollArea: { marginTop: '20px', paddingBottom: '50px' },
  section: { marginBottom: '30px', backgroundColor: '#050505', padding: '20px', borderRadius: '10px', border: '1px solid #111' },
  secTitle: { color: '#a855f7', fontSize: '13px', marginBottom: '15px', fontWeight: 'bold', borderBottom: '1px solid #222', paddingBottom: '5px' },
  text: { fontSize: '12px', color: '#ccc', lineHeight: '1.7', textAlign: 'justify' },
  list: { fontSize: '12px', color: '#ccc', paddingLeft: '15px', lineHeight: '2' },
  disclaimer: { marginTop: '20px', padding: '15px', border: '1px dashed #ff0055', color: '#ff0055', fontSize: '10px', textAlign: 'center', opacity: 0.8 }
};
