'SELECT employees.id, employees.first_name, employees.last_name, role.title AS department, role.salary, CONCAT (employees.first_name, " ", employees.last_name) AS manager  FROM employees JOIN role ON role.id = employees.role_id'