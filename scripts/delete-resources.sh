#!/bin/bash

set -x

oc delete clusterrole redis-enterprise-operator
oc delete crd redisenterpriseclusters.app.redislabs.com
