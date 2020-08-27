const Department = require('../department.model.js');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Department', () => {
	before(async () => {
		try {
			// mongod = await MongoMemoryServer.create({ binary: { version: '4.2.6' } });
			const fakeDB = new MongoMemoryServer();
			const uri = await fakeDB.getConnectionString();
			mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 

			// mongod = await MongoMemoryServer.create({ binary: { version: '4.2.6' } });
			// const uri = await mongod.getConnectionString();

			
		} catch(err) {
			console.log(err);
		}
	});
	describe('Reading data', () => {
		before(async () => {
			const testDepOne = new Department({ name: 'Department #1' });
			await testDepOne.save();
			const testDepTwo = new Department({ name: 'Department #2' });
			await testDepTwo.save();
		});
		it('should return all the data with "find" method', async () => {
			// this.timeout(10000);
			const departments = await Department.find();
			const expectedLength = 2;
			expect(departments.length).to.be.equal(expectedLength);
			// done();
		});
		it('should return a proper document by "name" with "findOne" method', async () => {
			// this.timeout(10000);
			const department = await Department.findOne({ name: 'Department #1' });
			const expectedName = 'Department #1';
			expect(department.name).to.be.equal('Department #1');
			// done();
		});
		after(async () => {
			await Department.deleteMany();
		});
	});
});