// first MySQL databse with three tables

const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'yourRootPassword',
  database: 'employee_db',
});

connection.connect();
connection.query = util.promisify(connection.query);


// function which prompts the user for what action they should take
const start = () => {
  inquirer.prompt([
    {
      name: 'Menu_Choice',
      type: 'list',
      // type: 'checkbox': In previous work i applied a check box, which worked well too. Not sure what the benefits of the one over the other are.
      message: 'What would you like to do?',
      choices: ['View all departments?', 'View all roles?', 'View all employees?', 'Add a department?', 'Add a role?', 'Add an employee?', 'Update employees?'],
    }
  ])
    .then((answer) => {
      // based on their answer, either call the bid or the post functions
      console.log(answer);

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
        addRole();
      };
      if (answer.Menu_Choice === 'Add an employee?') {
        addEmployee();
      };


      // continue all "if" for all promps ... 

    });
};

start();

const viewDepartments = () => {
  connection.query('SELECT * FROM department')
    .then((data) => {
      console.table(data);
    });
};

const viewRoles = () => {
  connection.query('SELECT * FROM role')
    .then((data) => {
      console.table(data);
    });
};

const viewEmployees = () => {
  connection.query('SELECT * FROM employee')
    .then((data) => {
      console.table(data);
    });
};

// Adding new Departments

var questDept = [
  {
    type: 'input',
    name: 'departmentName',
    message: "Enter a new department name",
  },
  {
    type: 'confirm',
    name: 'askAgain',
    message: "Want to add one more?",
    defult: true,
  },
];


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
      )

    };
  });
};

// Adding new Role

var questRole = [
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
    type: 'input',
    name: 'department_id',
    message: "Enter department ID",
  },
  {
    type: 'confirm',
    name: 'askAgain',
    message: "Want to add one more?",
    defult: true,
  },
];

const addRole = () => {
  inquirer.prompt(questRole).then((answers) => {
    if (answers.askAgain) {
      connection.query('INSERT INTO role SET ?',
        {
          title: `${answers.title}`,
          salary: `${answers.salary}`,
          department_id: `${answers.department_id}`,
        },
        console.table(answers),
      );
      addRoles();
    } else {
      connection.query('INSERT INTO role SET ?',
        {
          title: `${answers.title}`,
          salary: `${answers.salary}`,
          department_id: `${answers.department_id}`,
        },
        console.table(answers),
      )

    };
  });
};

// Adding new Employee

