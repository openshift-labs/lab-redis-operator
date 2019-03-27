#!/bin/bash

set -x
set -eo pipefail

oc delete clusterrole redis-enterprise-operator
oc delete crd redisenterpriseclusters.app.redislabs.com
