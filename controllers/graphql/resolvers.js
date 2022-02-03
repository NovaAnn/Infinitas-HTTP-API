const Request = require("../models/request");
const Worker = require("../models/worker");
const Manager = require("../models/manager");


module.exports = {
  createManager: async function ({ name,dob }, req) {
   console.log(name);
    const manager = new Manager({
      name: name,
      dateOfBirth: dob,
    });

    await manager.save();
    return true;
  },
  createWorker: async function ({ name,leavesRemaining,managerId }, req) {
     const manager = await Manager.findById(managerId);
     console.log(manager);
     if (!manager) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }
    
    const worker = new Worker({
      name: name,
      manager:manager,
    });
    if (leavesRemaining) {
      worker.leavesRemaining = leavesRemaining;
    }
     
    await worker.save();
    return true;
   },
   createRequest: async function ({ workerId,startDate,endDate}, req) {
    const worker = await Worker.findById(workerId);
    console.log(worker);
    if (!worker) {
     const error = new Error("User not found.");
     error.code = 401;
     throw error;
   }
   
   const request = new Request({
     workerId: worker,
     startDate:startDate,
     endDate:endDate,
     managerId:worker.manager,
   });
   worker.leavesRemaining = worker.leavesRemaining - 1;
   await request.save();
   await worker.save();
   return true;
  },
  getMyRequests: async function ({ workerId}, req) {
    const requests = await Request.find({workerId:workerId});
    const worker = await Worker.findById(workerId)
    const manager = await Manager.findById(worker.manager)
    
    console.log(requests);
    if (!requests) {
     const error = new Error("No requests found for the worker");
     error.code = 401;
     throw error;
     }

    const requestArray = requests.map((req)=> { 
    return {
    id:req._id.toString(),
    workerId:req.workerId.toString(),
    startDate:req.startDate.toString().substring(0,15),
    createdAt:req.createdAt.toString().substring(0,15),
    endDate:req.endDate.toString().slice(0,15),
    status:req.status,
    resolvedBy:manager.name
  }
  });
  console.log(requestArray);
   
   return {Requests:requestArray};
  },
  

  
};
