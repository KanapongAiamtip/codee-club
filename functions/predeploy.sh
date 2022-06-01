#!/bin/bash

# Delete existing files
rm -f codee-club-common-*.tgz

# Package common
npm pack ../common
COMMON_PACKAGE=`ls codee-club-common-*.tgz`

# Rewrite package.json to use common from tgz
sed -i.backup -E "s/\"@codee-club\/common\": \"[^\"]*\"/\"@codee-club\/common\": \"file:.\/$COMMON_PACKAGE\"/g" package.json
