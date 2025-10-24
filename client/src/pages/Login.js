import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  text-decoration: none;
  margin-bottom: 24px;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #495057;
`;

const Subtitle = styled.p`
  color: #6c757d;
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 16px 16px 48px;
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

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

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

const Divider = styled.div`
  text-align: center;
  margin: 24px 0;
  position: relative;
  color: #6c757d;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e9ecef;
  }

  span {
    background: white;
    padding: 0 16px;
  }
`;

const RegisterLink = styled(Link)`
  text-align: center;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #5a6fd8;
  }
`;

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Erfolgreich eingeloggt!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BackButton to="/">
          <ArrowLeft size={20} />
          Zurück zur Startseite
        </BackButton>

        <Title>Willkommen zurück!</Title>
        <Subtitle>Melde dich an, um Designs einzureichen und abzustimmen</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <Mail size={20} />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="E-Mail Adresse"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <Input
              type="password"
              name="password"
              placeholder="Passwort"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            <LogIn size={20} />
            {loading ? 'Wird angemeldet...' : 'Anmelden'}
          </SubmitButton>
        </Form>

        <Divider>
          <span>oder</span>
        </Divider>

        <RegisterLink to="/register">
          Noch kein Konto? Jetzt registrieren
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
