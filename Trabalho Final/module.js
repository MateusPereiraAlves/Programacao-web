function inicializa_mapeamento(employeeTables, employees) {
    //Precisou criar essa função pq este pedaço do codigo não estava sendo executado por algum motivo
  
    // Uma lista que armazena os nomes dos funcionários
    //const employees = ["João", "Maria", "Pedro", "Ana"];
    
    // Inicializa o mapa de funcionários com o número de mesas que cada funcionário está atendendo
    for (let employee of employees) {
      employeeTables.set(employee, 0);
    }
  }
  
  
  function assignTable(customerName,  employeeTables, employees, tables) {
      // Cria uma lista com os números de mesas que estão disponíveis
      const availableTables = [];
      for (let i = 1; i <= 3; i++) {
        availableTables.push(i);
      }
      
      // Remove da lista os números de mesas que já estão ocupadas
      for (const [customerName, table] of tables) {
        const tableNumber = table.tableNumber;
        const index = availableTables.indexOf(tableNumber);
        if (index > -1) {
          availableTables.splice(index, 1);
        }
      }
      
      // Se não há mesas disponíveis, exibe uma mensagem de erro e retorna
      if (availableTables.length === 0) {
        console.log("Não há mesas disponíveis!");
        return false;
      }
      
      // Seleciona um número de mesa aleatoriamente
      const randomIndex = Math.floor(Math.random() * availableTables.length);
      const tableNumber = availableTables[randomIndex];
       
      // Primeiro, procuramos um funcionário que não esteja atendendo outro cliente
      for (const employee of employees) {
        // Verificamos o número de mesas que o funcionário está atendendo
        const numTables = employeeTables.get(employee);
        // Se o funcionário não está atendendo nenhuma mesa, atribuímos a mesa a ele
        if (numTables === 0) {
          // Atribuimos a mesa ao funcionário e armazenamos as informações no mapa
          tables.set(customerName, { tableNumber, client: customerName, employee: employee });
          employeeTables.set(employee, numTables + 1);
          return true;
        }
      }
       
      // Caso não haja funcionários disponíveis, procuramos o funcionário que está atendendo o menor número de mesas
      let minEmployee = null;
      let minTables = Number.MAX_VALUE;
      for (const [employee, numTables] of employeeTables) {
        if (numTables < minTables) {
          minEmployee = employee;
          minTables = numTables;
        }
      }
       
      // Atribuimos a mesa ao funcionário e armazenamos as informações no mapa
      tables.set(customerName, { tableNumber, client: customerName, employee: minEmployee });
      employeeTables.set(minEmployee, minTables + 1);
  }
      
  function freeTable(tableNumber, employeeTables, tables) {
      //Usar map.delete()
      // Primeiro, procuramos a mesa no mapa
      for (const [customerName, table] of tables) {
        if (table.tableNumber === tableNumber) {
          // Removemos a entrada do mapa
          tables.delete(customerName);
          // Decrementamos o número de mesas que o funcionário está atendendo
          const employee = table.employee;
          const numTables = employeeTables.get(employee);
          employeeTables.set(employee, numTables - 1);
          return;
        }
      }
  }


// Usamos a função assignTable para atribuir uma mesa a cada um dos 15 clientes
//const customerNames = ["João", "Maria", "Pedro", "Ana", "Lucas", "Bia", "Carlos", "Carla", "Luciana", "Fernando", "Amanda", "Gabriel", "Rafael", "Gustavo", "Ana Clara"];
//for (const customerName of customerNames) {
//  assignTable(customerName);
//}

/*
var intervalo = setInterval(function() {
  hasTable = module.assignTable(nome, employeeTables, employees, tables)
  if (!hasTable) {
    console.log("Não há mesas disponíveis!");
    res.redirect("/login")
  }
  else {
    clearInterval(intervalo)
  }
}, 1000);
*/
  

  module.exports.inicializa_mapeamento = inicializa_mapeamento;
  module.exports.assignTable = assignTable
  module.exports.freeTable = freeTable
