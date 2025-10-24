import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Components
import Header from './components/Header';
import Home from './pages/Home';
import SubmitDesign from './pages/SubmitDesign';
import Gallery from './pages/Gallery';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/submit" element={<SubmitDesign />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  );
}

function App() {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AppRoutes />
        </motion.div>
      </MainContent>
    </AppContainer>
  );
}

export default App;
