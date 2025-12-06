import { useEffect, useState } from "react";
import { adminService } from "../../../../services/admin.api.js";
import { Card, Button, Alert, LoadingState } from "../../../components/ui";
import { Users, Clock, BookOpen, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { PendingGroupCard } from "../components";

const DashboardAdmin = () => {
    const [requests, setRequests] = useState([]);
    const [pendingGroups, setPendingGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupsLoading, setGroupsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [groupActionLoading, setGroupActionLoading] = useState(null);
    const [message, setMessage] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await adminService.getRoleRequests();
            const items = res?.data ?? res ?? [];
            setRequests(Array.isArray(items) ? items : []);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || "Error al cargar solicitudes" });
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingGroups = async () => {
        setGroupsLoading(true);
        try {
            const res = await adminService.getRequestedGroups();
            const items = res?.data ?? res ?? [];
            setPendingGroups(Array.isArray(items) ? items : []);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Error al cargar grupos pendientes:", err);
            setPendingGroups([]);
        } finally {
            setGroupsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        fetchPendingGroups();
    }, []);

    const handleApproveRemote = async (requestId) => {
        if (!window.confirm("¿Confirmas aprobar esta solicitud?")) return;
        setActionLoading(requestId);
        setMessage(null);
        try {
            await adminService.approveRoleRequest(requestId);
            setMessage({ type: 'success', text: `Solicitud ${requestId} aprobada correctamente.` });
            await fetchRequests();
        } catch (err) {
            setMessage({ type: 'error', text: err.message || "Error al aprobar la solicitud" });
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
            setMessage({ type: 'success', text: `Solicitud ${requestId} rechazada.` });
            await fetchRequests();
        } catch (err) {
            setMessage({ type: 'error', text: err.message || "Error al rechazar la solicitud" });
        } finally {
            setActionLoading(null);
        }
    };

    const handleApproveGroup = async (groupId) => {
        if (!window.confirm("¿Confirmas aprobar este grupo? Se le asignará un código único.")) return;
        setGroupActionLoading(groupId);
        setMessage(null);
        try {
            await adminService.approveRequestedGroup(groupId);
            setMessage({ type: 'success', text: 'Grupo aprobado exitosamente' });
            await fetchPendingGroups();
        } catch (err) {
            setMessage({ type: 'error', text: err.message || "Error al aprobar el grupo" });
        } finally {
            setGroupActionLoading(null);
        }
    };

    const pendingCount = requests.filter((r) => r.estado === "pendiente").length;

    const getStatusStyle = (estado) => {
        switch (estado) {
            case "pendiente":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
            case "aprobado":
                return "bg-green-500/10 text-green-400 border-green-500/30";
            case "rechazado":
                return "bg-red-500/10 text-red-400 border-red-500/30";
            default:
                return "bg-slate-500/10 text-slate-400 border-slate-500/30";
        }
    };

    return (
        <div className={`${PAGE_LAYOUTS.gradient} ${PAGE_LAYOUTS.withPadding}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-display-lg text-text-primary mb-2">Panel de Administrador</h1>
                    <p className="text-text-base text-text-secondary">Gestión de solicitudes de rol</p>
                </header>

                {/* Stats Cards */}
                <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    <Card 
                        title="Solicitudes de rol" 
                        value={pendingCount}
                        icon={<Clock className="w-5 h-5 text-yellow-400" />}
                    />
                    <Card 
                        title="Grupos pendientes" 
                        value={pendingGroups.length}
                        icon={<Users className="w-5 h-5 text-emerald-400" />}
                    />
                    <Card 
                        title="Cursos activos" 
                        value="1"
                        icon={<BookOpen className="w-5 h-5 text-blue-400" />}
                    />
                </section>

                {/* Messages */}
                {message && (
                    <Alert 
                        variant={message.type === 'success' ? 'success' : 'error'}
                        className="mb-6"
                    >
                        {message.text}
                    </Alert>
                )}

                {loading && (
                    <LoadingState message="Cargando solicitudes..." className="mb-6" />
                )}

                {/* Requests Table */}
                <section className="bg-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-700/50">
                        <h2 className="text-xl font-bold text-white">Solicitudes de rol</h2>
                    </div>

                    {requests.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            No hay solicitudes
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-800/50">
                                    <tr className="border-b border-slate-700/50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">N°</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuario</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Rol solicitado</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Hora</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {requests.map((r, index) => (
                                        <tr key={r.id} className="hover:bg-slate-800/30 transition-colors duration-150">
                                            <td className="px-6 py-4 text-sm text-slate-300">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-white">{r.usuario?.nombre ?? "—"}</td>
                                            <td className="px-6 py-4 text-sm text-slate-300">{r.usuario?.email ?? "—"}</td>
                                            <td className="px-6 py-4 text-sm text-slate-300">{r.rol_usuario?.nombre ?? r.rol_usuarioId ?? "—"}</td>
                                            <td className="px-6 py-4 text-sm text-slate-300">
                                                {r.fecha_solicitud ? new Date(r.fecha_solicitud).toLocaleDateString() : "—"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-300">
                                                {r.fecha_solicitud ? new Date(r.fecha_solicitud).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(r.estado)}`}>
                                                    {r.estado === "pendiente" && <Clock className="w-3 h-3" />}
                                                    {r.estado === "aprobado" && <CheckCircle2 className="w-3 h-3" />}
                                                    {r.estado === "rechazado" && <XCircle className="w-3 h-3" />}
                                                    <span className="capitalize">{r.estado}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Button 
                                                        variant="success" 
                                                        size="sm"
                                                        onClick={() => handleApproveRemote(r.id)}
                                                        disabled={actionLoading === r.id || r.estado !== "pendiente"}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Aprobar
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => handleRejectRemote(r.id)}
                                                        disabled={actionLoading === r.id || r.estado !== "pendiente"}
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Rechazar
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Pending Groups Section */}
                <section className="mt-10">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Grupos pendientes de aprobación</h2>
                        <p className="text-slate-400">Revisa y aprueba las solicitudes de creación de grupos</p>
                    </div>

                    {groupsLoading ? (
                        <div className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-slate-300">Cargando grupos pendientes...</span>
                        </div>
                    ) : pendingGroups.length === 0 ? (
                        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-300 mb-2">No hay grupos pendientes</h3>
                            <p className="text-slate-500 text-sm">Todas las solicitudes han sido procesadas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingGroups.map((group) => (
                                <PendingGroupCard
                                    key={group.id}
                                    group={group}
                                    onApprove={handleApproveGroup}
                                    loading={groupActionLoading}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default DashboardAdmin;