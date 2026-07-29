#!/bin/sh

echo "Verificando API Gateway..."
curl http://localhost:3000/health

echo "Verificando User Service..."
curl http://localhost:3001/health

echo "Verificando Product Service..."
curl http://localhost:3002/health