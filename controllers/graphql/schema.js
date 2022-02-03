const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Details{
        _id: ID!
        firstName: String!
         lastName: String!
         email: String!
         city: String!
         phoneNumber: Float!
         bankAccount: String!
         streetLine1: String!
    }
    type Request {
        id:ID!
        workerId:ID!
        status:String!
        resolvedBy:String!
        startDate:String!
        endDate:String!
        createdAt:String!
    }
    type RequestList{
        Requests: [Request]
    }

    type RootQuery {
        getMyRequests(workerId:ID!):RequestList!
    }

    type RootMutation {
    createManager(name: String!, dob:String!): Boolean
    createWorker(name: String!,leavesRemaining:Int,managerId:ID!): Boolean
    createRequest(workerId: ID!,startDate:String!,endDate:String!): Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
