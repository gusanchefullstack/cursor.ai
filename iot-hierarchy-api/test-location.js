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

// Función principal para probar las propiedades de ubicación
async function testLocationFeatures() {
  try {
    console.log('=== PRUEBA DE UBICACIÓN EN PUNTOS DE MEDICIÓN ===');
    
    // 1. Listar todos los puntos de medición para ver las coordenadas
    console.log('\n1. LISTAR TODOS LOS PUNTOS DE MEDICIÓN');
    await makeRequest('/api/measuring-points');
    
    // 2. Crear una organización para las pruebas
    console.log('\n2. CREAR ORGANIZACIÓN');
    const organization = await makeRequest('/api/organizations', 'POST', {
      name: 'Prueba de Ubicación',
      description: 'Organización para probar las propiedades de ubicación'
    });
    
    // 3. Crear un sitio para la organización
    console.log('\n3. CREAR SITIO');
    const site = await makeRequest('/api/sites', 'POST', {
      name: 'Sitio de Prueba',
      organizationId: organization.id,
      location: 'Barcelona, España'
    });
    
    // 4. Crear un punto de medición con coordenadas
    console.log('\n4. CREAR PUNTO DE MEDICIÓN CON COORDENADAS');
    const measuringPoint = await makeRequest('/api/measuring-points', 'POST', {
      name: 'Punto de Medición con Coordenadas',
      siteId: site.id,
      description: 'Punto de medición para probar las propiedades de ubicación',
      latitude: 41.3851,
      longitude: 2.1734
    });
    
    // 5. Obtener el punto de medición por ID
    console.log('\n5. OBTENER EL PUNTO DE MEDICIÓN POR ID');
    await makeRequest(`/api/measuring-points/${measuringPoint.id}`);
    
    // 6. Actualizar las coordenadas del punto de medición
    console.log('\n6. ACTUALIZAR COORDENADAS DEL PUNTO DE MEDICIÓN');
    await makeRequest(`/api/measuring-points/${measuringPoint.id}`, 'PUT', {
      latitude: 41.3825,
      longitude: 2.1769
    });
    
    // 7. Obtener el punto de medición actualizado
    console.log('\n7. OBTENER EL PUNTO DE MEDICIÓN ACTUALIZADO');
    await makeRequest(`/api/measuring-points/${measuringPoint.id}`);
    
    // 8. Probar validación con coordenadas inválidas
    console.log('\n8. PROBAR COORDENADAS INVÁLIDAS (LATITUD FUERA DE RANGO)');
    await makeRequest(`/api/measuring-points/${measuringPoint.id}`, 'PUT', {
      latitude: 95,
      longitude: 2.1769
    });
    
    console.log('\n9. PROBAR COORDENADAS INVÁLIDAS (LONGITUD FUERA DE RANGO)');
    await makeRequest(`/api/measuring-points/${measuringPoint.id}`, 'PUT', {
      latitude: 41.3825,
      longitude: 190
    });
    
    console.log('\n=== PRUEBA DE UBICACIÓN COMPLETADA ===');
    
  } catch (error) {
    console.error('Error ejecutando prueba de ubicación:', error);
  }
}

// Ejecutar las pruebas
testLocationFeatures(); 