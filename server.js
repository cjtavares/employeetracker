const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const Department = require('./models/department');
const Roles = require('./models/role');
const Employees = require('./models/employee');
const sequelize = require('./config/connections');


const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Jan@01111991',
      database: 'tracker_db'
    },
    console.log(`Connected to the tracker_db database.`)
  );

  const showRoles = () => {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON department.id = role.department_id', function (err, results) {
        console.table("\n",results);
        init();
  })};

  const showDepartment = () => {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results); 
        init();
    })};
 
  const addDepartment = () => {
    inquirer.prompt([
        {
          type: 'Input',
          message: 'What in th name of Department?',
          name: 'plusDepartment',
        },
      ])
      .then((response) => {
        
        db.query(`INSERT INTO department (name) VALUES ('${response.plusDepartment}')`, function (err, results) {
            init();
          });
      })
  };

  const addRole = () => {
    Department.findAll({
    }).then((departmentData) =>{
    let departmentNames = [];
     for (let i = 0; i < departmentData.length; i++){
        let departmentName = departmentData[i].dataValues.name;
        departmentNames.push(departmentName)
    }
    inquirer.prompt([
        {
          type: 'Input',
          message: 'What is the name of the role?',
          name: 'roleName',
        },
        {
          type: 'Input',
          message: 'What is the salary of the role?',
          name: 'roleSalary',
        },
        {
          type: 'list',
          message: 'What would you like to do?',
          name: 'roleDepartment',
          choices: departmentNames
          },
      ])
      .then((response) => {
        let checkDepartmentID 
        for (let i = 0; i < departmentData.length; i++){
            if(response.roleDepartment === departmentData[i].dataValues.name){
               checkDepartmentID = departmentData[i].dataValues.id
            } 
        }
        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,[response.roleName, response.roleSalary, checkDepartmentID] ,function (err, results) {
            console.log("New role added"); 
            init();
        })
      })
    })};

    const showEmployees = () => {
      db.query('SELECT employees.id, employees.first_name, employees.last_name, role.title AS department, role.salary, CONCAT (employees.first_name, " ", employees.last_name) AS manager  FROM employees JOIN role ON role.id = employees.role_id', function (err, results) {
        console.table(results);
        init();
  })
      // Employees.findAll({
      //   include: [{ model: Roles }, { model: Employees }],
      // }).then((employeeData) => {
      //   console.log(employeeData)
      // });
    };

    const addEmployee = () => {
      Employees.findAll({
        where: {
          manager_id: null
        }
      }).then((employeeData) =>{
       
        let managerFirstNames = [];
        let managerLastNames = [];
        let managerNames = [];
       for (let i = 0; i < employeeData.length; i++){
            let managerFirstName = employeeData[i].dataValues.first_name;
            let managerLastName = employeeData[i].dataValues.last_name;
            managerFirstNames.push(managerFirstName);
            managerLastNames.push(managerLastName);
       }
     
        for (let i = 0; i < employeeData.length; i++){
        let fullName = `${managerFirstNames[i]} ${managerLastNames[i]}`;
        managerNames.push(fullName)
  }

        managerNames.push('None')
      Roles.findAll({
        }).then((roleData) =>{
          let roleNames = [];
          for (let i = 0; i < roleData.length; i++){
          let roleName = roleData[i].dataValues.title;
          roleNames.push(roleName)}
      inquirer.prompt([
          {
            type: 'Input',
            message: 'What is the employees first name',
            name: 'firstName',
          },
          {
            type: 'Input',
            message: 'What is the employees last name?',
            name: 'lastname',
          },
          {
            type: 'list',
            message: 'What is the employees role?',
            name: 'employeerole',
            choices: roleNames
            },
            {
              type: 'list',
              message: 'Who is the employees manager?',
              name: 'employeemanager',
              choices: managerNames
            },
        ])
        .then((response) => {
          let checkRoleID
             for (let i = 0; i < roleData.length; i++){
              if(response.employeerole === roleData[i].dataValues.title){
                 checkRoleID = roleData[i].dataValues.id
              }}

           let name = `${response.employeemanager}`
             const lastName = name.split(" ")

              let checkManagerID
             for (let i = 0; i < employeeData.length; i++){
              if(lastName[0] === employeeData[i].dataValues.first_name && lastName[1] === employeeData[i].dataValues.last_name){
                 checkManagerID = employeeData[i].dataValues.id
              }else{
                checkManagerID = null
              }
            }
            db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,[response.firstName, response.lastname, checkRoleID, checkManagerID] ,function (err, results) {
              console.log("New role added"); 
              init();
            })
          })
      })}
      )};

    const updateEmployeeRole = () => {
      Employees.findAll({
      }).then((employeeData) =>{
        
        let employeeFirstNames = [];
        let employeeLastNames = [];
        
        for (let i = 0; i < employeeData.length; i++){
        let employeeFirstName = employeeData[i].dataValues.first_name;
        let employeeLastName = employeeData[i].dataValues.last_name;
        employeeFirstNames.push(employeeFirstName);
        employeeLastNames.push(employeeLastName);
    }
        let employeeNames = [];
        for (let i = 0; i < employeeData.length; i++){
        let fullName = `${employeeFirstNames[i]} ${employeeLastNames[i]}`;
        employeeNames.push(fullName)
  }
         Roles.findAll({
          }).then((roleData) =>{
          let roleNames = [];
          for (let i = 0; i < roleData.length; i++){
          let roleName = roleData[i].dataValues.title;
          roleNames.push(roleName)
  }
          inquirer.prompt([
            {
             type: 'list',
              message: "Which employee's role do you want to update?",
             name: "employeename",
             choices: employeeNames,
           },
            {
             type: 'list',
             message: 'Which role do you want to assign the selected employee?',
             name: 'newrole',
             choices: roleNames,
            },
          ])
            .then((response) => {
             let name = `${response.employeename}`
             const lastName = name.split(" ")
             
             let checkRoleID
             for (let i = 0; i < roleData.length; i++){
              if(response.newrole === roleData[i].dataValues.title){
                 checkRoleID = roleData[i].dataValues.id
              }}

              
            Employees.update({
                role_id: checkRoleID,
            },
            {
            where: {
              first_name: lastName[0],
              last_name: lastName[1],
            } 
          })
          init();
        }) 
      }) 
  }
  )
  };
    

const init = () => {inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'promtquestion',
      choices: ['View All Employees','Add Employee', 'Update Employees Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
    },
  ])
  .then((response) =>
    {switch (response.promtquestion) {
        case "View All Employees":
          showEmployees();
          break; 
        case "Add Employee":
          addEmployee();
          break; 
        case "Update Employees Role":
          updateEmployeeRole();
          break;  
        case "View All Roles":
          showRoles();   
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          showDepartment();
          break;
        case "Add Department":
          addDepartment();     
      }}
  )};

  // sequelize.sync({ force: false });

  init();

 
  