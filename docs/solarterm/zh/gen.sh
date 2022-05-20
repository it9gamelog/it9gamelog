#!/bin/bash

for i in `seq 1900 2049`; do echo "---
title: $i年回歸黃道宮和二十四節氣日期
description: $i年的二十四節氣和回歸黃道為基準的黃道十二宮(又稱十二星座)的交界日期，常見於西洋占星術和星座運程
---
{% include_relative _solarterm_details.html year=\"$i\" %}" > $i.md; done
