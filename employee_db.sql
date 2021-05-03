DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NULL,
  PRIMARY KEY (id)
  );

CREATE TABLE role(
  role_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary INT NOT NULL,
  department_id INT NOT NULL,
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id)
);

CREATE TABLE employee(
  employee_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (employee_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE CASCADE
);




SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
