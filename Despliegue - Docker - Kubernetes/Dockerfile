FROM nginx:latest

# Copiar los archivos de Angular a la carpeta de Nginx
COPY prueba-practica/ /usr/share/nginx/html/

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/

# Exponer el puerto 8081
EXPOSE 8081

