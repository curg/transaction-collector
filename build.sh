#!/bin/bash
docker build -t tx-collector .
docker save -o ./tx-collector.tar tx-collector:latest