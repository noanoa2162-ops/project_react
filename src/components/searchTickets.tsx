import { useState } from "react";
import type { Ticket } from "../models";

interface SearchTicketsProps {
  tickets: Ticket[];
  onSearch: (filtered: Ticket[]) => void;
}

const SearchTickets: React.FC<SearchTicketsProps> = ({ tickets, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      onSearch(tickets);
    } else {
      const filtered = tickets.filter((ticket: Ticket) =>
        ticket.subject.toLowerCase().includes(query.toLowerCase()) ||
        ticket.description.toLowerCase().includes(query.toLowerCase())
      );
      onSearch(filtered);
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
      <h2>🔍 חיפוש כרטיסים</h2>
      <input
        type="text"
        placeholder="חפש לפי נושא או תיאור..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #bdc3c7',
          marginBottom: '10px',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
};

export default SearchTickets;
