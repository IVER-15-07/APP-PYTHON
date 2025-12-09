import { Search, Filter, X, Compass, RefreshCw } from 'lucide-react';
import { useExploreTopics } from '../hooks/useExploreTopics';
import TopicExplorerCard from '../components/TopicExplorerCard';

const ExploreTopics = () => {
    const {
        filteredTopics,
        topicsByLevel,
        loading,
        error,
        courses,
        levels,
        types,
        selectedCourse,
        selectedLevel,
        selectedType,
        searchQuery,
        setSelectedCourse,
        setSelectedLevel,
        setSelectedType,
        setSearchQuery,
        resetFilters,
    } = useExploreTopics();

    const hasActiveFilters = selectedCourse !== 'all' || selectedLevel !== 'all' || selectedType !== 'all' || searchQuery;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-slate-300">Cargando tópicos...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-slate-900/80 backdrop-blur-sm border border-red-700/50 rounded-2xl p-12 text-center shadow-2xl">
                        <p className="text-red-400">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Compass className="w-8 h-8 text-emerald-400" />
                        <h1 className="text-4xl font-bold text-white">Explorar Tópicos</h1>
                    </div>
                    <p className="text-slate-400">Descubre todos los tópicos disponibles en la plataforma</p>
                </header>

                {/* Filtros */}
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-lg font-semibold text-white">Filtros</h2>
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Limpiar filtros
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Búsqueda */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar tópico..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Filtro por Curso */}
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm appearance-none cursor-pointer hover:bg-slate-800/70 [&>option]:bg-slate-800 [&>option]:text-white [&>option]:py-2"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                paddingRight: '2.5rem'
                            }}
                        >
                            <option value="all">Todos los cursos</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.nombre}
                                </option>
                            ))}
                        </select>

                        {/* Filtro por Nivel */}
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm appearance-none cursor-pointer hover:bg-slate-800/70 [&>option]:bg-slate-800 [&>option]:text-white [&>option]:py-2"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                paddingRight: '2.5rem'
                            }}
                        >
                            <option value="all">Todos los niveles</option>
                            {levels.map((level) => (
                                <option key={level.id} value={level.id}>
                                    {level.nombre}
                                </option>
                            ))}
                        </select>

                        {/* Filtro por Tipo */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm appearance-none cursor-pointer hover:bg-slate-800/70 [&>option]:bg-slate-800 [&>option]:text-white [&>option]:py-2"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                paddingRight: '2.5rem'
                            }}
                        >
                            <option value="all">Todos los tipos</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Contador de resultados */}
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <p className="text-sm text-slate-400">
                            Mostrando <span className="text-emerald-400 font-semibold">{filteredTopics.length}</span> tópico{filteredTopics.length !== 1 && 's'}
                            {hasActiveFilters && ' (filtrados)'}
                        </p>
                    </div>
                </div>

                {/* Contenido principal */}
                {filteredTopics.length === 0 ? (
                    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                        <Compass className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-300 mb-2">
                            {hasActiveFilters ? 'No se encontraron tópicos' : 'Aún no hay tópicos disponibles'}
                        </h3>
                        <p className="text-slate-500 text-sm mb-4">
                            {hasActiveFilters 
                                ? 'Intenta ajustar los filtros para ver más resultados'
                                : 'Los tópicos creados aparecerán aquí'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-lg border border-emerald-500/30 hover:border-emerald-500/50 transition-all text-sm font-medium"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Agrupar por nivel */}
                        {Object.entries(topicsByLevel).map(([levelName, topics]) => (
                            <section key={levelName}>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                                    <h2 className="text-lg font-bold text-white px-4">{levelName}</h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {topics.map((topic) => (
                                        <TopicExplorerCard key={topic.id} topic={topic} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExploreTopics;
