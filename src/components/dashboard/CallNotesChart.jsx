import axios from 'axios';
import { useState, useEffect } from 'react';
import { create } from 'zustand';

// Zustand store para manejar el estado global
const useNotesStore = create((set) => ({
  allNotes: [],
  setAllNotes: (notes) => set({ allNotes: notes }),
}));

const CallNotesChart = ({ contacts }) => {
  const { allNotes, setAllNotes } = useNotesStore();
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          'https://api.nevtis.com/dialtools/call-notes/all'
        );
        setAllNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    if (allNotes.length > 0) {
      const contactKeys = new Set(Object.keys(contacts));
      const filtered = allNotes.filter(
        (note) => note.business && contactKeys.has(note.business._id)
      );
      setFilteredNotes(filtered);
    }
  }, [allNotes, contacts]);

  console.log(filteredNotes);

  return (
    <div>
      <h2>Call Notes Chart</h2>
      {filteredNotes.length > 0 ? (
        <ul>
          {filteredNotes.map((note) => (
            <li key={note._id}>Note ID: {note._id}</li>
          ))}
        </ul>
      ) : (
        <p>No matching notes found.</p>
      )}
    </div>
  );
};

export default CallNotesChart;
