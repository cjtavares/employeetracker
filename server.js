const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const Department = require('./models/department');
const Roles = require('./models/role');
const Employees = require('./models/employee');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
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
    // db.query('SELECT name FROM department', function (err, results) { 
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
        // console.log(checkDepartmentID)
        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,[response.roleName, response.roleSalary, checkDepartmentID] ,function (err, results) {
            console.log("New role added"); 
            init();
        })
      })
    })};

    const showEmployees = () => {

    };

    const addEmployee = () => {

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

  init();