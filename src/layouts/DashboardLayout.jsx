import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="dashboard-main">
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="p-3 p-md-4 flex-grow-1">
          <Container fluid className="px-0">
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
