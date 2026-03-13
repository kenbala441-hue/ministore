import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  return (
    <div style={st.page}>
      <div style={st.searchBar}>
        <SearchIcon size={20} color="#888" />
        <input type="text" placeholder="Rechercher une discussion..." style={st.input} />
      </div>
    </div>
  );
}

const st = {
  page: { padding: '20px' },
  searchBar: { display: 'flex', alignItems: 'center', background: '#111', padding: '10px', borderRadius: '10px', border: '1px solid #222' },
  input: { background: 'none', border: 'none', color: '#fff', marginLeft: '10px', outline: 'none', width: '100%' }
};
