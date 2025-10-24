import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Upload, Image, Tag, FileText, ArrowLeft, Check, User } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';

const SubmitContainer = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-bottom: 24px;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #f8f9fa;
  }
`;

const SubmitCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #495057;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #6c757d;
  margin-bottom: 40px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#667eea' : '#e9ecef'};
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragActive ? 'rgba(102, 126, 234, 0.05)' : 'transparent'};

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.hasFile ? '#28a745' : 'rgba(102, 126, 234, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.hasFile ? 'white' : '#667eea'};
`;

const DropzoneText = styled.div`
  color: #495057;
  font-weight: 500;
`;

const DropzoneSubtext = styled.div`
  color: #6c757d;
  font-size: 0.875rem;
`;

const PreviewImage = styled.div`
  margin-top: 20px;
  
  img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

function SubmitDesign() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    username: ''
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Bitte wähle ein Bild aus');
      return;
    }

    if (!formData.title || !formData.category_id || !formData.username) {
      toast.error('Bitte fülle alle Pflichtfelder aus');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category_id', formData.category_id);
      submitData.append('username', formData.username);
      submitData.append('image', file);

      await axios.post('/api/designs', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Design erfolgreich eingereicht!');
      navigate('/gallery');
    } catch (error) {
      toast.error('Fehler beim Einreichen des Designs');
    } finally {
      setLoading(false);
    }
  };

  if (categoriesLoading) {
    return (
      <LoadingSpinner>
        <div className="spinner"></div>
      </LoadingSpinner>
    );
  }

  return (
    <SubmitContainer>
      <BackButton onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        Zurück zur Startseite
      </BackButton>

      <SubmitCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>Design einreichen</Title>
        <Subtitle>Teile dein kreatives Design mit der Community</Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <User size={20} />
              Dein Name *
            </Label>
            <Input
              type="text"
              name="username"
              placeholder="Wie soll dein Name angezeigt werden?"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <FileText size={20} />
              Titel *
            </Label>
            <Input
              type="text"
              name="title"
              placeholder="Gib deinem Design einen aussagekräftigen Titel"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <Tag size={20} />
              Kategorie *
            </Label>
            <Select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Wähle eine Kategorie</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <FileText size={20} />
              Beschreibung
            </Label>
            <TextArea
              name="description"
              placeholder="Beschreibe dein Design, die Inspiration dahinter oder besondere Details..."
              value={formData.description}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <Image size={20} />
              Design-Bild *
            </Label>
            <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
              <input {...getInputProps()} />
              <DropzoneContent>
                <UploadIcon hasFile={!!file}>
                  {file ? <Check size={32} /> : <Upload size={32} />}
                </UploadIcon>
                <DropzoneText>
                  {file ? file.name : (isDragActive ? 'Bild hier ablegen' : 'Bild hochladen')}
                </DropzoneText>
                <DropzoneSubtext>
                  Ziehe ein Bild hierher oder klicke zum Auswählen
                </DropzoneSubtext>
                <DropzoneSubtext>
                  Unterstützte Formate: JPG, PNG, GIF, WebP (max. 10MB)
                </DropzoneSubtext>
              </DropzoneContent>
            </DropzoneContainer>
            
            {file && (
              <PreviewImage>
                <img src={URL.createObjectURL(file)} alt="Preview" />
              </PreviewImage>
            )}
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            <Upload size={20} />
            {loading ? 'Wird eingereicht...' : 'Design einreichen'}
          </SubmitButton>
        </Form>
      </SubmitCard>
    </SubmitContainer>
  );
}

export default SubmitDesign;
