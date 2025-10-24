import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Tag,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #6c757d;
  font-weight: 500;
`;

const TabsContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e9ecef;
`;

const Tab = styled.button`
  flex: 1;
  padding: 20px;
  background: ${props => props.active ? 'white' : '#f8f9fa'};
  border: none;
  font-weight: 600;
  color: ${props => props.active ? '#667eea' : '#6c757d'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${props => props.active ? 'white' : '#e9ecef'};
  }
`;

const TabContent = styled.div`
  padding: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #495057;
`;

const Form = styled.form`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return 'background: #667eea; color: white;';
      case 'success':
        return 'background: #28a745; color: white;';
      case 'danger':
        return 'background: #dc3545; color: white;';
      case 'secondary':
        return 'background: #6c757d; color: white;';
      default:
        return 'background: #f8f9fa; color: #495057; border: 1px solid #dee2e6;';
    }
  }}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
`;

const TableHeader = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
`;

const TableCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('designs');
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDesigns: 0,
    pendingDesigns: 0,
    approvedDesigns: 0,
    totalVotes: 0
  });
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [designsRes, categoriesRes] = await Promise.all([
        axios.get('/api/designs'),
        axios.get('/api/categories')
      ]);

      setDesigns(designsRes.data);
      setCategories(categoriesRes.data);

      // Calculate stats
      const totalDesigns = designsRes.data.length;
      const pendingDesigns = designsRes.data.filter(d => d.status === 'pending').length;
      const approvedDesigns = designsRes.data.filter(d => d.status === 'approved').length;
      const totalVotes = designsRes.data.reduce((sum, d) => sum + d.votes_count, 0);

      setStats({
        totalDesigns,
        pendingDesigns,
        approvedDesigns,
        totalVotes
      });
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (designId, newStatus) => {
    try {
      await axios.put(`/api/designs/${designId}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await axios.post('/api/categories', { name: newCategory });
      toast.success('Category added successfully');
      setNewCategory('');
      fetchData();
    } catch (error) {
      toast.error('Failed to add category');
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
    <AdminContainer>
      <Header>
        <Title>Admin Panel</Title>
        <Subtitle>Verwalte Designs, Kategorien und Community</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatNumber>{stats.totalDesigns}</StatNumber>
          <StatLabel>Gesamt Designs</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatNumber>{stats.pendingDesigns}</StatNumber>
          <StatLabel>Ausstehend</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <StatNumber>{stats.approvedDesigns}</StatNumber>
          <StatLabel>Genehmigt</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StatNumber>{stats.totalVotes}</StatNumber>
          <StatLabel>Gesamt Stimmen</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabsContainer>
        <TabsHeader>
          <Tab 
            active={activeTab === 'designs'} 
            onClick={() => setActiveTab('designs')}
          >
            <Eye size={18} />
            Designs
          </Tab>
          <Tab 
            active={activeTab === 'categories'} 
            onClick={() => setActiveTab('categories')}
          >
            <Tag size={18} />
            Kategorien
          </Tab>
        </TabsHeader>

        <TabContent>
          {activeTab === 'designs' && (
            <>
              <SectionTitle>Design Management</SectionTitle>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Titel</TableHeader>
                    <TableHeader>Kategorie</TableHeader>
                    <TableHeader>Benutzer</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Stimmen</TableHeader>
                    <TableHeader>Datum</TableHeader>
                    <TableHeader>Aktionen</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {designs.map(design => (
                    <TableRow key={design.id}>
                      <TableCell>{design.title}</TableCell>
                      <TableCell>{design.category_name}</TableCell>
                      <TableCell>{design.username}</TableCell>
                      <TableCell>
                        <StatusBadge status={design.status}>
                          {design.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{design.votes_count}</TableCell>
                      <TableCell>
                        {new Date(design.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <ActionButtons>
                          {design.status === 'pending' && (
                            <>
                              <Button 
                                variant="success" 
                                onClick={() => handleStatusChange(design.id, 'approved')}
                              >
                                <Check size={16} />
                                Genehmigen
                              </Button>
                              <Button 
                                variant="danger" 
                                onClick={() => handleStatusChange(design.id, 'rejected')}
                              >
                                <X size={16} />
                                Ablehnen
                              </Button>
                            </>
                          )}
                          {design.status === 'approved' && (
                            <Button 
                              variant="primary" 
                              onClick={() => handleStatusChange(design.id, 'selected')}
                            >
                              <TrendingUp size={16} />
                              Zur Produktion
                            </Button>
                          )}
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {activeTab === 'categories' && (
            <>
              <SectionTitle>Kategorie Management</SectionTitle>
              <Form onSubmit={handleAddCategory}>
                <Input
                  type="text"
                  placeholder="Neue Kategorie hinzufügen..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button type="submit" variant="primary">
                  <Plus size={16} />
                  Hinzufügen
                </Button>
              </Form>

              <Table>
                <thead>
                  <tr>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Beschreibung</TableHeader>
                    <TableHeader>Erstellt</TableHeader>
                    <TableHeader>Aktionen</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description || '-'}</TableCell>
                      <TableCell>
                        {new Date(category.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <ActionButtons>
                          <Button variant="secondary">
                            <Edit size={16} />
                            Bearbeiten
                          </Button>
                          <Button variant="danger">
                            <Trash2 size={16} />
                            Löschen
                          </Button>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </TabContent>
      </TabsContainer>
    </AdminContainer>
  );
}

export default AdminPanel;
