# DataMiningCloud Engine Hub
DMC Engine System is a distribution process flow system which deploy and run DataMiningCloud services.

## Concepts

### Algorithm
This is the real implementation for the execution. Every node has an algorithm and the model which is the parametrs of this algorithm.

### Ad_Hoc execution
For testing a DataMinging Service or a Trainer, there are lots request for the ad_hoc execution, which will not deploy a real ProcessFlow to the engine. So the ad_hoc execution will create a temporary procss flow, add will be removed automatically when the execution is finished.

### Deployed ProcessFlow execution
For better performance, a process flow can be deployed to the engine and accept the input the data and handle that.

## Archticture
This is a distribution system which based on Docker and Consul.
There are 4 blocks:

Hub: Implementation of API service, a API gateway of the engine. And it will use DB to store the history result.

Consul: Wrap and hold dispatchers and agents. And used as datacenter.

Dispatcher: There will be 1+ dispatchers. It will handle a running of a process flow. A process flow is a map of processers. The dispatcher will send the input data as an event to the agent. And the agent will send another result data event to this dispatcher when it finished.

Agent: Will handle the running event. It has a ReST API endpoint including "get algorithm name", "check status" and "handle the input data". Every agent only has one algorithm. But it can hold several processes at the same time.

## Process
A process is an execution of process flow. The hub will declare a process in the waiting queue which marked as PENDING. The dispatcher(s) will query the waiting queue reqeatly, if there have empty slot could be use, the dispatcher will put that process flow into the slot, mark it as RUNNING and call other engine agents to running the process flow. If the process is completed, the dispatcher will mark it as FINISHED. All status and running log data will be record via Hub service.

## Waiting queue
The HUB have a waiting queue which can be access via ReST API. Dispatchers will query this queue and check the process from old to new.
