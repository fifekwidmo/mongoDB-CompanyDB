const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {
	before(async () => {
		try {
			const fakeDB = await MongoMemoryServer.create({ binary: { version: '4.2.6' } });
			const uri = await fakeDB.getConnectionString();
			mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 
		} catch(err) {
			console.log(err);
		}
	});
	describe('Reading data', () => {
		before(async () => {
			const firstEmployee = new Employee({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			await firstEmployee.save();
			const secondEmployee = new Employee({ firstName: 'Leo', lastName: 'Terry', department: 'IT' });
			await secondEmployee.save();
		});
		it('should return all the data with "find" method', async () => {
			const firstEmployee = new Employee({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			await firstEmployee.save();
			const secondEmployee = new Employee({ firstName: 'Leo', lastName: 'Terry', department: 'IT' });
			await secondEmployee.save();
			const employees = await Employee.find();
			const expectedLength = 2;
			expect(employees.length).to.be.equal(expectedLength);
		});
		it('should return a proper document by "name" with "findOne" method', async () => {
			const employee = await Employee.findOne({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			const expectedFirstName = 'John';
			const expectedLastName = 'Bon';
			const expectedDepartment = 'Marketing';
			expect(employee.firstName).to.be.equal(expectedFirstName);
			expect(employee.lastName).to.be.equal(expectedLastName);
			expect(employee.department).to.be.equal(expectedDepartment);
		});
		after(async () => {
			await Employee.deleteMany();
		});
	});
	describe('Creating data', () => {
		it('should insert new document with "insertOne" method', async () => {
			const employee  = new Employee({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			await employee.save();
			const savedEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			expect(savedEmployee).to.not.be.null;
		});
		after(async () => {
			await Employee.deleteMany();
		});
	});
	describe('Updating data', () => {
		beforeEach(async () => {
			const firstEmployee = new Employee({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			await firstEmployee.save();
			const secondEmployee = new Employee({ firstName: 'Leo', lastName: 'Terry', department: 'IT' });
			await secondEmployee.save();
		});
		it('should properly update one document with "updateOne" method', async () => {
			await Employee.updateOne({ firstName: 'John', lastName: 'Bon', department: 'Marketing' }, { $set: { firstName: 'Leo', lastName: 'Terry', department: 'IT' } });
			const updatedEmployee = await Employee.findOne({ firstName: 'Leo', lastName: 'Terry', department: 'IT' });
			expect(updatedEmployee).to.not.be.null;
		});	
		it('should properly update one document with "save" method', async () => {
			const employee = await Employee.findOne({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			employee.firstName = 'Leo';
			await employee.save();
			const updatedEmployee = await Employee.findOne({ firstName: 'Leo', lastName: 'Bon', department: 'Marketing' });
			expect(updatedEmployee).to.not.be.null;
		});
		it('should properly update multiple documents with "updateMany" method', async () => {
			await Employee.updateMany({}, { $set: { firstName: 'Updated!' }});
			const employees = await Employee.find({ firstName: 'Updated!' });
			expect(employees.length).to.be.equal(2);
		});
		afterEach(async () => {
			await Employee.deleteMany();
		});
	});
	describe('Removing data', () => {
		beforeEach(async () => {
			const firstEmployee = new Employee({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			await firstEmployee.save();
			const secondEmployee = new Employee({ firstName: 'Leo', lastName: 'Terry', department: 'IT' });
			await secondEmployee.save();
		});
		it('should properly remove one document with "deleteOne" method', async () => {
			await Employee.deleteOne({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			const deletedEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			expect(deletedEmployee).to.be.null;
		});
		it('should properly remove one document with "remove" method', async () => {
			const employee = await Employee.findOne({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			await employee.remove();
			const removedEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Bon', department: 'Marketing' });
			expect(removedEmployee).to.be.null;
		});
		it('should properly remove multiple documents with "deleteMany" method', async () => {
			await Employee.deleteMany();
			const employees = await Employee.find();
			expect(employees.length).to.be.equal(0);
		});
		afterEach(async () => {
			await Employee.deleteMany();
		});
});

});