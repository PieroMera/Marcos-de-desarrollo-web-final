import React, { useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Collapse } from 'bootstrap';
import { useAuth } from '../context/AuthContext';
import { ROLES_GESTION_PRODUCTOS } from '../constants/roles';

const links = [
  { to: '/', label: 'Dashboard', icon: 'bi-speedometer2', end: true },
  { to: '/productos', label: 'Productos', icon: 'bi-tags', roles: ROLES_GESTION_PRODUCTOS },
  { to: '/movimientos', label: 'Movimientos', icon: 'bi-arrow-left-right' },
  { to: '/stock', label: 'Stock', icon: 'bi-database-check' },
  { to: '/alertas', label: 'Alertas', icon: 'bi-exclamation-triangle' },
  { to: '/perfil', label: 'Mi Perfil', icon: 'bi-person-circle' },
];

function DashboardLayout() {
  const sidebarRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const linksVisibles = links.filter((link) => !link.roles || link.roles.includes(user?.rol));

  const closeMobileMenu = () => {
    const sidebarEl = sidebarRef.current;
    if (sidebarEl && sidebarEl.classList.contains('show')) {
      Collapse.getOrCreateInstance(sidebarEl).hide();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow d-md-none">
        <span className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6">Inv Pro</span>
        <button
          className="navbar-toggler position-absolute d-md-none collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </header>

      <div className="container-fluid">
        <div className="row">
          <nav
            id="sidebarMenu"
            ref={sidebarRef}
            className="col-md-3 col-lg-2 d-md-block sidebar collapse p-3"
          >
            <div className="d-flex align-items-center mb-4 px-3">
              <i className="bi bi-box-seam fs-3 me-2 text-danger"></i>
              <span className="fs-4 fw-bold">Inv Pro</span>
            </div>
            <ul className="nav nav-pills flex-column mb-auto">
              {linksVisibles.map((link) => (
                <li className="nav-item" key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className="nav-link mb-2"
                    onClick={closeMobileMenu}
                  >
                    <i className={`bi ${link.icon} me-2`}></i> {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <hr />
            {user && (
              <div className="px-3 mb-3 d-flex align-items-center text-white-50">
                <i className="bi bi-person-circle fs-4 me-2"></i>
                <div className="small">
                  <div className="text-white">{user.nombre}</div>
                  <div>{user.rol}</div>
                </div>
              </div>
            )}
            <div className="px-3">
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline-light btn-sm w-100"
              >
                Cerrar Sesión
              </button>
            </div>
          </nav>

          <main className="col-md-9 ms-md-auto col-lg-10 px-md-4 py-4">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
