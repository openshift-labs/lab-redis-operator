---
Title: Auto-Recovery
PrevPage: 03-creating-the-database
NextPage: ../finish
---

Now that your Redis cluster is running and you've created a database, let's explore the auto-recovery behavior and see what happens if one of the nodes in the Redis cluster fails.

In the top terminal, we'll run the following `rladmin status` command to watch the status of the Redis nodes.

```execute-1
watch rladmin status
```

You should see something similar to this:
```
CLUSTER NODES:
NODE:ID ROLE   ADDRESS    EXTERNAL_ADDRESS HOSTNAME           SHARDS CORES RAM        AVAILABLE_RAM   VERSION  STATUS
*node:1 master 10.1.10.33                  redis-enterprise-0 0/100  16    2.19GB/4GB 1.47GB/3.28GB   5.4.0-19 OK
node:2  slave  10.1.4.31                   redis-enterprise-1 0/100  16    2.29GB/4GB 1.57GB/3.28GB   5.4.0-19 OK
node:3  slave  10.1.6.38                   redis-enterprise-2 1/100  16    2.28GB/4GB 573.31MB/3.28GB 5.4.0-19 OK

DATABASES:
DB:ID NAME      TYPE  STATUS SHARDS PLACEMENT REPLICATION PERSISTENCE ENDPOINT

db:1  sample-db redis active 1      dense     disabled    disabled    redis-12000.redis-enterprise.redis-lab-workshops-m
grhs.svc.cluster.local:12000

ENDPOINTS:
DB:ID     NAME             ID                    NODE        ROLE        SSL
db:1      sample-db        endpoint:1:1          node:3      single      No

SHARDS:
DB:ID        NAME        ID       NODE    ROLE    SLOTS    USED_MEMORY   STATUS
db:1         sample-db   redis:1  node:3  master  0-16383  3MB           OK
```

Next, we will delete one of the redis-enterprise-# pods to simulate a failure. In the bottom terminal, execute this command to delete one of the pods.

```execute-2
oc delete pod/redis-enterprise-2
```

After the pod is deleted, within about 30 seconds, you should see some updates happen in the top terminal. 

Specifically, the status of the node that you deleted will change from `OK` to `DOWN` until the that pod and Redis node are recovered.

 If you wish, you can watch the pod status in the bottom terminal. 

```execute-2
oc get pods -l app=redis-enterprise --watch
```

Once the `redis-enterprise-2` pod is running and ready again, then you should see the status in the top window go back to `OK`.

Now that you've completed this scenario, you should be familiar with:
* How to create a Redis cluster using the Redis Enterprise operator
* How to create a Redis database and add and retrieve data
* The basics of how the Redis operator handles auto-recovery of nodes in a Redis cluster

Continue to the next page for more resources on OpenShift, Operators, and Redis.


