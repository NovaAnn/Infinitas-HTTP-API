### API Documentation:

Endpoint : http://localhost:4000/graphql

1. Enable workers to see their requests.Flexibility is there to view all the requests,(if no status given in parameters), and to view the request with a particular status (is status is provided in parameters)

Query Name: getMyRequests
# Arguments:
-->workerId ----ID of the Employee --(Required argument)
-->status   ----request status --(Optional) --- If provided, the API will return the requests with the     given status.If not provided will get all the requests of the employee.
### Fields available for selection:
-->Requests (#Array of objects)
        id          ------> ID of the request
        workerId    ------> ID of the employee
        workerName  ------> name of the employee
        status      ------> status of the request
        resolvedBy  ------> the manager in charge of the request
        startDate   ------> the start date of the vacation
        endDate     ------> the end date of the vacation
        createdAt   ------> the date on which you created the request
        

### Sample Request:
 query {
        getMyRequests(workerId:"61fc0c93245c1349933adb88",status:"Approved"){
      Requests{
        id
        workerId
        resolvedBy
        status
        startDate
        endDate
      }
  } 
}

### Sample Response:
{
  "data": {
    "getMyRequests": {
      "Requests": [
        {
          "id": "61fc286b3cda2c27c0087a4d",
          "workerId": "61fc0c93245c1349933adb88",
          "resolvedBy": "Nova",
          "status": "APPROVED",
          "startDate": "Tue Feb 01 2022",
          "endDate": "Mon Feb 07 2022"
        }
      ]
    }
  }
}

2. Enable workers to see their remaining leaves.

Query Name: getLeaves
### Arguments:
-->workerId ----ID of the Employee --(Required argument)

### Fields available for selection:
-->No fields available since the number of leaves is returned as a primitive numeric value
        

 Sample Request :
 query {
        getLeaves(workerId:"61fc0c93245c1349933adb88")
}

Sample Result :
{
  "data": {
    "getLeaves": 0
  }
}
3. Enable workers to make a new request if they have leaves remaining.

Query Name: createRequest
### Arguments:
-->workerId  ----ID of the Employee --(Required argument)
-->startDate ----Start Date of the vacation
-->endDate   ----End Date of the vacation

### Fields available for selection:
No fields available for selection, returns a Boolean.Returns True if request is created successfully.
        

### Sample Request:
 mutation {
        createRequest(workerId:"61fc0c93245c1349933adb88",startDate:"2022-03-04",endDate:"2022-03-10") 
       }

### Sample Response:
{
  "data": {
    "createRequest": true
  }
}

4. Enable managers to see all their requests.

Query Name: getMyWorklistRequests
### Arguments:
-->managerId ----ID of the Manager --(Required argument)
-->status   ----request status --(Optional) --- If provided, the API will return the requests with the    given status.If not provided will get all the requests.
### Fields available for selection:
-->items (#Array of objects)
        id          ------> ID of the request
        managerId   ------> ID of the manager
        employeeName ------> name of the employee
        status      ------> status of the request
        startDate   ------> the start date of the vacation
        endDate     ------> the end date of the vacation
        createdAt   ------> the date on which you created the request
        

### Sample Request:
 query {
        getMyWorklistRequests(managerId:"61fc0556a2869e9b59cf0c0c",status:"Pending"){
      items{
        id
        managerId
        employeeName
        status
        startDate
        endDate
        createdAt
      }
  } 
}

### Sample Response:
{
  "data": {
    "getMyWorklistRequests": {
      "items": [
        {
          "id": "61fc1091f926191c70ccdd69",
          "managerId": "61fc0556a2869e9b59cf0c0c",
          "employeeName": "Bhanu",
          "status": "PENDING",
          "startDate": "Sun Jan 02 2022",
          "endDate": "Wed Jan 05 2022",
          "createdAt": "Thu Feb 03 2022"
        },
        {
          "id": "61fc48befa984b62a7dbb78e",
          "managerId": "61fc0556a2869e9b59cf0c0c",
          "employeeName": "Bhanu",
          "status": "PENDING",
          "startDate": "Thu Jan 13 2022",
          "endDate": "Wed Jan 19 2022",
          "createdAt": "Thu Feb 03 2022"
        }
      ]
    }
  }
}
5. Enable managers to see individual employee.

Query Name: seeSingleEmployee
### Arguments:
-->managerId ----ID of the Manager --(Required argument)
-->workerId  ----ID of the Employee --(Required argument)
### Fields available for selection:
        employeeId      ------> ID of the request
        leavesRemaining ------> ID of the employee
        name            ------> name of the employee
        requests (Array of requests)
                id          ------> ID of the request
                workerId    ------> ID of the employee
                status      ------> status of the request
                resolvedBy  ------> the manager in charge of the request
                startDate   ------> the start date of the vacation
                endDate     ------> the end date of the vacation
                createdAt   ------> the date on which you created the request
        

### Sample Request:
 query {
        seeSingleEmployee(managerId:"61fc0556a2869e9b59cf0c0c",workerId:"61fc0c93245c1349933adb88"){
      employeeId
      name
      leavesRemaining
      requests{
        id
        workerId
        resolvedBy
        status
        startDate
        endDate
        createdAt
      }
  } 
}

### Sample Response:
{
  "data": {
    "seeSingleEmployee": {
      "employeeId": "61fc0c93245c1349933adb88",
      "name": "Bhanu",
      "leavesRemaining": 0,
      "requests": [
        {
          "id": "61fc49059febc377b3ecea51",
          "workerId": "61fc0c93245c1349933adb88",
          "status": "PENDING",
          "resolvedBy": "Nova",
          "endDate": "Wed Jan 19 2022",
          "createdAt": "Thu Feb 03 2022"
        }
      ]
    }
  }
}
6. Enable managers to see overlapping requests. This allows to see the requests, for which the dates are overlapping and would help the manager to decide whether to approve/reject the request.

Query Name: getOverlappingRequests
### Arguments:
-->managerId ----ID of the Manager --(Required argument)

### Fields available for selection:
-->overlapArray (#Array of objects)
        requestId    ------> ID of the request
        employeeId   ------> ID of the employee
        employeeName ------> name of the employee
        startDate    ------> the start date of the vacation
        endDate      ------> the end date of the vacation
        createdAt    ------> the date on which you created the request
        

### Sample Request:
 query {
        getOverlappingRequests(managerId:"61fc0556a2869e9b59cf0c0c"){
      overlapArray{
        requestId
        employeeId
        employeeName
        startDate
        endDate
        createdAt
      }
  } 
}

### Sample Response:
{
  "data": {
    "getOverlappingRequests": {
      "overlapArray": [
        {
          "requestId": "61fc48befa984b62a7dbb78e",
          "employeeId": "61fc0c93245c1349933adb88",
          "employeeName": "Bhanu",
          "startDate": "Thu Jan 13 2022",
          "endDate": "Wed Jan 19 2022",
          "createdAt": "Thu Feb 03 2022"
        },
        {
          "requestId": "61fc49059febc377b3ecea51",
          "employeeId": "61fc0c93245c1349933adb88",
          "employeeName": "Bhanu",
          "startDate": "Sat Jan 15 2022",
          "endDate": "Wed Jan 19 2022",
          "createdAt": "Thu Feb 03 2022"
        }
      ]
    }
  }
}
7. Enable managers to resolve a particular request with a specific status.

Query Name: processRequest
### Arguments:
-->managerId ----ID of the Manager --(Required argument)
-->requestId ----ID of the Request --(Required argument)
-->status    ----status as decided by the manager 

### Fields available for selection:

No fields available for selection, returns a Boolean.Returns True if request is processed successfully.

### Sample Request:
 mutation {
        processRequest(managerId:"61fc0556a2869e9b59cf0c0c",requestId:"61fc1091f926191c70ccdd69",status:"APPROVED") 
        }

### Sample Response:
{
  "data": {
    "processRequest": true
  }
}