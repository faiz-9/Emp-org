interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
  }
  
  interface IEmployeeOrgApp {
    ceo: Employee;
    move(employeeID: number, supervisorID: number): void;
    undo(): void;
    redo(): void;
  }
  
  class EmployeeOrgApp implements IEmployeeOrgApp {
    private history: {
      move: { employeeID: number; supervisorID: number | null}[];
      undo: { employeeID: number; supervisorID: number | null}[];
    };
    public ceo: Employee;
  
    constructor(ceo: Employee) {
      this.history = {
        move: [],
        undo: [],
      };
      this.ceo = ceo;
    }


 move(employeeID, supervisorID) {
    const employee = this.findEmployee(this.ceo, employeeID);
    const newSupervisor = this.findEmployee(this.ceo, supervisorID);

    if (!employee || !newSupervisor) {
        throw new Error('Invalid employee or supervisor ID');
    }

    // Find the old supervisor of the employee
    let oldSupervisor = null;
    for (const subordinate of this.ceo.subordinates) {
        oldSupervisor = this.findEmployee(subordinate, employeeID);
        if (oldSupervisor) {
            break;
        }
    }

    // Store the current state for undo operation
    this.history.undo.push({
        employeeID,
        oldSupervisorID: oldSupervisor ? oldSupervisor.uniqueId : null,
        newSupervisorID: newSupervisor.subordinates.length > 0 ? newSupervisor.subordinates[0].uniqueId : null,
    });

    // Remove employee from old supervisor's subordinates
    if (oldSupervisor) {
        oldSupervisor.subordinates = oldSupervisor.subordinates.filter(subordinate => subordinate.uniqueId !== employeeID);
    }

    // Add employee to new supervisor's subordinates
    newSupervisor.subordinates.push(employee);

    // Store the move action in history
    this.history.move.push({ employeeID, oldSupervisorID: oldSupervisor ? oldSupervisor.uniqueId : null, newSupervisorID: supervisorID });
}


    undo(): void {
      const lastMove = this.history.move.pop();
      if (lastMove) {
        const { employeeID, supervisorID } = lastMove;
        const employee = this.findEmployee(this.ceo, employeeID);
        const supervisor = this.findEmployee(this.ceo, supervisorID);
  
        if (!employee || !supervisor) {
          throw new Error('Invalid employee or supervisor ID');
        }
  
        // Store the current state for redo operation
        this.history.undo.push({
          employeeID,
          supervisorID: employee.subordinates.length > 0 ? employee.subordinates[0].uniqueId : null,
        });
  
        // Move the employee back to the previous supervisor
        supervisor.subordinates = supervisor.subordinates.filter((subordinate) => subordinate.uniqueId !== employeeID);
        employee.subordinates = [];
  
        // Store the undo action in history
        this.history.undo.push({ employeeID, supervisorID: supervisorID });
      }
    }
  
    redo(): void {
      const lastUndo = this.history.undo.pop();
      if (lastUndo) {
        const { employeeID, supervisorID } = lastUndo;
        const employee = this.findEmployee(this.ceo, employeeID);
        const supervisor = this.findEmployee(this.ceo, supervisorID);
  
        if (!employee || !supervisor) {
          throw new Error('Invalid employee or supervisor ID');
        }
  
        // Store the current state for undo operation
        this.history.move.push({
          employeeID,
          supervisorID: employee.subordinates.length > 0 ? employee.subordinates[0].uniqueId : null,
        });
  
        // Move the employee back to the previous supervisor
        employee.subordinates = [];
        supervisor.subordinates.push(employee);
        employee.subordinates = [];
  
        // Store the redo action in history
        this.history.undo.push({ employeeID, supervisorID });
      }
    }
  
    private findEmployee(employee: Employee, employeeID: number | null): Employee | undefined {
      if (employee.uniqueId === employeeID) {
        return employee;
      }
  
      for (const subordinate of employee.subordinates) {
        const foundEmployee = this.findEmployee(subordinate, employeeID);
        if (foundEmployee) {
          return foundEmployee;
        }
      }
  
      return undefined;
    }
  }



const ceo: Employee = { uniqueId: 1, name: 'John Smith', 
subordinates: [ { uniqueId: 2, name: 'Margot Donald', subordinates: [ { uniqueId: 3, name: 'Cassandra Reynolds', subordinates: [] },
 { uniqueId: 4, name: 'Mary Blue', subordinates: [] }, 
 { uniqueId: 5, name: 'Bob Saget', subordinates: [] },
  { uniqueId: 6, name: 'Tina Teff', subordinates: [] },
   { uniqueId: 7, name: 'Will Turner', subordinates: [] } ] }, 
   { uniqueId: 8, name: 'Tyler Simpson',
    subordinates: [ { uniqueId: 9, name: 'Harry Tobs', subordinates: [] },
    { uniqueId: 10, name: 'Thomas Brown', subordinates: [] },
     { uniqueId: 11, name: 'George Carrey', subordinates: [] }, 
     { uniqueId: 12, name: 'Gary Styles', subordinates: [] },
      { uniqueId: 13, name: 'Ben Willis', subordinates: [] },
       { uniqueId: 14, name: 'Georgina Flangy', subordinates: [] }, 
       { uniqueId: 15, name: 'Sophie Turner', subordinates: [] } ] } ] };
const app = new EmployeeOrgApp(ceo); // Move an employee to a new supervisor app.move(5, 14);
// console.log(JSON.stringify(app.ceo, null, 2));
app.move(5,14);
console.log(JSON.stringify(app.ceo, null, 2));


// console.log(JSON.stringify(app.ceo, null, 2));
// app.undo();
// console.log(JSON.stringify(app.ceo, null, 2));
// app.redo();
//  console.log(JSON.stringify(app.ceo, null, 2));
