const http = require('http');

// Función para hacer solicitudes HTTP
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log(`\n${method} ${path} - Status Code: ${res.statusCode}`);
        try {
          const parsedData = JSON.parse(responseData);
          console.log(JSON.stringify(parsedData, null, 2));
          resolve(parsedData);
        } catch (e) {
          console.log(responseData);
          resolve(responseData);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Error en solicitud ${method} ${path}:`, error.message);
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Función principal para ejecutar las pruebas
async function runTests() {
  try {
    console.log('=== PROBANDO API IoT HIERARCHY ===');
    
    // Probar ruta raíz
    await makeRequest('/');
    
    // Probar organizaciones
    console.log('\n=== ORGANIZACIONES ===');
    await makeRequest('/api/organizations');
    
    // Probar sitios
    console.log('\n=== SITIOS ===');
    await makeRequest('/api/sites');
    
    // Probar puntos de medición
    console.log('\n=== PUNTOS DE MEDICIÓN ===');
    await makeRequest('/api/measuring-points');
    
    // Probar boards
    console.log('\n=== BOARDS ===');
    await makeRequest('/api/boards');
    
    // Probar sensores
    console.log('\n=== SENSORES ===');
    await makeRequest('/api/sensors');
    
    // Probar crear una nueva organización
    console.log('\n=== CREAR ORGANIZACIÓN ===');
    const newOrg = await makeRequest('/api/organizations', 'POST', {
      name: 'Nueva Organización de Prueba',
      description: 'Esta es una organización creada para probar la API'
    });
    
    // Probar obtener la organización creada
    if (newOrg && newOrg.id) {
      console.log('\n=== OBTENER ORGANIZACIÓN CREADA ===');
      await makeRequest(`/api/organizations/${newOrg.id}`);
      
      // Probar actualizar la organización
      console.log('\n=== ACTUALIZAR ORGANIZACIÓN ===');
      await makeRequest(`/api/organizations/${newOrg.id}`, 'PUT', {
        name: 'Organización Actualizada',
        description: 'Descripción actualizada para pruebas'
      });
      
      // Probar eliminar la organización
      console.log('\n=== ELIMINAR ORGANIZACIÓN ===');
      await makeRequest(`/api/organizations/${newOrg.id}`, 'DELETE');
    }
    
    console.log('\n=== PRUEBAS COMPLETADAS ===');
    
  } catch (error) {
    console.error('Error ejecutando pruebas:', error);
  }
}

// Ejecutar las pruebas
runTests(); 