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

// Función principal para probar la jerarquía completa
async function testFullHierarchy() {
  try {
    console.log('=== PRUEBA DE CREACIÓN DE JERARQUÍA COMPLETA ===');
    
    // 1. Crear una organización
    console.log('\n1. CREAR ORGANIZACIÓN');
    const organization = await makeRequest('/api/organizations', 'POST', {
      name: 'SmartBuilding Inc.',
      description: 'Empresa de edificios inteligentes'
    });
    
    if (!organization || !organization.id) {
      throw new Error('No se pudo crear la organización');
    }
    
    // 2. Crear un sitio para la organización
    console.log('\n2. CREAR SITIO');
    const site = await makeRequest('/api/sites', 'POST', {
      name: 'Edificio Principal',
      organizationId: organization.id,
      location: 'Madrid, España'
    });
    
    if (!site || !site.id) {
      throw new Error('No se pudo crear el sitio');
    }
    
    // 3. Crear un punto de medición para el sitio
    console.log('\n3. CREAR PUNTO DE MEDICIÓN');
    const measuringPoint = await makeRequest('/api/measuring-points', 'POST', {
      name: 'Sistema HVAC Planta 1',
      siteId: site.id,
      description: 'Control de climatización centralizado'
    });
    
    if (!measuringPoint || !measuringPoint.id) {
      throw new Error('No se pudo crear el punto de medición');
    }
    
    // 4. Crear un board para el punto de medición
    console.log('\n4. CREAR BOARD');
    const board = await makeRequest('/api/boards', 'POST', {
      name: 'HVAC Controller',
      measuringPointId: measuringPoint.id,
      serialNumber: 'SB-HVAC-001',
      firmwareVersion: '2.0.1'
    });
    
    if (!board || !board.id) {
      throw new Error('No se pudo crear el board');
    }
    
    // 5. Crear sensores para el board
    console.log('\n5. CREAR SENSORES');
    
    // Sensor de temperatura
    const tempSensor = await makeRequest('/api/sensors', 'POST', {
      name: 'Temperatura Ambiente',
      boardId: board.id,
      type: 'TEMPERATURE',
      unit: '°C',
      minValue: -10,
      maxValue: 50,
      isActive: true
    });
    
    // Sensor de humedad
    const humSensor = await makeRequest('/api/sensors', 'POST', {
      name: 'Humedad Ambiente',
      boardId: board.id,
      type: 'HUMIDITY',
      unit: '%',
      minValue: 0,
      maxValue: 100,
      isActive: true
    });
    
    // 6. Actualizar la lectura de un sensor
    if (tempSensor && tempSensor.id) {
      console.log('\n6. ACTUALIZAR LECTURA DE SENSOR');
      await makeRequest(`/api/sensors/${tempSensor.id}/reading`, 'PUT', {
        currentValue: 24.5
      });
    }
    
    // 7. Consultar toda la jerarquía
    console.log('\n7. CONSULTAR LA ORGANIZACIÓN CREADA CON SU JERARQUÍA');
    await makeRequest(`/api/organizations/${organization.id}`);
    
    console.log('\n8. CONSULTAR LOS SITIOS DE LA ORGANIZACIÓN');
    await makeRequest(`/api/sites/organization/${organization.id}`);
    
    console.log('\n9. CONSULTAR LOS PUNTOS DE MEDICIÓN DEL SITIO');
    await makeRequest(`/api/measuring-points/site/${site.id}`);
    
    console.log('\n10. CONSULTAR LOS BOARDS DEL PUNTO DE MEDICIÓN');
    await makeRequest(`/api/boards/measuring-point/${measuringPoint.id}`);
    
    console.log('\n11. CONSULTAR LOS SENSORES DEL BOARD');
    await makeRequest(`/api/sensors/board/${board.id}`);
    
    // 8. Eliminar toda la jerarquía al finalizar (opcional, comentado por defecto)
    /*
    console.log('\n=== LIMPIEZA: ELIMINAR JERARQUÍA ===');
    console.log('\nELIMINAR ORGANIZACIÓN (ELIMINA TODA LA JERARQUÍA)');
    await makeRequest(`/api/organizations/${organization.id}`, 'DELETE');
    */
    
    console.log('\n=== PRUEBA DE JERARQUÍA COMPLETADA ===');
    
  } catch (error) {
    console.error('Error ejecutando prueba de jerarquía:', error);
  }
}

// Ejecutar la prueba
testFullHierarchy(); 