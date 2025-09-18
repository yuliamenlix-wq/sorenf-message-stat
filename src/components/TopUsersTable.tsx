import React, { useEffect, useState, useMemo } from "react";

interface User {
  id: string;
  username?: string;
  total_messages?: number;
}

interface Props {
  refreshInterval?: number; // ms
  pageSize?: number; // items por página
}

const TopUsersTable: React.FC<Props> = ({ refreshInterval = 10000, pageSize = 10 }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/getUsers");
      if (!res.ok) throw new Error("Error fetching users");
      const data = await res.json();

      const mapped: User[] = data.map((u: User) => ({
        id: u.id,
        username: u.username  || "unknown",
        total_messages: u.total_messages || 0,
      }));
      // ordenar descendente por mensajes
      mapped.sort((a, b) => (b.total_messages || 0) - (a.total_messages || 0));
      setUsers(mapped);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    //const interval = setInterval(fetchUsers, refreshInterval);
    //return () => clearInterval(interval);
  }, []);

  // paginación
  const totalPages = Math.ceil(users.length / pageSize);
  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, currentPage, pageSize]);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log(users)
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-b from-[#f5f7f8] to-[#eef3f5] min-h-screen">
      <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
        <header className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#0f6b6b] to-[#d8a64e] flex items-center justify-center text-white font-bold text-xl shadow-md">
            U
          </div>
          <div>
            <h1 className="text-lg font-semibold">Top de Usuarios por Mensajes</h1>
            <p className="text-gray-400 text-xs">Actualizado cada {refreshInterval / 1000}s</p>
          </div>
          <div className="ml-auto self-end">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-[#d8a64e]">
              Total: {users.length} usuarios
            </span>
          </div>
        </header>

        <div className="overflow-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Pos</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Usuario</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Mensajes</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((user, idx) => {
                const isFirst = idx === 0 && currentPage === 1;
                return (
                  <tr
                    key={user.id}
                    className={`${
                      isFirst
                        ? "shadow-lg rounded-xl"
                        : idx % 2 === 0
                        ? "bg-[#f0f4f6]"
                        : "bg-white/80"
                    }`}
                  >
                    <td className="rank font-bold text-[#0f6b6b] px-4 py-3">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div
                        className={`w-9 h-9 flex items-center justify-center font-bold rounded-md border ${
                          isFirst
                            ? "bg-gradient-to-br from-[#d8a64e] to-[#0f6b6b] text-white border-transparent"
                            : "bg-[#0f6b6b]/10 text-[#d8a64e] border-[#0f6b6b]/20"
                        }`}
                      >
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="font-semibold">{user.username}</div>
                    </td>
                    <td className="text-right font-bold text-[#0f1720] px-4 py-3">{user.total_messages}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUsersTable;
