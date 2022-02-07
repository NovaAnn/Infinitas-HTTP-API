const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Request {
        id:ID!
        workerId:ID!
        workerName:String!
        status:String!
        resolvedBy:String!
        startDate:String!
        endDate:String!
        createdAt:String!
    }
    type workItem {
        id:ID!
        managerId:ID!
        status:String!
        employeeName:String!
        startDate:String!
        endDate:String!
        createdAt:String!
    }
    type employee {
        employeeId:ID!
        name:String!
        leavesRemaining:Int!
        requests:[Request]
    }
    type overlapRequest {
        requestId:ID!
        employeeName:String!
        employeeId:ID!
        startDate:String!
        endDate:String!
        createdAt:String!
    }
    type RequestList{
        Requests: [Request]
    }
    type workList{
        items: [workItem]
    }
    type employeeList{
        employees: [employee]
    }
    type overlapList{
        overlapArray:[overlapRequest]
    }
    type RootQuery {
        getMyRequests(workerId:ID!,status:String):RequestList!
        getLeaves(workerId:ID!):Int!
        getMyWorklistRequests(managerId:ID!,status:String):workList!
        seeMyEmployees(managerId:ID!):employeeList!
        seeSingleEmployee(managerId:ID!,workerId:ID!):employee!
        getOverlappingRequests(managerId:ID!):overlapList!

    }

    type RootMutation {
        createManager(name: String!, dob:String!): Boolean
        createWorker(name: String!,leavesRemaining:Int,managerId:ID!): Boolean
        createRequest(workerId: ID!,startDate:String!,endDate:String!): Boolean
        processRequest(managerId:ID!,requestId:ID!,status:String!):Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