var questEmployee = [
  {
    type: 'input',
    name: 'first_name',
    message: "Enter first name",
  },
  {
    type: 'input',
    name: 'last_name',
    message: "Enter salary",
  },
  {
    type: 'input',
    name: 'manager_id',
    message: "Enter department ID",
  },
  {
    name: 'dept_choices',
  //   // type: 'list',
    type: 'checkbox', //In previous work i applied a check box, which worked well too. Not sure what the benefits of the one over the other are.
    message: 'Select a department',
    choices: connection.query('SELECT id, dept_name FROM department)
// ['View all departments?', 'View all roles?', 'View all employees?', 'Add a department?', 'Add a role?', 'Add an employee?', 'Update employees?'],
  },

  {
    type: 'confirm',
    name: 'askAgain',
    message: "Want to add one more?",
    defult: true,
  },
];

const addEmployee = () => {
  inquirer.prompt(questEmployee).then((answers) => {
    if (answers.askAgain) {
      connection.query('INSERT INTO employee SET ?',
        {
          first_name: `${answers.first_name}`,
          last_name: `${answers.last_name}`,
          manager_id: `${answers.manager_id}`,
        },
        console.table(answers),
      );
      addEmployee();
    } else {
      connection.query('INSERT INTO role SET ?',
        {
          first_name: `${answers.first_name}`,
          last_name: `${answers.last_name}`,
          manager_id: `${answers.manager_id}`,
        },
        console.table(answers),
        // connection.end(),

      )

    };
  });
};



// *+*+*+*+*+* GOOD CODE DON'T DELETE *+*+*+*+*+*+*
// Adding Department
// function addDepartments() {
//   inquirer.prompt(questDept).then((answers) => {
//     // questionDept.push(answers.departmentName);
//     if (answers.askAgain) {
//       connection.query('INSERT INTO department SET ?',
//         {
//           dept_name: `${answers.departmentName}`,
//         },
//         console.table(answers),
//       );
//       addDepartments();
//     } else {
//       connection.query('INSERT INTO department SET ?',
//         {
//           dept_name: `${answers.departmentName}`,

//         },
//         console.table(answers),
//       )

//     };
//   });
// };
// *+*+*+*+*+*+*+*+*+*+*+*+*+*

// *+*+*+*+*+* GOOD CODE DON'T DELETE *+*+*+*+*+*+*
// Adding Department
// function addDepartments() {
//   inquirer.prompt(questDept).then((answers) => {
//     questionDept.push(answers.departmentName);
//     connection.query('INSERT INTO department SET ?',
//     {
//       dept_name: `${questionDept}`,

//     }, 
//      console.table(answers),
//     )},

//   )};
// *+*+*+*+*+*+*+*+*+*+*+*+*+*


      // if (answers.askAgain) {
      //   addDepartments();
      // } else {
      //   connection.query('INSERT INTO department SET ?',
      //   {
      //     dept_name: `${departmentName}`,
      //   },
      //   )};
      //   console.table(data);

//   });
// };

// console.log(query.sql);


// const addDepartments = () => {
//   inquirer.prompt([
//     {
//       type: 'input',
//       name: 'departmentName',
//       message: "Enter a new department name",
//     },   
//     {
//       type: 'confirm',
//       name: 'question',
//       message: "Want to add one more?",
//       defult: true,
//     },

//   ])
//     .then((answers) => {
//       const departments = new Department(answers.departmentName)
//       connection.query('INSERT INTO department SET ?',
//         {
//           dept_name: `${departments}`,
//         },
//         // console.log(departments),
//         // // team.push(manager)
//         // if (answer.question) {
//         //     start() 
//         // }
//         // else {
//         //  const query = connection.query('INSERT INTO department SET ?',
//         (err, res) => {
//           if (err) throw err;
//           console.log(`Department added in row ${res.affectedRows} \n`);
//           // Call updateProduct AFTER the INSERT completes
//           // updateDepartment();
//           console.table(data);
//         }
//       );
//     });





  // console.log('Add a department ...\n');
  // .then((data) => {
  // const createProduct = () => {
  // console.log('Inserting a new product...\n');

  // logs the actual query being run
//   console.log(query.sql);
// };




// console.table(data);

// Connect to the DB
// connection.connect((err) => {
//   if (err) throw err;
//   console.log(`connected as id ${connection.threadId}\n`);
//   addDepartments();
// });

      // display list of employees to select the one that shall be deleted.

      // call start function when all prompts are completed to start the queries again
      // connection.query ('SELECT * FROM employee')
      // .then((data) => {
      // console.table(data); do not the table but a new inquirer to select employee to be deleted.






// // function to handle posting new items up for auction
// const postAuction = () => {
//   // prompt for info about the item being put up for auction
//   inquirer.prompt([
//       {
//         name: 'item',
//         type: 'input',
//         message: 'What is the item you would like to submit?',
//       },
//       {
//         name: 'category',
//         type: 'input',
//         message: 'What category would you like to place your auction in?',
//       },
//       {
//         name: 'startingBid',
//         type: 'input',
//         message: 'What would you like your starting bid to be?',
//         validate(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         },
//       },
//     ])
//     .then((answer) => {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         'INSERT INTO auctions SET ?',
//         // QUESTION: What does the || 0 do?
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid || 0,
//           highest_bid: answer.startingBid || 0,
//         },
//         (err) => {
//           if (err) throw err;
//           console.log('Your auction was created successfully!');
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );