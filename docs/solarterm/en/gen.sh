#!/bin/bash

for i in `seq 1900 2049`; do echo "---
title: Dates of $i Zodiac Signs and Solar Terms
description: The dates and times of the tropical zodiac signs, widely used in western astrology, and solar terms of year $i
---
{% include_relative _solarterm_details.html year=\"$i\" %}" > $i.md; done
