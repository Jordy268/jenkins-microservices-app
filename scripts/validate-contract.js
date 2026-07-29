#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const servicePath = process.argv[2];
const contractPath = process.argv[3];

if (!servicePath || !contractPath) {
    console.error('Uso: node validate-contract.js <service-path> <contract-path>');
    process.exit(1);
}

const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

const srcPath = path.join(servicePath, 'src');

const files = fs.readdirSync(srcPath);

let content = '';

files.forEach(file => {
    if (file.endsWith('.js')) {
        content += fs.readFileSync(path.join(srcPath, file), 'utf8');
    }
});

const methodMap = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
};

let errors = [];

contract.endpoints.forEach(endpoint => {

    const expressMethod = methodMap[endpoint.method];

    const expected = `app.${expressMethod}('${endpoint.path}'`;

    if (!content.includes(expected)) {

        errors.push(`${endpoint.method} ${endpoint.path}`);

    }

});

if (errors.length) {

    console.error('❌ Errores de contrato:');

    errors.forEach(e => console.error(e));

    process.exit(1);

}

console.log('✅ Contrato válido');