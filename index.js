// first MySQL databse with three tables

const mysql = require('mysql');
const inquirer = require('inquirer');
// const { Table } = require('console-table-printer');  -- did bit apply this package feature
const util = require('util');



// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'yourRootPassword',  // I want to implement .env
  database: 'employee_db',
});

connection.connect();
connection.query = util.promisify(connection.query);

const validateString = string => {
  return string !== '' || 'This information is required.';
};

// function which prompts the user for what action they should take
const start = () => {
  inquirer.prompt([
    {
      name: 'Menu_Choice',
      type: 'list',
      // type: 'checkbox': In previous work i applied a check box, which worked well too. Not sure what the benefits of the one over the other are.
      message: 'What would you like to do?',
      choices: [
        'Do your want to Exit?',
        'View all departments?',
        'View all roles?',
        'View all employees?',
        'Add a department?',
        'Add a role?',
        'Add an employee?',
        'Update employees role?',
        'Update manger id?',
        'View employe by manager',
        'Delete employee',
        'Delete role',
        'Delete employee or role?'
      ],
    }
  ])
    .then((answer) => {
      // based on their answer, either call the bid or the post functions
      console.log(answer);

      if (answer.Menu_Choice === 'Do your want to Exit?') {
        connection.end();
      };
      if (answer.Menu_Choice === 'View all departments?') {
        viewDepartments();
      };
      if (answer.Menu_Choice === 'View all roles?') {
        viewRoles();
      };
      if (answer.Menu_Choice === 'View all employees?') {
        viewEmployees();
      };
      if (answer.Menu_Choice === 'Add a department?') {
        addDepartments();
      };
      if (answer.Menu_Choice === 'Add a role?') {
        deptSelect();
      };

      if (answer.Menu_Choice === 'Add an employee?') {
        roleSelect();
      };
      if (answer.Menu_Choice === 'Update employees role?') {
        updateRole();
      };
      if (answer.Menu_Choice === 'Update manger id?') {
        updateManger();
      };
      if (answer.Menu_Choice === 'View employe by manager') {
        viewbyManager();
      };
      if (answer.Menu_Choice === 'Delete employee') {
        deleteEmployee();
      };
      if (answer.Menu_Choice === 'Delete role') {
        deleteRole();
      };


      if (answer.Menu_Choice === 'Delete employee or role?') {
        inquirer.prompt([
          {
            name: 'Delete_Choice',
            type: 'list',
            message: 'Which record would you like to delete?',
            choices: ['Delete employee', 'Delete role?'],
          }
        ])
          .then((selection) => {
            if (selection.Delete_Choice === 'Delete employee') {
              deleteEmployee();
            };
            if (selection.Delete_Choice === 'Delete role') {
              deleteRole();
            };

          });
      };


    });
};

start();


const viewDepartments = () => {
  connection.query('SELECT * FROM department')
    .then((data) => {
      console.table(data);
      start();

    });
};

const viewRoles = () => {
  connection.query('SELECT * FROM role')
    .then((data) => {
      console.table(data);
      start();
    });
};

const viewEmployees = () => {
  connection.query('SELECT * FROM employee')
    .then((data) => {
      console.table(data);
      start();
    });
};

// Adding new Departments

var questDept = [
  {
    type: 'input',
    name: 'departmentName',
    message: "Enter a new department name",
    validate: validateString,
  },
  {
    type: 'confirm',
    name: 'askAgain',
    message: "Want to add one more?",
    default: true,
  },
];

// Add a department
const addDepartments = () => {
  inquirer.prompt(questDept).then((answers) => {
    // questionDept.push(answers.departmentName);
    if (answers.askAgain) {
      connection.query('INSERT INTO department SET ?',
        {
          dept_name: `${answers.departmentName}`,
        },
        console.table(answers),
      );
      addDepartments();
    } else {
      connection.query('INSERT INTO department SET ?',
        {
          dept_name: `${answers.departmentName}`,
        },
        console.table(answers),
        start(),
      )
    };
  });
};



//Query the department table for the add role function
var deptSelect = () => {
  connection.query('SELECT * FROM department ORDER BY dept_name', (err, res) => {
    if (err) throw err;
    let deptArray = [];
    res.forEach(({ id, dept_name }) => {
      deptArray.push(`${id} ${dept_name}`);
    })
    addRole(deptArray);
  });
};

