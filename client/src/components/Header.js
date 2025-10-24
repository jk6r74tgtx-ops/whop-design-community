import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Upload, Image, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  padding: 0 20px;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 800;
  color: #667eea;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const NavLink = styled(Link)`
  color: #495057;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #495057;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(220, 53, 69, 0.1);
  }
`;

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <Nav>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo to="/">
            <Image size={28} />
            Design Community
          </Logo>
        </motion.div>

        <NavLinks>
          <NavLink to="/">
            <Image size={18} />
            Gallery
          </NavLink>
          
          <NavLink to="/submit">
            <Upload size={18} />
            Submit Design
          </NavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;
