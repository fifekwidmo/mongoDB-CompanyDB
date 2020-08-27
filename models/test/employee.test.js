const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
	it('should throw an error if some of args are null', () => {
		const emp1 = new Employee({ firstName: 'John', lastName: 'Bon' });
		const emp2 = new Employee({ firstName: 'John', department: 'Jovi' });
		const emp3 = new Employee({ lastName: 'Bon', department: 'Jovi' })
		const cases = [emp1, emp2, emp3]
		for (let emp of cases) {
				emp.validate(err => {
						expect(err.errors).to.exist;
				});
		}
	});
	it('should throw an error if args are not a string', () => {
		const emp1 = new Employee({ firstName: 'John', lastName: {}, department: 'Jovi' });
		const emp2 = new Employee({ firstName: [], lastName: 'Bon', department: undefined });
		const emp3 = new Employee({ firstName: undefined, lastName: 'Bon', department: 'Jovi' })
		const emp4 = new Employee({ firstName: 'John', lastName: 'Bon', department: [] })
		const emp5 = new Employee({ firstName: null, lastName: 'Bon', department: {} })
		const cases = [emp1, emp2, emp3, emp4, emp5]
		for (let emp of cases) {
			emp.validate(err => {
					expect(err.errors).to.exist;
		});
	}
	});
	it('should not throw an error if args are correct', () => {
		const emp1 = new Employee({ firstName: 'John', lastName: 'Bon', department: 'Jovi' });
		const emp2 = new Employee({ firstName: 'Van', lastName: 'der', department: 'Sar' });
		const emp3 = new Employee({ firstName: 'Robin', lastName: 'van', department: 'Persie' })
		const emp4 = new Employee({ firstName: 'Leo', lastName: 'ben', department: 'Training' })
		const cases = [emp1, emp2, emp3, emp4]
		for (let emp of cases) {
			emp.validate(err => {
					expect(err).not.to.exist;
			});
		}
	});
	after(() => {
		mongoose.models = {};
	});
});
