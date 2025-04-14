//src/components/dashboard/CallNotesChart.jsx
import axios from 'axios';
import { useState, useEffect } from 'react';
import { create } from 'zustand';
import CallNotesBarChart from './CallNotesBarChart';

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
  }, [setAllNotes]);

  useEffect(() => {
    if (allNotes.length > 0) {
      const contactKeys = new Set(Object.keys(contacts));
      const filtered = allNotes.filter(
        (note) => note.business && contactKeys.has(note.business._id)
      );
      setFilteredNotes(filtered);
    }
  }, [allNotes, contacts]);

  return (
    <div>
      <CallNotesBarChart filteredNotes={filteredNotes} />
    </div>
  );
};

export default CallNotesChart;