const addRole = (dept) => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: "Enter a new role",
    },
    {
      type: 'input',
      name: 'salary',
      message: "Enter salary",
    },
    {
      type: 'list',
      name: 'department_id',
      message: "Review department ID",
      choices: [...dept],
    },
    {
      type: 'confirm',
      name: 'askAgain',
      message: "Want to add one more?",
      // default: true,
    },
  ])
    .then((answers) => {
      if (answers.askAgain) {
        const deptKeySplit = answers.department_id.split(' ');
        const deptKey = deptKeySplit[0];
        // const deptName = deptKeySplit[1];
        connection.query('INSERT INTO role SET ?',
          {
            title: `${answers.title}`,
            salary: `${answers.salary}`,
            department_id: `${deptKey}`,
          },
          console.table(answers),
        );
        deptSelect();
      } else {
        const deptKeySplit = answers.department_id.split(' ');
        const deptKey = deptKeySplit[0];
        connection.query('INSERT INTO role SET ?',
          {
            title: `${answers.title}`,
            salary: `${answers.salary}`,
            department_id: `${deptKey}`,
          },
          console.table(answers),
          start(),
        )
      };
    });
};

// Selection a role
var roleSelect = () => {
  connection.query('SELECT * FROM role ORDER BY title', (err, res) => {
    if (err) throw err;
    let roleArray = [];
    res.forEach(({ role_id, title }) => {
      roleArray.push(`${role_id} ${title}`);
    })
    addEmployee(roleArray);
  });
};



const addEmployee = (empl) => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: "Enter first name",
    },
    {
      type: 'input',
      name: 'last_name',
      message: "Enter last name",
    },
    {
      type: 'input',
      name: 'manager_id',
      message: "Enter department ID (max. 3 digets)",
    },
    {
      type: 'list',
      name: 'role_id',
      message: "select Role ID",
      choices: [...empl],
    },
    {
      type: 'confirm',
      name: 'askAgain',
      message: "Want to add one more?",
      defult: true,
    },
  ])
    .then((answers) => {
      if (answers.askAgain) {
        const roleKeySplit = answers.role_id.split(' ');
        const roleKey = roleKeySplit[0];
        connection.query('INSERT INTO employee SET ?',
          {
            first_name: `${answers.first_name}`,
            last_name: `${answers.last_name}`,
            role_id: `${roleKey}`,
            manager_id: `${answers.manager_id}`,
          },
          console.table(answers),
        );
        roleSelect();
      } else {
        const roleKeySplit = answers.role_id.split(' ');
        const roleKey = roleKeySplit[0];
        connection.query('INSERT INTO employee SET ?',
          {
            first_name: `${answers.first_name}`,
            last_name: `${answers.last_name}`,
            role_id: `${roleKey}`,
            manager_id: `${answers.manager_id}`,
          },
          console.table(answers),
          start(),
        )

      };
    });
};

// $+$+$+$+$+$+$+//

//Initiate updateEmployeeRole by query of employees
const updateRole = () => {
  connection.query('SELECT * FROM employee ORDER BY last_name', (err, res) => {
    if (err) throw err;
    let nameArray = [];
    res.forEach(({ employee_id, first_name, last_name, role_id, manager_id }) => {
      nameArray.push(`${first_name} ${last_name} ${employee_id} ${role_id} ${manager_id}`);
    })
    queryRoles(nameArray);
  });
};

//Query roles for updateEmployeeRole function
const queryRoles = (names) => {
  connection.query('SELECT * FROM role ORDER BY title', (err, res) => {
    if (err) throw err;
    let roleArray = [];
    res.forEach(({ role_id, title }) => {
      roleArray.push(`${role_id} ${title}`);
    })
    updateEmployeeRole(names, roleArray);
  });
};

