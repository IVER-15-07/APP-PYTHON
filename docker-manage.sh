#!/bin/bash

# Script para gestionar Docker de APP-PYTHON
# Uso: ./docker-manage.sh [comando]

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funciones
print_header() {
    echo -e "\n${BLUE}==================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}==================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que Docker está corriendo
check_docker() {
    if ! docker ps > /dev/null 2>&1; then
        print_error "Docker no está en ejecución"
        print_warning "Por favor, abre Docker Desktop"
        exit 1
    fi
    print_success "Docker está en ejecución"
}

# Comandos disponibles
cmd_build() {
    print_header "Construyendo imágenes Docker"
    check_docker
    docker-compose build --no-cache
    print_success "Imágenes construidas exitosamente"
}

cmd_up() {
    print_header "Iniciando contenedores"
    check_docker
    docker-compose up
}

cmd_up_detached() {
    print_header "Iniciando contenedores en segundo plano"
    check_docker
    docker-compose up -d
    print_success "Contenedores iniciados"
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend:  http://localhost:5000"
    echo ""
    echo "Ver logs:"
    echo "  docker-compose logs -f frontend"
    echo "  docker-compose logs -f backend"
}

cmd_down() {
    print_header "Deteniendo contenedores"
    docker-compose down
    print_success "Contenedores detenidos"
}

cmd_logs() {
    print_header "Mostrando logs"
    if [ "$1" == "backend" ] || [ "$1" == "frontend" ]; then
        docker-compose logs -f "$1"
    else
        docker-compose logs -f
    fi
}

cmd_status() {
    print_header "Estado de contenedores"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

cmd_shell() {
    print_header "Accediendo a contenedor"
    if [ "$1" == "backend" ] || [ "$1" == "frontend" ]; then
        docker exec -it "app-$1" sh
    else
        print_error "Especifica: backend o frontend"
        exit 1
    fi
}

cmd_restart() {
    print_header "Reiniciando contenedores"
    docker-compose restart
    print_success "Contenedores reiniciados"
}

cmd_clean() {
    print_header "Limpiando Docker"
    print_warning "Esto eliminará contenedores, redes e imágenes sin usar"
    read -p "¿Deseas continuar? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        docker-compose down -v
        docker system prune -f
        print_success "Limpieza completada"
    else
        print_warning "Limpieza cancelada"
    fi
}

cmd_rebuild() {
    print_header "Reconstruyendo y reiniciando"
    check_docker
    docker-compose down
    docker-compose build --no-cache
    docker-compose up
}

cmd_help() {
    print_header "Comandos disponibles"
    cat << EOF
Uso: ./docker-manage.sh [comando] [opciones]

Comandos:
  build                Construir imágenes Docker
  up                   Iniciar contenedores (ver logs)
  up-d                 Iniciar contenedores en segundo plano
  down                 Detener contenedores
  restart              Reiniciar contenedores
  logs [backend|frontend]
                      Ver logs de contenedores
  status               Ver estado de contenedores
  shell [backend|frontend]
                      Acceder a terminal de contenedor
  rebuild              Reconstruir y reiniciar todo
  clean                Limpiar volúmenes e imágenes
  help                 Mostrar esta ayuda

Ejemplos:
  ./docker-manage.sh build
  ./docker-manage.sh up
  ./docker-manage.sh logs backend
  ./docker-manage.sh shell frontend

EOF
}

# Main
if [ $# -eq 0 ]; then
    cmd_help
    exit 0
fi

case "$1" in
    build)
        cmd_build
        ;;
    up)
        cmd_up
        ;;
    up-d|up-detached)
        cmd_up_detached
        ;;
    down)
        cmd_down
        ;;
    logs)
        cmd_logs "$2"
        ;;
    status)
        cmd_status
        ;;
    shell)
        cmd_shell "$2"
        ;;
    restart)
        cmd_restart
        ;;
    rebuild)
        cmd_rebuild
        ;;
    clean)
        cmd_clean
        ;;
    help|-h|--help)
        cmd_help
        ;;
    *)
        print_error "Comando desconocido: $1"
        cmd_help
        exit 1
        ;;
esac