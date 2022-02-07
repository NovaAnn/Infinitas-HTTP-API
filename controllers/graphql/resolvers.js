const Request = require('../models/request');
const Worker = require('../models/worker');
const Manager = require('../models/manager');

module.exports = {
  createManager: async function ({ name, dob }, req) {
    const manager = new Manager({
      name: name,
      dateOfBirth: dob,
    });

    await manager.save();
    return true;
  },
  createWorker: async function ({ name, leavesRemaining, managerId }, req) {
    const manager = await Manager.findById(managerId);
    if (!manager) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }

    const worker = new Worker({
      name: name,
      manager: manager,
    });
    if (leavesRemaining) {
      worker.leavesRemaining = leavesRemaining;
    }

    await worker.save();
    return true;
  },
  createRequest: async function ({ workerId, startDate, endDate }, req) {
    const worker = await Worker.findById(workerId);
    if (!worker) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }
    if (!worker.leavesRemaining > 0) {
      const error = new Error('You dont have enough leaves');
      error.code = 201;
      throw error;
    }

    const request = new Request({
      workerId: worker,
      startDate: startDate,
      endDate: endDate,
      managerId: worker.manager,
    });
    const createdRequest = await request.save();

    worker.leavesRemaining = worker.leavesRemaining - 1;
    worker.requests.push({ requestId: createdRequest._id });

    await worker.save();
    return true;
  },

  getMyRequests: async function ({ workerId, status }, req) {
    let requests;
    if (!status) {
      requests = await Request.find({ workerId: workerId });
    } else {
      requests = await Request.find({
        workerId: workerId,
        status: status.toUpperCase(),
      });
    }

    const worker = await Worker.findById(workerId);
    const manager = await Manager.findById(worker.manager);

    if (!requests) {
      const error = new Error('No requests found for the worker');
      error.code = 200;
      throw error;
    }

    const requestArray = requests.map((req) => {
      return {
        id: req._id.toString(),
        workerId: req.workerId.toString(),
        startDate: req.startDate.toString().substring(0, 15),
        createdAt: req.createdAt.toString().substring(0, 15),
        endDate: req.endDate.toString().slice(0, 15),
        status: req.status,
        resolvedBy: manager.name,
      };
    });

    return { Requests: requestArray };
  },

  getLeaves: async function ({ workerId }, req) {
    const worker = await Worker.findById(workerId);
    return worker.leavesRemaining;
  },
  getMyWorklistRequests: async function ({ managerId, status }, req) {
    let worklistRequests;

    if (!status) {
      worklistRequests = await Request.find({ managerId: managerId }).populate('workerId');
    } else {
      worklistRequests = await Request.find({
        managerId: managerId,
        status: status.toUpperCase(),
      }).populate('workerId');
    }
    console.log(worklistRequests);
    if (!worklistRequests || (worklistRequests && worklistRequests.length < 1) ) {
      const error = new Error('No items on your worklist');
      error.code = 200;
      throw error;
    }

    const worklistArray = worklistRequests.map((req) => {
      return {
        id: req._id.toString(),
        managerId: req.managerId.toString(),
        startDate: req.startDate.toString().substring(0, 15),
        createdAt: req.createdAt.toString().substring(0, 15),
        endDate: req.endDate.toString().slice(0, 15),
        status: req.status,
        employeeName: req.workerId.name,
      };
    });

    return { items: worklistArray };
  },
  seeMyEmployees: async function ({ managerId }, req) {
    const employees = await Worker.find({ managerId: managerId })
      .populate('requests.requestId')
      .populate('manager');

    if (!employees) {
      const error = new Error('No employees under you/ You are not a manager');
      error.code = 200;
      throw error;
    }

    const employeeArray = employees.map((emp) => {
      const requestArray = emp.requests.map((req) => {
        return {
          id: req.requestId._id.toString(),
          workerId: req.requestId.workerId.toString(),
          startDate: req.requestId.startDate.toString().substring(0, 15),
          createdAt: req.requestId.createdAt.toString().substring(0, 15),
          endDate: req.requestId.endDate.toString().slice(0, 15),
          status: req.requestId.status,
          resolvedBy: emp.manager.name,
        };
      });

      return {
        employeeId: emp._id.toString(),
        requests: requestArray,
        leavesRemaining: emp.leavesRemaining,
        name: emp.name,
      };
    });

    return { employees: employeeArray };
  },
  seeSingleEmployee: async function ({ managerId, workerId }, req) {
    const employee = await Worker.findOne({
      managerId: managerId,
      workerId: workerId,
    }).populate('requests.requestId').populate('manager');

    if (!employee) {
      const error = new Error(
        'Employee doesnt exist/ You are not their manager'
      );
      error.code = 200;
      throw error;
    }

    const requestArray = employee.requests.map((req) => {
      return {
        id: req.requestId._id.toString(),
        workerId: req.requestId.workerId.toString(),
        startDate: req.requestId.startDate.toString().substring(0, 15),
        createdAt: req.requestId.createdAt.toString().substring(0, 15),
        endDate: req.requestId.endDate.toString().slice(0, 15),
        status: req.requestId.status,
        resolvedBy: employee.manager.name,
      };
    });

    const indEmployee = {
      employeeId: employee._id.toString(),
      requests: requestArray,
      leavesRemaining: employee.leavesRemaining,
      name: employee.name,
    };

    return indEmployee;
  },
  getOverlappingRequests: async function ({ managerId }, req) {
    const requests = await Request.find({
      managerId: managerId,
      status: 'PENDING',
    }).populate('workerId');

    if (!requests) {
      const error = new Error(
        'No items on your worklist/You are not a manager'
      );
      error.code = 200;
      throw error;
    }

    const datesArray = requests.map((req, index) => {
      const startEndDate = [
        new Date(req.startDate.toISOString()).getTime(),
        new Date(req.endDate.toISOString()).getTime(),
        index,
      ];
      return startEndDate;
    });

    const sorted = datesArray.sort((a, b) => {
      return a[0] - b[0];
    });
    let overlapIndex = [];
    let maxDate;
    sorted.forEach((dates, ind, array) => {
      if (ind == 0) {
        maxDate = dates[1];
        dates[1] > array[ind + 1][0] ? overlapIndex.push(dates[2]) : '';
      }
      if (ind > 0 && ind < array.length - 1) {
        if (dates[0] <= maxDate || dates[1] > array[ind + 1][0]) {
          overlapIndex.push(dates[2]);
          maxDate < dates[1] ? (maxDate = dates[1]) : '';
        }
      }
      if (ind + 1 == array.length) {
        if (dates[0] <= maxDate) {
          overlapIndex.push(dates[2]);
        }
      }
    });

    let overlapArray = [];

    requests.forEach((req, indx) => {
      if (overlapIndex.includes(indx)) {
        overlapArray.push({
          requestId: req._id,
          employeeName: req.workerId.name,
          employeeId: req.workerId._id,
          startDate: req.startDate.toString().substring(0, 15),
          endDate: req.endDate.toString().substring(0, 15),
          createdAt: req.createdAt.toString().substring(0, 15),
        });
      }
    });

    return { overlapArray };
  },

  processRequest: async function ({ managerId, requestId, status }, req) {
    const request = await Request.findOne({
      _id: requestId,
      managerId: managerId,
      status: 'PENDING',
    });

    if (!request) {
      const error = new Error('No such pending request found on your worklist');
      error.code = 200;
      throw error;
    }

    request.status = status.toUpperCase();
    await request.save();

    return true;
  },
};
