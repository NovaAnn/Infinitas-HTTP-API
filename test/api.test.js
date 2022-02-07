const chai = require('chai');
const expect = chai.expect;
const url = `http://localhost:4000`;
const request = require('supertest')(url);

describe('GraphQL', () => {
  it(' Test getMyRequests with status not specified', (done) => {
    request
      .post('/graphql')
      .send({
        query:
          '{ getMyRequests(workerId:"61fc0c93245c1349933adb88"){Requests{  resolvedBy status id workerId startDate endDate  }}  }',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.getMyRequests).to.have.property('Requests');
        const [result] = res.body.data.getMyRequests.Requests;
        expect(result).to.have.property('resolvedBy');
        expect(result).to.have.property('status');
        expect(result).to.have.property('startDate');
        expect(result).to.have.property('endDate');
        expect(result).to.have.property('id');
        expect(result).to.have.property('workerId');
        expect(res.body.data.getMyRequests.Requests).to.deep.include({
          resolvedBy: 'Nova',
          status: 'APPROVED',
          id: '61fc286b3cda2c27c0087a4d',
          workerId: '61fc0c93245c1349933adb88',
          startDate: 'Tue Feb 01 2022',
          endDate: 'Mon Feb 07 2022',
        });
        expect(res.body.data.getMyRequests.Requests).to.deep.include({
          resolvedBy: 'Nova',
          status: 'REJECTED',
          id: '61fc4845778366fcfba495bb',
          workerId: '61fc0c93245c1349933adb88',
          startDate: 'Sat Jan 15 2022',
          endDate: 'Wed Jan 19 2022',
        });
        done();
      });
  });
  it(' Test getMyRequests with status specified', (done) => {
    request
      .post('/graphql')
      .send({
        query:
          '{ getMyRequests(workerId:"61fc0c93245c1349933adb88",status:"Approved"){Requests{  resolvedBy status id workerId startDate endDate  }}  }',
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        expect(res.body.data.getMyRequests).to.have.property('Requests');
        const [result] = res.body.data.getMyRequests.Requests;
        expect(result).to.have.property('resolvedBy');
        expect(result).to.have.property('status');
        expect(result).to.have.property('startDate');
        expect(result).to.have.property('endDate');
        expect(result).to.have.property('id');
        expect(result).to.have.property('workerId');
        expect(res.body.data.getMyRequests.Requests).to.deep.include({
          resolvedBy: 'Nova',
          status: 'APPROVED',
          id: '61fc286b3cda2c27c0087a4d',
          workerId: '61fc0c93245c1349933adb88',
          startDate: 'Tue Feb 01 2022',
          endDate: 'Mon Feb 07 2022',
        });
        done();
      });
  });
  it(' Test getLeaves', (done) => {
    request
      .post('/graphql')
      .send({ query: '{ getLeaves(workerId:"61fc0c93245c1349933adb88")}' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  it(' Test createRequest', (done) => {
    request
      .post('/graphql')
      .send({
        query:
          ' mutation { createRequest(workerId:"61fc0c93245c1349933adb88",startDate:"2022-03-15",endDate:"2022-03-20") }',
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        const result = res.body.data.createRequest;
        expect(result).to.equal(true);

        done();
      });
  });
  it(' Test getMyWorklistRequests with status specified', (done) => {
    request
      .post('/graphql')
      .send({
        query:
          '{ getMyWorklistRequests(managerId:"61fc0556a2869e9b59cf0c0c",status:"Pending"){items{ id employeeName managerId status startDate endDate createdAt  }}  }',
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        expect(res.body.data.getMyWorklistRequests).to.have.property('items');
        const [result] = res.body.data.getMyWorklistRequests.items;
        expect(result).to.have.property('id');
        expect(result).to.have.property('status');
        expect(result).to.have.property('employeeName');
        expect(result).to.have.property('startDate');
        expect(result).to.have.property('endDate');
        expect(result).to.have.property('createdAt');
        expect(res.body.data.getMyWorklistRequests.items).to.deep.include({
          id: '61fc1091f926191c70ccdd69',
          employeeName: 'Bhanu',
          status: 'PENDING',
          managerId: '61fc0556a2869e9b59cf0c0c',
          startDate: 'Sun Jan 02 2022',
          endDate: 'Wed Jan 05 2022',
          createdAt: 'Thu Feb 03 2022',
        });
        expect(res.body.data.getMyWorklistRequests.items).to.deep.include({
          id: '61fc49059febc377b3ecea51',
          employeeName: 'Bhanu',
          status: 'PENDING',
          managerId: '61fc0556a2869e9b59cf0c0c',
          startDate: 'Sat Jan 15 2022',
          endDate: 'Wed Jan 19 2022',
          createdAt: 'Thu Feb 03 2022',
        });
        expect(res.body.data.getMyWorklistRequests.items).to.not.deep.include({
          id: '61fc4845778366fcfba495bb',
          employeeName: 'Bhanu',
          status: 'REJECTED',
          managerId: '61fc0556a2869e9b59cf0c0c',
          startDate: 'Sat Jan 15 2022',
          endDate: 'Wed Jan 19 2022',
          createdAt: 'Thu Feb 03 2022',
        });

        done();
      });
  });
  it(' Test getMyWorklistRequests with status not specified', (done) => {
    request
      .post('/graphql')
      .send({
        query:
          '{ getMyWorklistRequests(managerId:"61fc0556a2869e9b59cf0c0c"){items{ id employeeName managerId status startDate endDate createdAt  }}  }',
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        expect(res.body.data.getMyWorklistRequests).to.have.property('items');
        const [result] = res.body.data.getMyWorklistRequests.items;
        expect(result).to.have.property('id');
        expect(result).to.have.property('status');
        expect(result).to.have.property('employeeName');
        expect(result).to.have.property('startDate');
        expect(result).to.have.property('endDate');
        expect(result).to.have.property('createdAt');
        expect(res.body.data.getMyWorklistRequests.items).to.deep.include({
          id: '61fc1091f926191c70ccdd69',
          employeeName: 'Bhanu',
          status: 'PENDING',
          managerId: '61fc0556a2869e9b59cf0c0c',
          startDate: 'Sun Jan 02 2022',
          endDate: 'Wed Jan 05 2022',
          createdAt: 'Thu Feb 03 2022',
        });
        expect(res.body.data.getMyWorklistRequests.items).to.deep.include({
          id: '61fc49059febc377b3ecea51',
          employeeName: 'Bhanu',
          status: 'PENDING',
          managerId: '61fc0556a2869e9b59cf0c0c',
          startDate: 'Sat Jan 15 2022',
          endDate: 'Wed Jan 19 2022',
          createdAt: 'Thu Feb 03 2022',
        });
        expect(res.body.data.getMyWorklistRequests.items).to.deep.include({
          id: '61fc4845778366fcfba495bb',
          employeeName: 'Bhanu',
          status: 'REJECTED',
          managerId: '61fc0556a2869e9b59cf0c0c',
          startDate: 'Sat Jan 15 2022',
          endDate: 'Wed Jan 19 2022',
          createdAt: 'Thu Feb 03 2022',
        });

        done();
      });
  });

  it(' Test seeMyEmployees', (done) => {
    request
      .post('/graphql')
      .send({
        query:
          '{ seeMyEmployees(managerId:"61fc0556a2869e9b59cf0c0c"){employees{  name leavesRemaining requests {status startDate} }}  }',
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        expect(res.body.data.seeMyEmployees).to.have.property('employees');
        const [result] = res.body.data.seeMyEmployees.employees;
        expect(result).to.have.property('name');
        expect(result).to.have.property('leavesRemaining');
        expect(result).to.have.property('requests');
        // expect(res.body.data.seeMyEmployees.employees).to.deep.include({
        //   name: 'Bhanu',
        //   leavesRemaining: 0,
        //   requests: [{ status: 'PENDING', startDate: 'Sat Jan 15 2022' }],
        // });
        done();
      });
  });
  it(' Test seeSingleEmployee', (done) => {
    request
      .post('/graphql')
      .send({
        query:
          '{ seeSingleEmployee(managerId:"61fc0556a2869e9b59cf0c0c",workerId:"61fc0c93245c1349933adb88"){ employeeId name leavesRemaining requests {status startDate endDate createdAt} }}  ',
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        expect(res.body.data.seeSingleEmployee).to.have.property('employeeId');
        expect(res.body.data.seeSingleEmployee).to.have.property('name');
        expect(res.body.data.seeSingleEmployee).to.have.property(
          'leavesRemaining'
        );
        expect(res.body.data.seeSingleEmployee.name).to.equal('Bhanu');
        done();
      });
  });
  it(' Test getOverlappingRequests', (done) => {
    request
      .post('/graphql')
      .send({
        query:
          '{ getOverlappingRequests(managerId:"61fc0556a2869e9b59cf0c0c"){overlapArray{ requestId employeeName employeeId startDate endDate createdAt  }} }',
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        expect(res.body.data.getOverlappingRequests).to.have.property(
          'overlapArray'
        );
        const [result] = res.body.data.getOverlappingRequests.overlapArray;
        expect(result).to.have.property('requestId');
        expect(result).to.have.property('employeeName');
        expect(result).to.have.property('employeeId');
        expect(result).to.have.property('startDate');
        expect(result).to.have.property('endDate');
        expect(result).to.have.property('createdAt');

        expect(
          res.body.data.getOverlappingRequests.overlapArray
        ).to.deep.include({
          requestId: '61fc48befa984b62a7dbb78e',
          employeeName: 'Bhanu',
          employeeId: '61fc0c93245c1349933adb88',
          startDate: 'Thu Jan 13 2022',
          endDate: 'Wed Jan 19 2022',
          createdAt: 'Thu Feb 03 2022',
        });
        expect(
          res.body.data.getOverlappingRequests.overlapArray
        ).to.deep.include({
          requestId: '61fc49059febc377b3ecea51',
          employeeName: 'Bhanu',
          employeeId: '61fc0c93245c1349933adb88',
          startDate: 'Sat Jan 15 2022',
          endDate: 'Wed Jan 19 2022',
          createdAt: 'Thu Feb 03 2022',
        });
        done();
      });
  });

  it(' Test processRequest', (done) => {
    request
      .post('/graphql')
      .send({
        query:
          ' mutation { processRequest(managerId:"61fc0556a2869e9b59cf0c0c",requestId:"61fc1091f926191c70ccdd69",status:"APPROVED")}',
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        const result = res.body.data.processRequest;
        expect(result).to.equal(true);

        done();
      });
  });
  it(' Test createRequest', (done) => {
    request
      .post('/graphql')
      .send({
        query:
          ' mutation { createRequest(workerId:"61fc0c93245c1349933adb88",startDate:"2022-03-15",endDate:"2022-03-20") }',
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        const result = res.body.data.createRequest;
        expect(result).to.equal(true);

        done();
      });
  });
});
