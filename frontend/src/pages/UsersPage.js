import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../api/userApi'; // Asegúrate de haber implementado esta API

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email} ({user.userType})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
