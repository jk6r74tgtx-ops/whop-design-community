import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Calendar, User, Tag, Filter, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const GalleryContainer = styled.div`
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
`;

const FiltersContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  min-width: 250px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const DesignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const DesignCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  }
`;

const DesignImage = styled.div`
  width: 100%;
  height: 250px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DesignContent = styled.div`
  padding: 24px;
`;

const DesignTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #495057;
`;

const DesignDescription = styled.p`
  color: #6c757d;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const DesignMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  color: #6c757d;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const VoteButton = styled.button`
  background: ${props => props.voted ? '#dc3545' : '#667eea'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: ${props => props.voted ? '#c82333' : '#5a6fd8'};
    transform: translateY(-2px);
  }
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 12px;
  
  ${props => {
    switch (props.status) {
      case 'approved':
        return 'background: #d4edda; color: #155724;';
      case 'pending':
        return 'background: #fff3cd; color: #856404;';
      case 'rejected':
        return 'background: #f8d7da; color: #721c24;';
      case 'selected':
        return 'background: #cce5ff; color: #004085;';
      default:
        return 'background: #e9ecef; color: #495057;';
    }
  }}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: white;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  opacity: 0.8;
`;

function Gallery() {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchDesigns();
  }, []);

  useEffect(() => {
    fetchDesigns();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchDesigns = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      
      const response = await axios.get(`/api/designs?${params}`);
      let filteredDesigns = response.data;
      
      if (filters.search) {
        filteredDesigns = filteredDesigns.filter(design =>
          design.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          design.description?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setDesigns(filteredDesigns);
    } catch (error) {
      toast.error('Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (designId) => {
    try {
      // Simple voting without authentication - just increment vote count
      await axios.post(`/api/designs/${designId}/vote`);
      toast.success('Vote recorded!');
      fetchDesigns(); // Refresh to update vote counts
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <LoadingSpinner>
        <div className="spinner"></div>
      </LoadingSpinner>
    );
  }

  return (
    <GalleryContainer>
      <Header>
        <Title>Design Gallery</Title>
        <Subtitle>Entdecke die kreativen Designs unserer Community</Subtitle>
      </Header>

      <FiltersContainer>
        <FiltersRow>
          <FilterGroup>
            <FilterLabel>
              <Search size={18} />
              Suche
            </FilterLabel>
            <SearchInput
              type="text"
              placeholder="Nach Titel oder Beschreibung suchen..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <Tag size={18} />
              Kategorie
            </FilterLabel>
            <FilterSelect
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Alle Kategorien</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <Filter size={18} />
              Status
            </FilterLabel>
            <FilterSelect
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Alle Status</option>
              <option value="pending">Ausstehend</option>
              <option value="approved">Genehmigt</option>
              <option value="rejected">Abgelehnt</option>
              <option value="selected">Ausgewählt</option>
            </FilterSelect>
          </FilterGroup>
        </FiltersRow>
      </FiltersContainer>

      {designs.length === 0 ? (
        <EmptyState>
          <EmptyTitle>Keine Designs gefunden</EmptyTitle>
          <EmptyText>
            {filters.search || filters.category || filters.status
              ? 'Versuche andere Filter oder suche nach anderen Begriffen'
              : 'Noch keine Designs eingereicht. Sei der Erste!'
            }
          </EmptyText>
        </EmptyState>
      ) : (
        <DesignsGrid>
          {designs.map((design, index) => (
            <DesignCard
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <DesignImage>
                <img src={design.image_url} alt={design.title} />
              </DesignImage>
              <DesignContent>
                <StatusBadge status={design.status}>
                  {design.status}
                </StatusBadge>
                <DesignTitle>{design.title}</DesignTitle>
                {design.description && (
                  <DesignDescription>{design.description}</DesignDescription>
                )}
                <DesignMeta>
                  <MetaItem>
                    <User size={16} />
                    {design.username}
                  </MetaItem>
                  <MetaItem>
                    <Tag size={16} />
                    {design.category_name}
                  </MetaItem>
                  <MetaItem>
                    <Calendar size={16} />
                    {new Date(design.created_at).toLocaleDateString()}
                  </MetaItem>
                </DesignMeta>
                <VoteButton onClick={() => handleVote(design.id)}>
                  <Heart size={16} />
                  {design.votes_count} Stimmen
                </VoteButton>
              </DesignContent>
            </DesignCard>
          ))}
        </DesignsGrid>
      )}
    </GalleryContainer>
  );
}

export default Gallery;