//Update the employee role
const updateEmployeeRole = (names, roles) => {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'name',
        message: "Please select a name:",
        choices: [...names],

      },
      {
        type: 'list',
        name: 'role',
        message: "Please select a role:",
        choices: [...roles],

      },
    ])
    .then((data) => {
      const nameSplit = data.name.split(' ');
      const roleSplit = data.role.split(' ');;
      const employeeKey = nameSplit[2];
      const roleKey = roleSplit[0];
      const query = "UPDATE employee SET ? WHERE ?";
      connection.query(query, [{ role_id: `${roleKey}` }, { employee_id: `${employeeKey}` }], (err, res) => {
        if (err) throw (err);
        viewEmployees();
      })
    });
};

// Update Employee Manager
//Query employee for updateManger function
const updateManger = () => {
  connection.query('SELECT * FROM employee ORDER BY last_name', (err, res) => {
    if (err) throw err;
    let nameArray = [];
    res.forEach(({ employee_id, first_name, last_name, manager_id }) => {                // employee_id, role_id
      nameArray.push(`${employee_id} ${first_name} ${last_name} ${manager_id}`);                   //${employee_id} ${role_id} 
    })
    queryManger(nameArray);
  });
};

const queryManger = (emplList) => {
  connection.query('SELECT * FROM employee ORDER BY last_name', (err, res) => {
    if (err) throw err;
    let mgrIDArray = [];
    res.forEach(({ manager_id }) => {                                                 //employee_id, fitst_name, last_name, 
      mgrIDArray.push(`${manager_id}`);                                            //${employee_id} ${fitst_name} ${last_name} 
    })
    updateMangerID(emplList, mgrIDArray);
  });
};

//Update the manager
const updateMangerID = (emplList, mgridList) => {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'idList',
        message: "Please select a name:",
        choices: [...emplList],
      },
      {
        type: 'list',
        name: 'mgrIDS',
        message: "Please select a manager_id:",
        choices: [...mgridList],

      },
    ])
    .then((data) => {
      const idListSplit = data.idList.split(' ');
      const mgrIDSSplit = data.mgrIDS.split(' ');
      const employeeKey = idListSplit[0];
      const mgrListKey = mgrIDSSplit[0];
      const query = "UPDATE employee SET ? WHERE ?";
      connection.query(query, [{ manager_id: `${mgrListKey}` }, { employee_id: `${employeeKey}` }], (err, res) => {          //, { employee_id: `${employeeKey}` }
        if (err) throw (err);
        viewEmployees();
      })
    });
};

const viewbyManager = () => {
  connection.query('SELECT * FROM employee ORDER BY manager_id')
    .then((data) => {
      console.table(data);
      start();
    });
};

// Delete Employee

// Creating employee array 
const deleteEmployee = () => {
  connection.query('SELECT * FROM employee ORDER BY last_name', (err, res) => {
    if (err) throw err;
    let nameArray = [];
    res.forEach(({ employee_id, first_name, last_name }) => {
      nameArray.push(`${employee_id} ${first_name} ${last_name}`);
    })
    selectEmployees(nameArray);
  });
};

const selectEmployees = (emplList) => {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'idList',
        message: "Please select a name:",
        choices: [...emplList],
      },
    ])
    .then((data) => {
      const idListSplit = data.idList.split(' ');
      const employeeKey = idListSplit[0];
      const query = "DELETE FROM employee WHERE ?";
      connection.query(query, [{ employee_id: `${employeeKey}` }], (err, res) => {
        if (err) throw (err);
        viewEmployees();
      })
    });
};

// Delete Role

// Creating role array 
const deleteRole = () => {
  connection.query('SELECT * FROM role ORDER BY title', (err, res) => {
    if (err) throw err;
    let rolesArray = [];
    res.forEach(({ role_id, title, department_id }) => {
      rolesArray.push(`${role_id} ${title} ${department_id}`);
    })
    selectRole(rolesArray);
  });
};

const selectRole = (rolesList) => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'rolesSelection',
        message: "Please select a role:",
        choices: [...rolesList],
      },
    ])
    .then((data) => {
      const rolesSelectionSplit = data.rolesSelection.split(' ');
      const roleKey = rolesSelectionSplit[0];
      const query = "DELETE FROM role WHERE ?";
      connection.query(query, [{ role_id: `${roleKey}` }], (err, res) => {
        if (err) throw (err);
        viewRoles();
      })
    });
};
