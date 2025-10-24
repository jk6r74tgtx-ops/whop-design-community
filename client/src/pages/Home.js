import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Eye, Calendar, User, Tag } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const HomeContainer = styled.div`
  padding: 40px 20px;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 60px;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const FeaturedDesigns = styled.section`
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #495057;
  text-align: center;
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
  height: 200px;
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
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.voted ? '#c82333' : '#5a6fd8'};
    transform: translateY(-2px);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

function Home() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDesigns: 0,
    totalVotes: 0,
    totalUsers: 0,
    selectedDesigns: 0
  });

  useEffect(() => {
    fetchDesigns();
    fetchStats();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await axios.get('/api/designs?status=approved&limit=6');
      setDesigns(response.data);
    } catch (error) {
      toast.error('Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [designsRes, votesRes] = await Promise.all([
        axios.get('/api/designs'),
        axios.get('/api/designs/top')
      ]);
      
      setStats({
        totalDesigns: designsRes.data.length,
        totalVotes: designsRes.data.reduce((sum, design) => sum + design.votes_count, 0),
        totalUsers: new Set(designsRes.data.map(d => d.user_id)).size,
        selectedDesigns: votesRes.data.length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleVote = async (designId) => {
    try {
      // Simple voting without authentication - just increment vote count
      const response = await axios.post(`/api/designs/${designId}/vote`);
      toast.success('Vote recorded!');
      fetchDesigns(); // Refresh to update vote counts
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  if (loading) {
    return (
      <LoadingSpinner>
        <div className="spinner"></div>
      </LoadingSpinner>
    );
  }

  return (
    <HomeContainer>
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>Design Community</HeroTitle>
          <HeroSubtitle>
            Teile deine kreativen Designs, stimme für die besten ab und sieh zu, wie sie produziert werden!
          </HeroSubtitle>
        </motion.div>
      </HeroSection>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatNumber>{stats.totalDesigns}</StatNumber>
          <StatLabel>Designs eingereicht</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatNumber>{stats.totalVotes}</StatNumber>
          <StatLabel>Stimmen abgegeben</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <StatNumber>{stats.totalUsers}</StatNumber>
          <StatLabel>Aktive Designer</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StatNumber>{stats.selectedDesigns}</StatNumber>
          <StatLabel>Ausgewählte Designs</StatLabel>
        </StatCard>
      </StatsGrid>

      <FeaturedDesigns>
        <SectionTitle>Beliebte Designs</SectionTitle>
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
                <DesignTitle>{design.title}</DesignTitle>
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
      </FeaturedDesigns>
    </HomeContainer>
  );
}

export default Home;
