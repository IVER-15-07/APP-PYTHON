// ...existing code...
import { useEffect, useState } from "react";
import { adminService } from "../../../../services/admin.api.js";
import { Card, Button } from "../../../components/ui";



const DashboardAdmin = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [setActionLoading] = useState(null);
    const [message, setMessage] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await adminService.getRoleRequests(); // adminService debe devolver response.data
            const items = res?.data ?? res ?? [];
            setRequests(Array.isArray(items) ? items : []);
        } catch (err) {
            setMessage(err.message || "Error al cargar solicitudes");
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApproveRemote = async (requestId) => {
        if (!window.confirm("¿Confirmas aprobar esta solicitud?")) return;
        setActionLoading(requestId);
        setMessage(null);
        try {
            await adminService.approveRoleRequest(requestId);
            setMessage(`Solicitud ${requestId} aprobada.`);
            await fetchRequests();
        } catch (err) {
            setMessage(err.message || "Error al aprobar la solicitud");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectRemote = async (requestId) => {
        if (!window.confirm("¿Confirmas rechazar esta solicitud?")) return;
        setActionLoading(requestId);
        setMessage(null);
        try {
            await adminService.rejectRoleRequest(requestId);
            setMessage(`Solicitud ${requestId} rechazada.`);
            await fetchRequests();
        } catch (err) {
            setMessage(err.message || "Error al rechazar la solicitud");
        } finally {
            setActionLoading(null);
        }
    };

    const pendingCount = requests.filter((r) => r.estado === "pendiente").length;

    return (
        <div style={{ padding: 20, color: "#e6eef8", fontFamily: "Inter, sans-serif" }}>
            <header style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 28, margin: 0 }}>Panel de Administrador</h1>
                <p style={{ color: "#9aa6b2", marginTop: 6 }}>Gestión de solicitudes de rol</p>
            </header>

            <section style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <Card title="Usuarios totales" value="—" />
                <Card title="Solicitudes pendientes" value={pendingCount} />
                <Card title="Cursos" value="—" />
            </section>

            {message && <div style={{ marginBottom: 12, color: "#a3e635" }}>{message}</div>}
            {loading && <div style={{ marginBottom: 12 }}>Cargando solicitudes...</div>}

            <section>
                <h2 style={{ fontSize: 18, marginBottom: 10 }}>Solicitudes de rol</h2>

                {requests.length === 0 ? (
                    <div>No hay solicitudes</div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", background: "#071026" }}>
                            <thead>
                                <tr style={{ textAlign: "left", borderBottom: "1px solid #213244" }}>
                                    <th style={thStyle}>N</th>
                                    <th style={thStyle}>Usuario</th>
                                    <th style={thStyle}>Email</th>
                                    <th style={thStyle}>Rol solicitado</th>
                                    <th style={thStyle}>Fecha</th>
                                    <th style={thStyle}>Hora</th>
                                    <th style={thStyle}>Estado</th>
                                    <th style={thStyle}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((r, index) => (
                                    <tr key={r.id} style={{ borderBottom: "1px solid #132433" }}>
                                        <td style={tdStyle}>{index + 1}</td>
                                        <td style={tdStyle}>{r.usuario?.nombre ?? "—"}</td>
                                        <td style={tdStyle}>{r.usuario?.email ?? "—"}</td>
                                        <td style={tdStyle}>{r.rol_usuario?.nombre ?? r.rol_usuarioId ?? "—"}</td>
                                        <td style={tdStyle}>{r.fecha_solicitud ? new Date(r.fecha_solicitud).toLocaleDateString() : "—"}</td>
                                        <td style={tdStyle}>{r.fecha_solicitud ? new Date(r.fecha_solicitud).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                                        <td style={{ ...tdStyle, textTransform: "capitalize" }}>{r.estado}</td>
                                        <td style={tdStyle}>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <Button variant="approve" onClick={() => handleApproveRemote(r.id)}>Aprobar</Button>
                                                <Button variant="reject" onClick={() => handleRejectRemote(r.id)}>Rechazar</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};



const thStyle = { padding: "12px 10px", fontSize: 13, color: "#9aa6b2" };
const tdStyle = { padding: "12px 10px", fontSize: 14, color: "#cfe6ff" };


export default DashboardAdmin;
